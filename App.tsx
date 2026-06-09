import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Keyboard, LayoutDashboard, History as HistoryIcon, Settings, User, Medal } from 'lucide-react';
import Arena from './pages/Arena';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/History';
import Profile from './pages/Profile';
import SettingsModal from './components/SettingsModal';

function Navbar() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { name: 'Arena', path: '/', icon: <Keyboard size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'History', path: '/history', icon: <HistoryIcon size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  return (
    <>
      <nav className="w-full border-b border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--accent-primary)] font-bold text-xl tracking-tight">
            <Keyboard size={24} />
            <span>TypeMaster</span>
          </div>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </nav>
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 w-full flex flex-col py-6">
          <Routes>
            <Route path="/" element={<Arena />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
