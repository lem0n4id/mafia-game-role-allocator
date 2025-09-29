import { useState } from 'react';
import PlayerCountManager from './components/PlayerCountManager.jsx';
import MafiaCountValidator from './components/MafiaCountValidator.jsx';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerValidation, setPlayerValidation] = useState({ isValid: false });
  const [mafiaCount, setMafiaCount] = useState(1);
  const [mafiaValidation, setMafiaValidation] = useState({
    isValid: true,
    canProceed: true,
  });

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
          Configure your game by entering player count and names.
        </p>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto space-y-6">
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
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-gray-500 text-sm text-center">
        <p>
          Input & Validation •{' '}
          {overallValidation.isValid
            ? 'Ready for Role Allocation'
            : 'Complete all fields to proceed'}
        </p>
      </footer>
    </div>
  );
}

export default App;
