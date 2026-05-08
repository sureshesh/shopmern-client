import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function PrivateRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}
