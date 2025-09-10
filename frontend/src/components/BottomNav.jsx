import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bookmark } from 'lucide-react'; // modern icons
import './reels.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink end to="/" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <Home className="nav-icon" aria-hidden="true" strokeWidth={2} />
        <span className="nav-label">home</span>
      </NavLink>
      <NavLink to="/saved" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <Bookmark className="nav-icon" aria-hidden="true" strokeWidth={2} />
        <span className="nav-label">saved</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
