import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/wallpapers/leaderboard');
        if (res.ok) setLeaderboard(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">🔥 Classement Global 🔥</h2>
      
      {leaderboard.length === 0 ? (
        <p className="text-gray-400 mt-4">Aucun fond d'écran pour le moment.</p>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {leaderboard.map((wp, index) => (
            <div key={wp._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 relative">
              <div className="absolute top-2 left-2 bg-black/70 text-white font-bold py-1 px-3 rounded-md z-10">
                #{index + 1}
              </div>
              <img src={wp.url} alt="wallpaper" className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition" />
              <div className="p-3 text-center">
                <p className="font-semibold text-blue-300">Elo: {wp.eloScore}</p>
                <p className="text-xs text-gray-400">{wp.wins} victoires / {wp.matches} duels</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
