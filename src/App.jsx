import { useState } from 'react';
import PlayerCountManager from './components/PlayerCountManager.jsx';
import MafiaCountValidator from './components/MafiaCountValidator.jsx';
import AllocationConfirmationFlow from './components/AllocationConfirmationFlow.jsx';
import { useRoleAssignment } from './hooks/useRoleAssignment.js';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerValidation, setPlayerValidation] = useState({ isValid: false });
  const [mafiaCount, setMafiaCount] = useState(1);
  const [mafiaValidation, setMafiaValidation] = useState({
    isValid: true,
    canProceed: true,
  });

  // Role assignment state
  const {
    assignment,
    isAssigning,
    assignmentError,
    statistics,
    hasEdgeCases,
    edgeCaseInfo,
    createAssignment,
    reassignRoles,
    clearAssignment,
    ROLES
  } = useRoleAssignment();

  // Handle allocation confirmation and trigger role assignment
  const handleAllocate = async allocationParams => {
    try {
      console.log('Starting role allocation with params:', allocationParams);
      
      // Create role assignment using the engine
      const newAssignment = await createAssignment(
        allocationParams.playerNames,
        allocationParams.mafiaCount
      );
      
      console.log('Role allocation completed successfully:', {
        assignmentId: newAssignment.metadata.assignmentId,
        mafiaPlayers: newAssignment.statistics.mafiaNames,
        villagerPlayers: newAssignment.statistics.villagerNames,
        hasEdgeCases,
        edgeCaseInfo
      });
      
    } catch (error) {
      console.error('Role allocation failed:', error);
      // Error is already stored in assignmentError state
    }
  };

  // Handle re-allocation (reassign with same players/mafia count)
  const handleReassign = async () => {
    try {
      console.log('Re-allocating roles with same parameters');
      await reassignRoles();
      console.log('Re-allocation completed successfully');
    } catch (error) {
      console.error('Re-allocation failed:', error);
    }
  };

  // Handle reset - clear assignment and return to input mode
  const handleReset = () => {
    clearAssignment();
    console.log('Assignment cleared - returned to input mode');
  };

  // Combined validation state
  const overallValidation = {
    isValid:
      playerValidation.isValid &&
      mafiaValidation.isValid &&
      mafiaValidation.canProceed,
    playerValidation,
    mafiaValidation,
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto md:p-8">
      <header className="py-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
          Mafia Game Role Allocator
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {assignment 
            ? 'Roles have been assigned! View the assignment details below.'
            : 'Configure your game by entering player count and names.'}
        </p>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto space-y-6">
          {!assignment ? (
            // Input & Validation Phase
            <>
              <div className="space-y-6">
                <PlayerCountManager
                  initialCount={5}
                  onCountChange={setPlayerCount}
                  onNamesChange={setPlayerNames}
                  onValidationChange={setPlayerValidation}
                  mafiaCountSection={
                    <MafiaCountValidator
                      playerCount={playerCount}
                      initialMafiaCount={1}
                      onMafiaCountChange={setMafiaCount}
                      onValidationChange={setMafiaValidation}
                    />
                  }
                />
              </div>

              {/* Allocation Confirmation Flow */}
              <AllocationConfirmationFlow
                playerNames={playerNames}
                mafiaCount={mafiaCount}
                isFormValid={overallValidation.isValid}
                onAllocate={handleAllocate}
                disabled={isAssigning}
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
          ) : (
            // Assignment Results Phase
            <div className="space-y-6">
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
                    <span className="text-green-800 ml-1">{statistics.totalPlayers}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Assignment ID:</span>
                    <span className="text-green-800 ml-1 font-mono text-xs">{statistics.assignmentId.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Mafia Players:</span>
                    <span className="text-red-800 ml-1">{statistics.mafiaCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Villagers:</span>
                    <span className="text-blue-800 ml-1">{statistics.villagerCount}</span>
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
                  {assignment.players.map((player, index) => (
                    <div 
                      key={player.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${player.role === ROLES.MAFIA 
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
                          ${player.role === ROLES.MAFIA 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'}
                        `}
                      >
                        {player.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReassign}
                  disabled={isAssigning}
                  className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isAssigning ? 'Reassigning...' : 'Reassign Roles'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isAssigning}
                  className="flex-1 h-12 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Reset Game
                </button>
              </div>
            </div>
          )}

          {/* Debug info for development */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Debug Info:</h4>
              <p>Player Count: {playerCount}</p>
              <p>Names: {JSON.stringify(playerNames)}</p>
              <p>Mafia Count: {mafiaCount}</p>
              <p>Player Valid: {playerValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Mafia Valid: {mafiaValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Can Proceed: {mafiaValidation.canProceed ? 'Yes' : 'No'}</p>
              <p>Overall Valid: {overallValidation.isValid ? 'Yes' : 'No'}</p>
              <p>Has Assignment: {assignment ? 'Yes' : 'No'}</p>
              <p>Is Assigning: {isAssigning ? 'Yes' : 'No'}</p>
              {assignment && (
                <>
                  <p>Assignment ID: {statistics.assignmentId}</p>
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
            ? `Role Allocation Complete • ${statistics.mafiaCount} Mafia vs ${statistics.villagerCount} Villagers`
            : `Input & Validation • ${overallValidation.isValid ? 'Ready for Role Allocation' : 'Complete all fields to proceed'}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
