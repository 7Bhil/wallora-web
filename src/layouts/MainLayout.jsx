import { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Swords, LayoutGrid, Trophy, Palette, Sparkles, HelpCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Arena', path: '/', icon: Swords },
    { name: 'Gallery', path: '/profile', icon: LayoutGrid },
    { name: 'Ranking', path: '/leaderboard', icon: Trophy },
    { name: 'Artists', path: '/artists', icon: Palette },
    { name: 'Vault', path: '/vault', icon: Sparkles },
  ];

  return (
    <div className="flex min-h-screen bg-[#0d0914] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-white/5 bg-[#0a0710] flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="block mb-12">
            <h1 className="text-2xl font-bold text-white tracking-tight italic">Wallora</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">The Digital Curator</p>
          </Link>

          <nav className="space-y-4">
            {navItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                  <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${isActive ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                    <item.icon size={20} className={isActive ? 'text-purple-400' : 'text-gray-500'} />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </Link>
               );
            })}
          </nav>
        </div>

        <div className="p-8 space-y-4">
           {user && (
             <div className="mb-6 p-4 rounded-2xl bg-white/5 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                 <span className="text-purple-300 font-bold uppercase">{user.username.charAt(0)}</span>
               </div>
               <div>
                  <p className="font-bold text-sm text-white">@{user.username}</p>
                  <p className="text-xs text-gray-500">Curator</p>
               </div>
             </div>
           )}

           <Link className="flex items-center gap-4 px-4 text-gray-500 hover:text-gray-300 transition">
             <HelpCircle size={20} />
             <span className="font-semibold text-sm">Support</span>
           </Link>
           {user ? (
             <button onClick={handleLogout} className="flex items-center gap-4 px-4 text-gray-500 hover:text-gray-300 transition w-full text-left">
               <LogOut size={20} />
               <span className="font-semibold text-sm">Sign Out</span>
             </button>
           ) : (
             <Link to="/login" className="flex items-center gap-4 px-4 text-purple-400 hover:text-purple-300 transition">
               <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
               <span className="font-semibold text-sm">Sign In</span>
             </Link>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        <Outlet />
      </main>
    </div>
  );
}
