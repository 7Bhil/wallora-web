import { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Swords, LayoutGrid, Trophy, Palette, Sparkles, HelpCircle, LogOut, Menu, X, Smartphone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(!!window.deferredPWAInstallPrompt);

  useEffect(() => {
    const handleInstallable = () => setIsInstallable(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const handleInstallPWA = async () => {
    if (window.deferredPWAInstallPrompt) {
      window.deferredPWAInstallPrompt.prompt();
      const { outcome } = await window.deferredPWAInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        window.deferredPWAInstallPrompt = null;
      }
    }
  };

  // Sync user data on mount and close mobile menu on route change
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Arena', path: '/', icon: Swords },
    { name: 'Profile', path: '/profile', icon: LayoutGrid },
    { name: 'Ranking', path: '/leaderboard', icon: Trophy },
    { name: 'Download', path: '/download', icon: Palette },
  ];

  return (
    <div className="flex min-h-screen bg-[#0d0914] text-white font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-[#0a0710]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <Link to="/" className="flex items-baseline gap-1">
          <h1 className="text-xl font-bold text-white tracking-tight italic">Wallora</h1>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[280px] flex-shrink-0 border-r border-white/5 bg-[#0a0710] flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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
                 <span className="text-purple-300 font-bold uppercase">{(user.username || user.email || '?').charAt(0)}</span>
               </div>
               <div>
                  <p className="font-bold text-sm text-white">@{user.username || user.email}</p>
                  <p className="text-xs text-gray-500">Curator</p>
               </div>
             </div>
           )}

           <Link className="flex items-center gap-4 px-4 text-gray-500 hover:text-gray-300 transition">
             <HelpCircle size={20} />
             <span className="font-semibold text-sm">Support</span>
           </Link>

           {isInstallable && user && (
             <button onClick={handleInstallPWA} className="flex items-center gap-4 px-4 py-2 mt-4 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl transition w-full text-left">
               <Smartphone size={20} />
               <span className="font-semibold text-sm">Install Mobile App</span>
             </button>
           )}

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
      <main className="flex-1 overflow-y-auto relative h-screen pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
