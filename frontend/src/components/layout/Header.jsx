import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-14 md:h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-4 md:px-6 z-10">
      <div className="flex items-center gap-3">
        <button className="md:hidden btn-secondary px-3 py-2" onClick={onToggleSidebar}>☰</button>
        <h2 className="text-base md:text-lg font-semibold">
          {user?.role === 'SUPER_ADMIN' && 'Super Admin Dashboard'}
          {user?.role === 'ADMIN' && 'Admin Dashboard'}
          {user?.role === 'CLIENT' && 'Client Dashboard'}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-dark-surface transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="hidden md:block font-medium">{user?.name}</span>
          <span className="text-dark-text-muted">▼</span>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-30">
              <div className="p-4 border-b border-dark-border">
                <div className="font-medium text-dark-text">{user?.name}</div>
                <div className="text-sm text-dark-text-muted">{user?.email}</div>
                <div className="text-xs text-dark-text-muted mt-1">
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-dark-surface text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

