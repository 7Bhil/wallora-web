import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';
import Upload from './components/Upload';

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
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
