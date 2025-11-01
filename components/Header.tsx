import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  view: 'dashboard' | 'schedule';
  setView: (view: 'dashboard' | 'schedule') => void;
}

const NavButton: React.FC<{ text: string; isActive: boolean; onClick: () => void; }> = ({ text, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary/10 text-primary dark:bg-sky-400/20 dark:text-sky-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
    >
        {text}
    </button>
);


const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, view, setView }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary dark:text-sky-400">
            Ponto Certo
            </h1>
            <nav className="hidden md:flex items-center space-x-2">
                <NavButton text="Dashboard" isActive={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavButton text="Cronograma" isActive={view === 'schedule'} onClick={() => setView('schedule')} />
            </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-300 hidden sm:block">Olá, Ana Silva</span>
          <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold">
            AS
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden px-4 pb-3 flex items-center space-x-2 border-t border-slate-200 dark:border-slate-700">
        <NavButton text="Dashboard" isActive={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavButton text="Cronograma" isActive={view === 'schedule'} onClick={() => setView('schedule')} />
      </nav>
    </header>
  );
};

export default Header;
