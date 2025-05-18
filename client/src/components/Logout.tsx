import { Button } from './ui/button';
import { logoutService } from '@/services/auth.service';
import { useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutService()
      .then(() => {
        console.log('Logout successful');
        logout();
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <Button
      variant="destructive"
      className="flex items-center gap-2 px-3 py-1 text-white bg-red-500 hover:bg-red-600 transition"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
};

export default Logout;
