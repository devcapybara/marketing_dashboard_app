import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menu items berdasarkan role
  const getMenuItems = () => {
    const baseMenu = [
      {
        name: 'Dashboard',
        path: user?.role === 'SUPER_ADMIN' 
          ? '/dashboard/super-admin'
          : user?.role === 'ADMIN'
          ? '/dashboard/admin'
          : '/dashboard/client',
        icon: '📊',
      },
    ];

    // Tambah menu Admins khusus SUPER_ADMIN
    if (user?.role === 'SUPER_ADMIN') {
      baseMenu.push({
        name: 'Admins',
        path: '/admins',
        icon: '🛠️',
      });
      baseMenu.push({
        name: 'Audit Log',
        path: '/audit-logs',
        icon: '🧾',
      });
      baseMenu.push(
        { name: 'Overview Sistem', path: '/system/overview', icon: '🧠' },
        { name: 'Aktivitas Pengguna', path: '/system/user-activity', icon: '👣' },
        { name: 'Kinerja API', path: '/system/api-performance', icon: '⚡' },
        { name: 'Jobs & Queue', path: '/system/jobs', icon: '📦' },
        { name: 'Storage & Integrasi', path: '/system/storage', icon: '🗄️' },
        { name: 'Konfigurasi Global', path: '/system/config', icon: '⚙️' },
        { name: 'Webhooks', path: '/system/webhooks', icon: '🔔' },
      );
    }

    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      baseMenu.push(
        {
          name: 'Clients',
          path: '/clients',
          icon: '👥',
        },
        {
          name: 'Ad Accounts',
          path: '/ad-accounts',
          icon: '📱',
        },
        {
          name: 'Pages',
          path: '/site/builder',
          icon: '🧩',
        }
      );
    }

    if (user?.role !== 'SUPER_ADMIN') {
      baseMenu.push(
        { name: 'Metrics', path: '/metrics', icon: '📈' },
        { name: 'Leads', path: '/leads', icon: '📇' },
        { name: 'Topups', path: '/topups', icon: '💰' },
        { name: 'Calculator', path: '/calculator', icon: '🧮' },
      );
    }

    return baseMenu;
  };

  const menuItems = getMenuItems();

  return (
    <>
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex-col z-40">
      <div className="p-6 border-b border-dark-border">
        <h1 className="text-xl font-bold">Marketing Dashboard</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-dark-text-muted hover:bg-dark-surface hover:text-dark-text'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="text-sm text-dark-text-muted">
          <div className="font-medium text-dark-text">{user?.name}</div>
          <div className="text-xs mt-1">{user?.role?.replace('_', ' ')}</div>
        </div>
      </div>
    </aside>
    {mobileOpen && (
      <>
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        <aside className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex flex-col z-50">
          <div className="p-6 border-b border-dark-border flex items-center justify-between">
            <h1 className="text-xl font-bold">Marketing Dashboard</h1>
            <button className="btn-secondary" onClick={onClose}>✕</button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-dark-text-muted hover:bg-dark-surface hover:text-dark-text'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-dark-border">
            <div className="text-sm text-dark-text-muted">
              <div className="font-medium text-dark-text">{user?.name}</div>
              <div className="text-xs mt-1">{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
        </aside>
      </>
    )}
    </>
  );
};

export default Sidebar;

