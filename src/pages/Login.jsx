import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const API_URL = import.meta.env.VITE_API_URL || 'https://wallora-server.onrender.com';
      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.access_token }) // Note: for @react-oauth/google, use access_token or fetch id_token
        });
        const data = await res.json();
        if (res.ok) {
          login(data.token, data.user);
          navigate('/');
        } else {
          setError(data.error);
        }
      } catch (e) {
        setError('Google Login failed.');
      }
    },
    onError: () => setError('Google Login error.'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://wallora-server.onrender.com';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Erreur réseau. Le serveur API est-il lancé ?');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0914] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-purple-950/20 to-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Wallora</h1>
        <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium tracking-wider transition">
          BACK TO GALLERY <ArrowRight size={16} />
        </Link>
      </div>

      {/* Background Decor */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[200px] font-black text-white mix-blend-overlay rotate-90 leading-none tracking-tighter">LOGIN</h2>
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-[420px] bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-sm font-medium">Continue your curation journey.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-4 pr-10 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition shadow-inner"
                placeholder="hello@wallora.art"
              />
              <Mail className="absolute right-4 top-3.5 text-gray-600" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1 mb-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <a href="#" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition">Forgot Password?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-4 pr-10 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition shadow-inner"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-400 transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#9f7aea] hover:bg-[#b073ff] text-white font-bold py-3.5 rounded-xl mt-4 transition shadow-[0_4px_14px_0_rgba(168,85,247,0.3)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.5)]"
          >
            Login
          </button>
        </form>

        <div className="relative flex items-center justify-center mt-8 mb-6">
          <div className="absolute border-t border-white/5 w-full"></div>
          <span className="bg-[#0d0914] px-3 text-[11px] font-bold tracking-widest text-gray-600 uppercase z-10">Or login with</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
           <button 
             type="button"
             onClick={() => googleLogin()}
             className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-3.5 rounded-xl transition text-sm font-bold text-white shadow-lg"
           >
              <svg width="20" height="20" viewBox="0 0 48 48" className="mr-1">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Google
           </button>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-400">
          New here? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold ml-1">Create an account</Link>
        </div>
      </div>

      <div className="absolute bottom-6 w-full px-8 flex justify-between items-center text-[10px] text-gray-600 uppercase font-bold tracking-widest hidden md:flex">
         <span>© 2024 Wallora. The Digital Curator.</span>
         <div className="space-x-4">
           <span className="hover:text-gray-400 cursor-pointer transition">Privacy Policy</span>
           <span className="hover:text-gray-400 cursor-pointer transition">Terms of Art</span>
         </div>
      </div>
    </div>
  );
}
