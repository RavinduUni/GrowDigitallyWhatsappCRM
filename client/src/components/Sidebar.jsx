import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard/inbox', icon: 'inbox', label: 'Inbox' },
  { to: '/dashboard/analytics', icon: 'insert_chart', label: 'Analytics' },
  { to: '/dashboard/settings', icon: 'settings', label: 'Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface-container-highest h-screen w-16 md:w-20 flex flex-col fixed left-0 top-0 z-50 items-center py-md space-y-lg border-r border-panel-border">
      {/* Logo */}
      <div className="mb-xl flex justify-center items-center h-12 w-12 rounded-full bg-primary-container text-on-primary-container">
        <span className="material-symbols-outlined fill text-2xl">forum</span>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col space-y-md w-full px-sm">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dashboard/inbox'}>
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center justify-center p-sm rounded-lg transition-all scale-95 active:scale-90 relative ${
                  isActive
                    ? 'text-secondary font-bold bg-surface-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full" />
                )}
                <span
                  className={`material-symbols-outlined text-[24px] mb-xs ${isActive ? 'fill' : ''}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span className="font-label-sm text-label-sm text-[10px] md:text-label-sm">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom area */}
      <div className="mt-auto pb-md flex flex-col items-center w-full space-y-md">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-sm rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors scale-95 active:scale-90 w-full cursor-pointer"
          id="sidebar-logout-btn"
        >
          <span className="material-symbols-outlined text-[24px]">logout</span>
          <span className="font-label-sm text-label-sm text-[10px] md:text-label-sm">Logout</span>
        </button>

        {/* User Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm font-bold uppercase cursor-default"
          title={user?.name || user?.email || 'Admin'}
        >
          {(user?.name || user?.email || 'A').charAt(0)}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
