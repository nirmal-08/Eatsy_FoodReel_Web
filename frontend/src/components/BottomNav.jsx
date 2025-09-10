import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bookmark, Search, User, Plus } from 'lucide-react';
import './bottom-nav.css';

const BottomNav = () => {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav-glass" aria-label="Main navigation">
      <div className="nav-container">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Home className="nav-icon" size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
          <span className="nav-label">Home</span>
        </NavLink>
        
        <NavLink 
          to="/search" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Search className="nav-icon" size={22} strokeWidth={location.pathname === '/search' ? 2.5 : 2} />
          <span className="nav-label">Search</span>
        </NavLink>
        
        <div className="nav-center-item">
          <div className="nav-add-button">
            <Plus size={24} strokeWidth={2.5} />
          </div>
        </div>
        
        <NavLink 
          to="/saved" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Bookmark className="nav-icon" size={22} strokeWidth={location.pathname === '/saved' ? 2.5 : 2} />
          <span className="nav-label">Saved</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <User className="nav-icon" size={22} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
          <span className="nav-label">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;