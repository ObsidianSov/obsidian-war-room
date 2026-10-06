import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  BarChart3,
  Target,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import Analytics from './pages/Analytics';
import Strategies from './pages/Strategies';
import Journal from './pages/Journal';
import SettingsPage from './pages/Settings';
import Tags from './pages/Tags';

const API_URL = 'http://localhost:3001/api';

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <svg className="sidebar-logo" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#00d4ff' }} />
              <stop offset="100%" style={{ stopColor: '#0088aa' }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="#0a0e17" stroke="url(#logoGrad)" strokeWidth="3"/>
          <polygon points="50,20 75,40 75,70 50,85 25,70 25,40" fill="none" stroke="#00d4ff" strokeWidth="2"/>
          <circle cx="50" cy="50" r="15" fill="#00d4ff" opacity="0.3"/>
          <circle cx="50" cy="50" r="8" fill="#00d4ff"/>
        </svg>
        <span className="sidebar-title">OBSIDIAN WAR-ROOM</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="nav-item-icon" size={20} />
          <span className="nav-item-text">Dashboard</span>
        </NavLink>
        <NavLink to="/trades" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <History className="nav-item-icon" size={20} />
          <span className="nav-item-text">Trades</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 className="nav-item-icon" size={20} />
          <span className="nav-item-text">Analytics</span>
        </NavLink>
        <NavLink to="/strategies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Target className="nav-item-icon" size={20} />
          <span className="nav-item-text">Strategies</span>
        </NavLink>
        <NavLink to="/tags" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Tag className="nav-item-icon" size={20} />
          <span className="nav-item-text">Tags</span>
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen className="nav-item-icon" size={20} />
          <span className="nav-item-text">Journal</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-item-icon" size={20} />
          <span className="nav-item-text">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={onToggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ title }) {
  const [summary, setSummary] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_URL}/analytics`)
      .then(res => res.json())
      .then(data => setSummary(data.summary))
      .catch(console.error);
  }, []);

  const formatCurrency = (val) => {
    if (val == null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-stats">
        {summary && (
          <>
            <div className="topbar-stat">
              <div className={`topbar-stat-value ${summary.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.total_pnl)}
              </div>
              <div className="topbar-stat-label">Total P&L</div>
            </div>
            <div className="topbar-stat">
              <div className="topbar-stat-value">{summary.win_rate?.toFixed(1)}%</div>
              <div className="topbar-stat-label">Win Rate</div>
            </div>
            <div className="topbar-stat">
              <div className="topbar-stat-value">{summary.total_trades}</div>
              <div className="topbar-stat-label">Total Trades</div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function getPageTitle(pathname) {
  const map = {
    '/': 'Dashboard',
    '/trades': 'Trade Log',
    '/analytics': 'Analytics',
    '/strategies': 'Strategies',
    '/tags': 'Tags',
    '/journal': 'Trading Journal',
    '/settings': 'Settings'
  };
  return map[pathname] || 'War Room';
}

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="app grid-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="main-content">
        <TopBar title={getPageTitle(location.pathname)} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}