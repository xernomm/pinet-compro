import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/company', label: 'Company Info', icon: '🏢' },
    { path: '/dashboard/heroes', label: 'Hero Slider', icon: '🎬' },
    { path: '/dashboard/services', label: 'Services', icon: '⚙️' },
    { path: '/dashboard/values', label: 'Company Values', icon: '💎' },
    { path: '/dashboard/products', label: 'Products', icon: '📦' },
    { path: '/dashboard/partners', label: 'Partners', icon: '🤝' },
    { path: '/dashboard/clients', label: 'Clients', icon: '👥' },
    { path: '/dashboard/news', label: 'News', icon: '📰' },
    { path: '/dashboard/events', label: 'Events', icon: '📅' },
    { path: '/dashboard/careers', label: 'Careers', icon: '💼' },
    { path: '/dashboard/contacts', label: 'Contacts', icon: '📧' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{sidebarOpen ? 'Admin Panel' : 'AP'}</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {sidebarOpen && <span className="label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button 
          className="toggle-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1>Company Profile Admin</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.full_name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;