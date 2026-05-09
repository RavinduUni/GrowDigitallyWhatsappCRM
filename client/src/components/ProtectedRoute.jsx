import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-sm">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined fill text-on-primary-container text-2xl">forum</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
