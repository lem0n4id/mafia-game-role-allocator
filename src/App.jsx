import { useState } from 'react';
import PlayerCountManager from './components/PlayerCountManager.jsx';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState([]);
  const [validation, setValidation] = useState({ isValid: false });

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
        <div className="max-w-lg mx-auto">
          <PlayerCountManager
            initialCount={5}
            onCountChange={setPlayerCount}
            onNamesChange={setPlayerNames}
            onValidationChange={setValidation}
          />

          {/* Debug info for development */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Debug Info:</h4>
              <p>Player Count: {playerCount}</p>
              <p>Names: {JSON.stringify(playerNames)}</p>
              <p>Valid: {validation.isValid ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-gray-500 text-sm text-center">
        <p>Player Count Management • Ready for Role Allocation</p>
      </footer>
    </div>
  );
}

export default App;
