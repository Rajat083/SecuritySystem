import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '../ui';
import { useUIStore, useAuthStore } from '../../store';
import { ROUTES } from '../../constants';

export const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 sm:h-10 sm:w-10">
          {theme === 'light' ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* User info and actions */}
        <div className="flex items-center gap-1 sm:gap-2 border-l pl-1 sm:pl-2">
          <span className="text-xs sm:text-sm font-medium hidden sm:inline-block">{user?.username || 'User'}</span>
          
          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Logout */}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 sm:h-10 sm:w-10">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
