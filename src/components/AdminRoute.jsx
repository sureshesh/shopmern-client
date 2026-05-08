import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { user } = useApp();
  return user?.isAdmin ? children : <Navigate to="/" replace />;
}
