import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}