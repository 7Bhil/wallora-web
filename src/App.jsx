import { useState } from 'react';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';
import Upload from './components/Upload';
import './App.css';

function App() {
  const [view, setView] = useState('battle');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer" onClick={() => setView('battle')}>
              WallBattle ⚔️
            </h1>
            <div className="space-x-2 md:space-x-4 flex">
              <button onClick={() => setView('battle')} className={`px-4 py-2 rounded-md font-bold transition ${view === 'battle' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Jouer</button>
              <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-md font-bold transition ${view === 'leaderboard' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Classement</button>
              <button onClick={() => setView('upload')} className={`px-4 py-2 rounded-md font-bold transition ${view === 'upload' ? 'bg-emerald-600' : 'bg-emerald-800 hover:bg-emerald-700'}`}>+ Ajouter</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8">
        {view === 'battle' && <Battle />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'upload' && <Upload />}
      </main>
    </div>
  )
}

export default App;
