import { useState } from 'react';
import PlayerCountManager from './components/PlayerCountManager.jsx';
import RoleConfigurationManager from './components/RoleConfigurationManager.jsx';
import AllocationConfirmationFlow from './components/AllocationConfirmationFlow.jsx';
import CardListInterface from './components/CardListInterface.jsx';
import RoleRevealDialog from './components/RoleRevealDialog.jsx';
import ResetButtonSystem from './components/ResetButtonSystem.jsx';
import { useRoleAssignment } from './hooks/useRoleAssignment.js';
import { useRoleRevealDialog } from './hooks/useRoleRevealDialog.js';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerValidation, setPlayerValidation] = useState({ isValid: false });
  
  // Role configuration state (replaces mafiaCount)
  const [roleConfiguration, setRoleConfiguration] = useState(null);
  const [roleValidation, setRoleValidation] = useState({
    isValid: true,
    hasErrors: false,
  });

  // Role assignment state (from useRoleAssignment hook)
  const {
    assignment,
    isAssigning,
    assignmentError,
    statistics,
    hasEdgeCases,
    edgeCaseInfo,
    createAssignment,
    clearAssignment,
    markPlayerRevealed,
    ROLES
  } = useRoleAssignment();

  // Card list reveal state (for sequential reveal interface)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showCardListInterface, setShowCardListInterface] = useState(false);

  // Dialog state (from useRoleRevealDialog hook)
  const {
    isOpen: isDialogOpen,
    currentPlayer: dialogPlayer,
    openDialog,
    closeDialog,
    handleRevealComplete
  } = useRoleRevealDialog();

  // Handle role configuration changes from RoleConfigurationManager
  const handleRoleConfigurationChange = (config) => {
    setRoleConfiguration(config.roleCounts);
    setRoleValidation(config.validation);
  };

  // Handle allocation confirmation and trigger role assignment
  const handleAllocate = async allocationParams => {
    try {
      const isReallocation = allocationParams.isReallocation || false;
      console.log(`Starting ${isReallocation ? 're-allocation' : 'allocation'} with params:`, allocationParams);
      
      // Clear reveal states if this is a re-allocation
      if (isReallocation) {
        setShowCardListInterface(false);
        setCurrentPlayerIndex(0);
        closeDialog();
        console.log('Cleared reveal states for re-allocation');
      }
      
      // Create role assignment using role configuration
      const newAssignment = await createAssignment(
        allocationParams.playerNames,
        allocationParams.roleConfiguration || allocationParams.mafiaCount // Support both legacy and new
      );
      
      console.log(`Role ${isReallocation ? 're-allocation' : 'allocation'} completed successfully:`, {
        assignmentId: newAssignment?.metadata?.assignmentId,
        hasEdgeCases,
        edgeCaseInfo
      });
      
    } catch (error) {
      console.error('Role allocation failed:', error);
      // Error is already stored in assignmentError state
    }
  };

  // Handle switching to card list reveal interface
  const handleStartReveal = () => {
    if (assignment) {
      setShowCardListInterface(true);
      setCurrentPlayerIndex(0);
      console.log('Switched to card list reveal interface');
    }
  };

  // Handle player role reveal (for card list interface)
  const handlePlayerReveal = ({ playerName, playerIndex }) => {
    if (isDialogOpen || !assignment) return;
    
    // Strict order enforcement: only allow current player to reveal
    if (playerIndex !== currentPlayerIndex) {
      console.warn(`Order enforcement: Cannot reveal player at index ${playerIndex}. Current player is at index ${currentPlayerIndex}`);
      return;
    }
    
    console.log(`Opening reveal dialog for ${playerName} (index: ${playerIndex})`);
    
    // Get the player's data
    const player = assignment.players[playerIndex];
    
    // Open the reveal dialog
    openDialog(player);
  };

  // Handle when player closes the dialog after viewing their role
  const handleDialogClose = () => {
    if (!dialogPlayer) return;
    
    const playerIndex = assignment.players.findIndex(p => p.id === dialogPlayer.id);
    
    if (playerIndex !== -1) {
      // Mark player as revealed in the assignment
      markPlayerRevealed(playerIndex);
      
      // Advance to next player if not at the end
      if (playerIndex < assignment.players.length - 1) {
        setCurrentPlayerIndex(playerIndex + 1);
      }
      
      console.log(`Role revealed for ${dialogPlayer.name}: ${dialogPlayer.role}`);
    }
    
    // Close the dialog
    closeDialog();
  };



  // Handle reset - clear assignment and return to input mode
  const handleReset = () => {
    clearAssignment();
    setShowCardListInterface(false);
    setCurrentPlayerIndex(0);
    closeDialog();
    console.log('Assignment cleared - returned to input mode');
  };

  // Combined validation state
  const overallValidation = {
    isValid:
      playerValidation.isValid &&
      roleValidation.isValid &&
      !roleValidation.hasErrors,
    playerValidation,
    roleValidation,
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto md:p-8">
      <header className="py-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
          Mafia Game Role Allocator
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {assignment 
            ? (showCardListInterface 
                ? 'Reveal your roles in order. Only the current player can reveal.'
                : 'Roles have been assigned! View assignment details or start revealing.')
            : 'Configure your game by entering player count and names.'}
        </p>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto space-y-6">
          {!assignment || !showCardListInterface ? (
            // Input & Validation Phase (or Assignment Results Phase)
            <>
              {!assignment && (
                <div className="space-y-6">
                  <PlayerCountManager
                    initialCount={playerCount}
                    initialNames={playerNames}
                    onCountChange={setPlayerCount}
                    onNamesChange={setPlayerNames}
                    onValidationChange={setPlayerValidation}
                  />
                  
                  {/* Role Configuration Manager - replaces MafiaCountValidator */}
                  <RoleConfigurationManager
                    totalPlayers={playerCount}
                    onConfigurationChange={handleRoleConfigurationChange}
                    disabled={false}
                  />
                </div>
              )}

              {/* Allocation Confirmation Flow - Always available */}
              {!assignment && (
                <>
                  <AllocationConfirmationFlow
                    playerNames={playerNames}
                    roleConfiguration={roleConfiguration}
                    isFormValid={overallValidation.isValid}
                    onAllocate={handleAllocate}
                    disabled={isAssigning}
                    hasExistingAssignment={false}
                    currentAssignment={null}
                  />

                  {/* Assignment Error Display */}
                  {assignmentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">Assignment Failed</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{assignmentError}</p>
                    </div>
                  )}
                </>
              )}

              {/* Assignment Results Phase */}
              {assignment && !showCardListInterface && (
                <div className="space-y-6">
                  {/* Assignment Error Display */}
                  {assignmentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">Assignment Failed</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{assignmentError}</p>
                    </div>
                  )}

                  {/* Assignment Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg font-medium text-green-800">Roles Assigned Successfully!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Total Players:</span>
                        <span className="text-green-800 ml-1">{statistics?.totalPlayers}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Assignment ID:</span>
                        <span className="text-green-800 ml-1 font-mono text-xs">{statistics?.assignmentId?.slice(-8)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-red-700">Mafia Players:</span>
                        <span className="text-red-800 ml-1">{statistics?.mafiaCount}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Villagers:</span>
                        <span className="text-blue-800 ml-1">{statistics?.villagerCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edge Case Warning */}
                  {hasEdgeCases && edgeCaseInfo && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">Unusual Game Configuration</span>
                      </div>
                      <p className="text-sm text-yellow-700">{edgeCaseInfo.description}</p>
                      <p className="text-xs text-yellow-600 mt-1">Impact: {edgeCaseInfo.impact}</p>
                    </div>
                  )}

                  {/* Role Assignment Display */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Player Assignments</h3>
                    <div className="space-y-2">
                      {assignment.players.map((player, index) => {
                        // Handle both legacy string roles and new role objects
                        const roleId = typeof player.role === 'string' ? player.role : player.role.id;
                        const roleName = typeof player.role === 'string' ? player.role : player.role.name;
                        const isMafia = roleId === ROLES.MAFIA;
                        
                        return (
                        <div 
                          key={player.id}
                          className={`
                            flex items-center justify-between p-3 rounded-lg border
                            ${isMafia 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-blue-50 border-blue-200'}
                          `}
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-800">{player.name}</span>
                          </div>
                          <span 
                            className={`
                              px-3 py-1 rounded-full text-xs font-medium
                              ${isMafia 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'}
                            `}
                          >
                            {roleName}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleStartReveal}
                      className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 touch-manipulation"
                    >
                      Start Revealing Roles
                    </button>
                    
                    {/* Re-allocation Button using AllocationConfirmationFlow */}
                    <AllocationConfirmationFlow
                      playerNames={playerNames}
                      roleConfiguration={roleConfiguration}
                      isFormValid={overallValidation.isValid}
                      onAllocate={handleAllocate}
                      disabled={isAssigning}
                      hasExistingAssignment={true}
                      currentAssignment={assignment}
                    />
                    
                    {/* Reset Button with Confirmation */}
                    <ResetButtonSystem
                      hasActiveGame={true}
                      currentAssignment={assignment}
                      onReset={handleReset}
                      disabled={isAssigning}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            // Card List Reveal Phase
            <>
              <CardListInterface
                assignment={assignment}
                currentPlayerIndex={currentPlayerIndex}
                onPlayerReveal={handlePlayerReveal}
                revealInProgress={isDialogOpen}
              />
              
              {/* Role Reveal Dialog */}
              <RoleRevealDialog
                isOpen={isDialogOpen}
                player={dialogPlayer}
                onClose={handleDialogClose}
                onRevealComplete={handleRevealComplete}
              />
              
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowCardListInterface(false)}
                  className="flex-1 h-12 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 touch-manipulation"
                >
                  Back to Assignment
                </button>
                
                {/* Reset Button with Confirmation */}
                <div className="flex-1">
                  <ResetButtonSystem
                    hasActiveGame={true}
                    currentAssignment={assignment}
                    onReset={handleReset}
                    disabled={false}
                  />
                </div>
              </div>
            </>
          )}

          {/* Debug info for development */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Debug Info:</h4>
              <p>Player Count: {playerCount}</p>
              <p>Names: {JSON.stringify(playerNames)}</p>
              <p>Role Config: {JSON.stringify(roleConfiguration)}</p>
              <p>Player Valid: {playerValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Role Valid: {roleValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Has Errors: {roleValidation.hasErrors ? 'Yes' : 'No'}</p>
              <p>Overall Valid: {overallValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Has Assignment: {assignment ? 'Yes' : 'No'}</p>
              <p>Is Assigning: {isAssigning ? 'Yes' : 'No'}</p>
              <p>Show Card List: {showCardListInterface ? 'Yes' : 'No'}</p>
              <p>Current Player: {currentPlayerIndex}</p>
              <p>Dialog Open: {isDialogOpen ? 'Yes' : 'No'}</p>
              {assignment && (
                <>
                  <p>Assignment ID: {statistics?.assignmentId}</p>
                  <p>Has Edge Cases: {hasEdgeCases ? 'Yes' : 'No'}</p>
                  {edgeCaseInfo && <p>Edge Case: {edgeCaseInfo.type}</p>}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-gray-500 text-sm text-center">
        <p>
          {assignment 
            ? (showCardListInterface 
                ? `Role Reveal • ${assignment.players.filter(p => p.revealed).length}/${assignment.players.length} revealed`
                : `Role Allocation Complete • ${statistics?.mafiaCount} Mafia vs ${statistics?.villagerCount} Villagers`)
            : `Input & Validation • ${overallValidation.isValid ? 'Ready for Role Allocation' : 'Complete all fields to proceed'}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
