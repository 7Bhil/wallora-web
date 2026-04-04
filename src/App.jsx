import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Download from './pages/Download';
import MainLayout from './layouts/MainLayout';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';
import Upload from './components/Upload';

const ComingSoon = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
    <div className="text-5xl">🚧</div>
    <h2 className="text-2xl font-black text-white">{name}</h2>
    <p className="text-gray-500 font-medium">Coming soon — stay tuned!</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Group */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Battle />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="profile" element={<Profile />} />
          {/* Placeholder pages for sidebar links */}
          <Route path="download" element={<Download />} />
          <Route path="vault" element={<ComingSoon name="Vault" />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
