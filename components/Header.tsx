
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-black/10 backdrop-blur-sm" style={{height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)'}}>
      <div className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400" style={{fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', background: 'linear-gradient(45deg, #667eea, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'white'}}>
        DesignDrip
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
  );
};
