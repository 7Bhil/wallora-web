import { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';

export default function Battle() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(null);

  // Compression helper
  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_1200/');
  }; 

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://wallora-server.onrender.com';
      const res = await fetch(`${API_URL}/api/wallpapers/battle`);
      if (res.ok) setWallpapers(await res.json());
      else setWallpapers([]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchWallpapers(); }, []);

  const handleVote = async (winnerId, loserId, side) => {
    if (voted) return;
    setVoted(side);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://wallora-server.onrender.com';
      await fetch(`${API_URL}/api/wallpapers/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId })
      });
    } catch (e) {
      console.error(e);
    }
    // Auto-advance to next duel after 800ms
    setTimeout(() => fetchWallpapers(), 800);
  };

  if (loading) return (
    <div className="flex-1 h-full flex items-center justify-center">
      <div className="text-center">
        <Swords size={40} className="text-purple-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400 font-medium">Preparing the Arena...</p>
      </div>
    </div>
  );

  if (wallpapers.length < 2) return (
    <div className="flex-1 h-full flex items-center justify-center p-8">
      <div className="text-center bg-white/[0.02] border border-white/5 rounded-3xl p-12 max-w-md">
        <Swords size={48} className="text-gray-600 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-white mb-3">Arena is Empty</h3>
        <p className="text-gray-400 text-sm">You need at least 2 wallpapers to start a battle. Upload some first in the Vault.</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pt-8 pb-4 px-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Arena</h2>
          <p className="text-gray-500 text-sm font-medium">Vote for the superior wallpaper</p>
        </div>
      </div>

      {/* Battle Cards — take all remaining height */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 min-h-0 px-8 pb-8">
        {/* LEFT */}
        <div
          className={`flex-1 relative cursor-pointer overflow-hidden rounded-3xl group transition-all duration-500 ${voted === 'right' ? 'opacity-30 scale-95' : voted === 'left' ? 'ring-4 ring-purple-400 ring-offset-4 ring-offset-[#0d0914]' : 'hover:ring-2 hover:ring-white/20'} md:mr-3`}
          onClick={() => handleVote(wallpapers[0]._id, wallpapers[1]._id, 'left')}
        >
          <img src={wallpapers[0].url} alt="challenger 1" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${voted === 'left' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="bg-purple-500/80 backdrop-blur-md rounded-full px-8 py-4 border border-purple-300/50">
              <span className="text-white font-black text-2xl tracking-widest">VOTE</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="block text-white font-black text-xl drop-shadow-lg">ELO {wallpapers[0].eloScore}</span>
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex md:flex-col items-center justify-center z-10 px-2 md:px-0 md:py-4 gap-4 md:gap-0">
          <div className="hidden md:block h-full w-px bg-white/5"></div>
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#0d0914] border border-white/10 flex items-center justify-center shadow-2xl my-4">
            <span className="text-xs font-black text-gray-500 tracking-widest">VS</span>
          </div>
          <div className="hidden md:block h-full w-px bg-white/5"></div>
        </div>

        {/* RIGHT */}
        <div
          className={`flex-1 relative cursor-pointer overflow-hidden rounded-3xl group transition-all duration-500 ${voted === 'left' ? 'opacity-30 scale-95' : voted === 'right' ? 'ring-4 ring-purple-400 ring-offset-4 ring-offset-[#0d0914]' : 'hover:ring-2 hover:ring-white/20'} md:ml-3`}
          onClick={() => handleVote(wallpapers[1]._id, wallpapers[0]._id, 'right')}
        >
          <img src={optimizeImage(wallpapers[1].url)} alt="challenger 2" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${voted === 'right' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="bg-purple-500/80 backdrop-blur-md rounded-full px-8 py-4 border border-purple-300/50">
              <span className="text-white font-black text-2xl tracking-widest">VOTE</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="block text-white font-black text-xl drop-shadow-lg">ELO {wallpapers[1].eloScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
