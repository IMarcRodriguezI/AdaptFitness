import { Outlet } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}