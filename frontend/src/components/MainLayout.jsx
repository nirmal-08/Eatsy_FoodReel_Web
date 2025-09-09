import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

// Simple shell so bottom navigation persists on main browsing pages
const MainLayout = () => {
  return (
    <div className="app-main-layout">
      <div className="app-content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
