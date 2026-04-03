import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Verified, Play, Plus } from 'lucide-react';

export default function Profile() {
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
       setProfile(data);
       setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="p-10 text-gray-400">Loading Profile...</div>;
  if (!profile || !profile.user) return <div className="p-10 text-red-400">Failed to load profile. Ensure the backend server is running.</div>;

  const { stats, wallpapers } = profile;

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
       
       {/* Header Profile Section */}
       <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* Avatar */}
          <div className="relative">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-teal-500 flex items-end justify-center overflow-hidden border-4 border-[#0d0914] shadow-[0_0_40px_rgba(20,184,166,0.3)]">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}&backgroundColor=transparent`} alt="avatar" className="w-[85%] h-[85%] object-cover object-bottom" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-xl p-2 border-4 border-[#0d0914] shadow-lg">
                <Verified size={20} className="text-white" fill="currentColor" />
             </div>
          </div>

          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                <h1 className="text-4xl font-black text-white tracking-tight">@{user.username}</h1>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap w-max mx-auto md:mx-0">Level 15 Curator</span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
                Digital art connoisseur and master of the Neon Gallery. Defining the future of desktop aesthetics one battle at a time.
             </p>

             <div className="flex items-center justify-center md:justify-start gap-4">
                <button className="bg-[#a855f7] hover:bg-[#c084fc] text-white font-bold py-2.5 px-6 rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]">Edit Profile</button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-6 rounded-xl transition">Share Profile</button>
             </div>
          </div>
       </div>

       {/* Stats Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Activity</span>
             <h3 className="text-3xl font-black text-white">{stats.votesCast.toLocaleString()}</h3>
             <span className="text-gray-500 text-sm mt-1">Votes Cast</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Portfolio</span>
             <h3 className="text-3xl font-black text-pink-400">{stats.totalUploads}</h3>
             <span className="text-gray-500 text-sm mt-1">Wallpapers Uploaded</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Prestige</span>
             <h3 className="text-3xl font-black text-[#d4b0ff]">{stats.totalPrestige.toLocaleString()}</h3>
             <span className="text-gray-500 text-sm mt-1">ELO Score</span>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex gap-8 border-b border-white/5 mb-8">
          <div className="pb-4 border-b-2 border-purple-400">
             <span className="text-sm font-bold text-white tracking-widest">My Wallpapers</span>
          </div>
          <div className="pb-4 hover:border-b-2 hover:border-white/20 transition cursor-pointer">
             <span className="text-sm font-bold text-gray-600 tracking-widest hover:text-gray-400 transition">History</span>
          </div>
          <div className="pb-4 hover:border-b-2 hover:border-white/20 transition cursor-pointer">
             <span className="text-sm font-bold text-gray-600 tracking-widest hover:text-gray-400 transition">Saved</span>
          </div>
       </div>

       {/* Wallpapers Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallpapers.map((wp, index) => (
             <div key={wp._id} className="group relative rounded-3xl overflow-hidden bg-black/40 aspect-video shadow-xl cursor-pointer border border-white/5 hover:border-purple-500/50 transition">
                <img src={wp.url} alt="wallpaper" className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                   <span className="bg-black/50 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white px-3 py-1.5 rounded-full">
                      RANK #{index + 1}
                   </span>
                </div>
                
                <div className="absolute bottom-4 w-full px-4 flex justify-between items-end">
                   <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2 truncate pr-2">Image #{index + 1}</h4>
                      <div className="flex items-center gap-2">
                         <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden max-w-[100px]">
                            <div className="h-full bg-emerald-400" style={{ width: '78%' }}></div>
                         </div>
                         <span className="text-[10px] font-bold text-gray-400">78% WR</span>
                      </div>
                   </div>
                   <button className="w-10 h-10 flex-shrink-0 cursor-pointer rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-purple-500/80 hover:border-purple-400 transition transform hover:scale-110">
                      <Play size={16} fill="white" className="text-white ml-1" />
                   </button>
                </div>
             </div>
          ))}

          {/* Upload New Entry Box */}
          <Link to="/upload" className="rounded-3xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-900/10 transition bg-white/[0.02] aspect-video flex flex-col items-center justify-center group cursor-pointer">
             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 group-hover:border-purple-400 transition">
                <Plus size={20} className="text-gray-400 group-hover:text-purple-300 transition" />
             </div>
             <span className="text-sm font-bold text-gray-500 group-hover:text-purple-300 transition">Upload New Entry</span>
          </Link>
       </div>

    </div>
  );
}
