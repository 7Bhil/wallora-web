import { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';

const MEDAL_COLORS = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/wallpapers/leaderboard');
        if (res.ok) setLeaderboard(await res.json());
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch_();
  }, []);

  if (loading) return <div className="p-10 text-gray-400">Loading ranking...</div>;

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Global Ranking</h2>
        <p className="text-gray-500 font-medium text-sm">Top wallpapers by ELO prestige score.</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center bg-white/[0.02] border border-white/5 rounded-3xl p-16">
          <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No wallpapers ranked yet. Battle to rank them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leaderboard.map((wp, index) => (
            <div key={wp._id} className="group relative rounded-3xl overflow-hidden bg-black/40 aspect-[3/4] shadow-xl cursor-pointer border border-white/5 hover:border-purple-500/50 transition">
              <img src={wp.url} alt="wallpaper" className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Rank badge */}
              <div className="absolute top-4 left-4">
                {index < 3 ? (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
                    <Medal size={14} className={MEDAL_COLORS[index]} />
                    <span className="text-white font-black text-xs">#{index + 1}</span>
                  </div>
                ) : (
                  <span className="bg-black/50 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white px-3 py-1.5 rounded-full">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-purple-300 font-bold text-lg">{wp.eloScore}</span>
                    <p className="text-gray-500 text-xs font-medium mt-0.5">ELO Score</p>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold text-sm">{wp.wins || 0}W</span>
                    <p className="text-gray-500 text-xs font-medium">{wp.matches || 0} matches</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
