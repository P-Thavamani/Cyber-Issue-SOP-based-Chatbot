
import React from 'react';
import { UserRole, Page } from '../types';

interface HeaderProps {
  userRole: UserRole;
  onSetUserRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onSetUserRole, theme, onToggleTheme, currentPage, onNavigate }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">CyberFlow</h1>
            <nav className="hidden md:flex space-x-4">
                <button 
                    onClick={() => onNavigate('assistant')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'assistant' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                    AI Assistant
                </button>
                <button 
                    onClick={() => onNavigate('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'dashboard' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                    Dashboard
                </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                value={userRole}
                onChange={(e) => onSetUserRole(e.target.value as UserRole)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md py-1.5 px-3 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              >
                <option value={UserRole.User}>User</option>
                <option value={UserRole.Admin}>Admin</option>
              </select>
            </div>
            <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
