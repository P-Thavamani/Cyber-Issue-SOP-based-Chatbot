
import React, { useState, useEffect } from 'react';
import { UserRole, Page } from './types';
import Header from './components/Header';
import AIAssistantPage from './pages/AIAssistantPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.User);
  const [currentPage, setCurrentPage] = useState<Page>('assistant');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      <Header
        userRole={userRole}
        onSetUserRole={setUserRole}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentPage === 'assistant' && <AIAssistantPage />}
        {currentPage === 'dashboard' && <DashboardPage userRole={userRole} />}
      </main>
    </div>
  );
};

export default App;
