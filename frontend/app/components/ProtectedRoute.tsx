import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
  }
  
  export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, loading, navigate]);
  
    // Loading animation to check authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }
  
    // Don't render if not authenticated
    if (!isAuthenticated) {
      return null;
    }
  
    return <>{children}</>;
  }
  