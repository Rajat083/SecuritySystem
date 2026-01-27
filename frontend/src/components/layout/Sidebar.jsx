import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ClipboardList, 
  Shield, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUIStore, useAuthStore } from '../../store';
import { ROUTES } from '../../constants';

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { 
    name: 'Students', 
    icon: Users, 
    path: ROUTES.STUDENTS,
    submenu: [
      { name: 'Student Entry', icon: UserPlus, path: '/students/entry' },
      { name: 'Student Exit', icon: UserMinus, path: '/students/exit' },
    ]
  },
  { 
    name: 'Visitors', 
    icon: UserCheck, 
    path: ROUTES.VISITORS,
    submenu: [
      { name: 'Visitor Entry', icon: UserPlus, path: '/visitors/entry' },
      { name: 'Visitor Exit', icon: UserMinus, path: '/visitors/exit' },
    ]
  },
  { name: 'Access Logs', icon: ClipboardList, path: ROUTES.ACCESS_LOGS },
  { name: 'Campus State', icon: Shield, path: ROUTES.CAMPUS_STATE },
  { name: 'Analytics', icon: BarChart3, path: ROUTES.ANALYTICS },
  { name: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
];

export const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState({});

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        toggleSidebar();
      }
    };
    
    // Close sidebar on route change on mobile
    if (window.innerWidth < 1024 && sidebarOpen) {
      toggleSidebar();
    }
  }, [location.pathname]);

  const toggleSubmenu = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64',
          'lg:translate-x-0 lg:relative lg:z-auto',
          !sidebarOpen && 'lg:w-20'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className={cn(
                'font-semibold text-lg',
                !sidebarOpen && 'lg:hidden'
              )}>SecureGate</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="hidden lg:block rounded-lg p-2 hover:bg-accent"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems[item.name];
              const Icon = item.icon;

              return (
                <div key={item.path}>
                  {hasSubmenu && sidebarOpen ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subitem) => {
                            const SubIcon = subitem.icon;
                            const isSubActive = location.pathname === subitem.path;
                            return (
                              <Link
                                key={subitem.path}
                                to={subitem.path}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                  isSubActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                )}
                              >
                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                <span>{subitem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground',
                        !sidebarOpen && 'justify-center'
                      )}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t p-4">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {user?.role || 'guard'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
