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
  const fetchWallpapers = async () => {
    setLoading(true);
    setVoted(null);
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
        <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Preparing the Arena...</p>
      </div>
    </div>
  );

  if (wallpapers.length < 2) return (
    <div className="flex-1 h-full flex items-center justify-center p-8">
      <div className="text-center bg-white/[0.02] border border-white/5 rounded-[40px] p-16 max-w-md shadow-2xl">
        <Swords size={48} className="text-gray-800 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Arena is Empty</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          The battle cannot begin without challengers. Upload at least 2 masterpieces to start the competition.
        </p>
      </div>
    </div>
  );

  const renderCard = (w, side) => (
    <div
      className={`flex-1 relative cursor-pointer overflow-hidden rounded-3xl group transition-all duration-500 
        ${voted && voted !== side ? 'opacity-30 scale-95' : voted === side ? 'ring-4 ring-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'hover:ring-2 hover:ring-white/20'} 
        ${side === 'left' ? 'md:mr-3' : 'md:ml-3'}
        ${voted ? '' : 'hover:scale-[1.01]'}`}
      onClick={() => handleVote(w._id, side === 'left' ? wallpapers[1]._id : wallpapers[0]._id, side)}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
          style={{ backgroundImage: `url(${optimizeImage(w.url)})` }}
        ></div>
        <img 
          src={optimizeImage(w.url)} 
          alt="Wallpaper" 
          className="w-full h-full object-contain relative z-10"
        />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none"></div>

      <div className="absolute bottom-6 left-6 z-30">
        <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-black text-white/70 uppercase tracking-widest rounded-full mb-2 inline-block">
          ELO {w.eloScore}
        </span>
      </div>

      {!voted && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 bg-purple-500/10">
          <div className="bg-white/90 backdrop-blur-sm text-[#0d0914] px-6 py-2.5 rounded-full font-black text-sm tracking-widest uppercase shadow-2xl">
            VOTE
          </div>
        </div>
      )}

      {voted === side && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-purple-500/20 backdrop-blur-[1px]">
          <div className="bg-white text-purple-600 rounded-full p-4 shadow-[0_0_40px_rgba(168,85,247,0.5)] transform scale-125 animate-bounce">
            <Swords size={32} />
          </div>
        </div>
      )}
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
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-0 min-h-0 px-8 pb-8">
        {renderCard(wallpapers[0], 'left')}

        {/* VS Divider */}
        <div className="flex md:flex-col items-center justify-center z-10 px-2 md:px-0 md:py-4 gap-4 md:gap-0">
          <div className="hidden md:block h-full w-px bg-white/5"></div>
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#0d0914] border border-white/10 flex items-center justify-center shadow-2xl my-4">
            <span className="text-xs font-black text-gray-500 tracking-widest">VS</span>
          </div>
          <div className="hidden md:block h-full w-px bg-white/5"></div>
        </div>

        {renderCard(wallpapers[1], 'right')}
      </div>
    </div>
  );
}
