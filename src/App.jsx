import { useState } from 'react';
import PlayerCountManager from './components/PlayerCountManager.jsx';
import MafiaCountValidator from './components/MafiaCountValidator.jsx';
import AllocationConfirmationFlow from './components/AllocationConfirmationFlow.jsx';
import CardListInterface from './components/CardListInterface.jsx';
import { createRoleAssignment, revealPlayer } from './utils/roleAssignmentEngine.js';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerValidation, setPlayerValidation] = useState({ isValid: false });
  const [mafiaCount, setMafiaCount] = useState(1);
  const [mafiaValidation, setMafiaValidation] = useState({
    isValid: true,
    canProceed: true,
  });

  // Role assignment and reveal state
  const [assignment, setAssignment] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealInProgress, setRevealInProgress] = useState(false);

  // Handle allocation confirmation and trigger role assignment
  const handleAllocate = async allocationParams => {
    console.log('Starting role allocation with params:', allocationParams);
    
    try {
      // Create role assignment using the engine
      const newAssignment = createRoleAssignment(
        allocationParams.playerNames,
        allocationParams.mafiaCount
      );
      
      console.log('Role assignment created:', newAssignment);
      
      // Update state to show card list
      setAssignment(newAssignment);
      setCurrentPlayerIndex(0); // Start with first player
      
      console.log('Role allocation completed successfully');
    } catch (error) {
      console.error('Role allocation failed:', error);
      alert('Failed to allocate roles. Please try again.');
    }
  };

  // Handle player role reveal
  const handlePlayerReveal = async ({ playerName, playerIndex }) => {
    if (revealInProgress || !assignment) return;
    
    console.log(`Revealing role for ${playerName} (index: ${playerIndex})`);
    setRevealInProgress(true);
    
    try {
      // Simulate reveal process (this would show a dialog in future features)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update assignment with revealed player
      const updatedAssignment = revealPlayer(assignment, playerIndex);
      setAssignment(updatedAssignment);
      
      // Advance to next player if not at the end
      if (playerIndex < assignment.players.length - 1) {
        setCurrentPlayerIndex(playerIndex + 1);
      }
      
      console.log(`Role revealed for ${playerName}: ${updatedAssignment.players[playerIndex].role}`);
    } catch (error) {
      console.error('Role reveal failed:', error);
    } finally {
      setRevealInProgress(false);
    }
  };

  // Handle reset to go back to input phase
  const handleReset = () => {
    setAssignment(null);
    setCurrentPlayerIndex(0);
    setRevealInProgress(false);
    // Keep player names to preserve user input
    console.log('Reset to input phase, keeping player names');
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
            ? 'Reveal your roles in order. Only the current player can reveal.'
            : 'Configure your game by entering player count and names.'
          }
        </p>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto space-y-6">
          {assignment ? (
            /* Role Display Phase */
            <>
              <CardListInterface
                assignment={assignment}
                currentPlayerIndex={currentPlayerIndex}
                onPlayerReveal={handlePlayerReveal}
                revealInProgress={revealInProgress}
              />
              
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full h-12 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium rounded-xl transition-all duration-150 touch-manipulation"
              >
                Reset & Re-Allocate
              </button>
            </>
          ) : (
            /* Input & Validation Phase */
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
              />
            </>
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
              <p>Assignment: {assignment ? 'Created' : 'None'}</p>
              <p>Current Player: {currentPlayerIndex}</p>
              <p>Reveal In Progress: {revealInProgress ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-gray-500 text-sm text-center">
        <p>
          {assignment 
            ? `Role Display & Reveal • ${assignment.players.filter(p => p.revealed).length}/${assignment.players.length} revealed`
            : `Input & Validation • ${overallValidation.isValid ? 'Ready for Role Allocation' : 'Complete all fields to proceed'}`
          }
        </p>
      </footer>
    </div>
  );
}

export default App;
