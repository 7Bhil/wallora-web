import { useState, useEffect } from 'react';
import { Trophy, Medal, Users, Image as ImageIcon } from 'lucide-react';

const MEDAL_COLORS = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'users'
  const [imageLeaderboard, setImageLeaderboard] = useState([]);
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://wallora-server.onrender.com';
        const [resImages, resUsers] = await Promise.all([
          fetch(`${API_URL}/api/wallpapers/leaderboard`),
          fetch(`${API_URL}/api/users/leaderboard`)
        ]);
        
        if (resImages.ok) setImageLeaderboard(await resImages.json());
        if (resUsers.ok) setUserLeaderboard(await resUsers.json());
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch_();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1 uppercase tracking-widest">Global Ranking</h2>
          <p className="text-gray-500 font-medium text-sm">Top wallpapers and curators by ELO prestige score.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'images' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon size={18} />
            Images
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={18} />
            Curators
          </button>
        </div>
      </div>

      {activeTab === 'images' ? (
        <>
          {imageLeaderboard.length === 0 ? (
            <div className="text-center bg-white/[0.02] border border-white/5 rounded-3xl p-16">
              <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No wallpapers ranked yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {imageLeaderboard.map((wp, index) => (
                <div key={wp._id} className="group relative rounded-3xl overflow-hidden bg-black/40 aspect-[3/4] shadow-xl border border-white/5 hover:border-purple-500/50 transition">
                  <img src={wp.url} alt="wallpaper" className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

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

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-purple-300 font-bold text-lg">{wp.eloScore}</span>
                        <p className="text-gray-500 text-xs font-medium mt-0.5 uppercase tracking-tighter">ELO Score</p>
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
        </>
      ) : (
        <div className="space-y-4">
          {userLeaderboard.length === 0 ? (
            <div className="text-center bg-white/[0.02] border border-white/5 rounded-3xl p-16">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No curators ranked yet.</p>
            </div>
          ) : (
            userLeaderboard.map((u, index) => (
              <div key={u._id} className="flex items-center bg-white/[0.03] border border-white/5 p-4 rounded-3xl hover:bg-white/[0.05] transition group">
                <div className="w-12 text-center">
                  <span className={`font-black ${index < 3 ? MEDAL_COLORS[index] : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 mr-6">
                  <img 
                    src={u.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.username}`} 
                    alt={u.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition">{u.username}</h4>
                  <p className="text-gray-500 text-sm font-medium">{u.wallpapersCount} wallpapers uploaded</p>
                </div>
                <div className="text-right px-8">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Prestige</p>
                  <span className="text-3xl font-black text-white">{u.totalPrestige}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
