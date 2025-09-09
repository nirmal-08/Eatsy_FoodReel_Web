import React from 'react';
import { NavLink } from 'react-router-dom';
import './reels.css'; // reuse styles for nav to avoid new file

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink end to="/" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <span className="nav-icon" aria-hidden>🏠</span>
        <span className="nav-label">home</span>
      </NavLink>
      <NavLink to="/saved" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <span className="nav-icon" aria-hidden>🔖</span>
        <span className="nav-label">saved</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
