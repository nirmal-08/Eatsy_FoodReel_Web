import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from '../pages/auth/UserLogin';
import PartnerRegister from '../pages/auth/PartnerRegister';
import PartnerLogin from '../pages/auth/PartnerLogin';
import ChooseRegister from '../pages/auth/ChooseRegister';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import MainLayout from '../components/MainLayout';
import CreateFood from '../pages/food-partner/CreateFood';
import PartnerStore from '../pages/food-partner/PartnerStore';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth & partner specific (no bottom nav) */}
        <Route path="/register" element={<ChooseRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:partnerId" element={<PartnerStore />} />

        {/* Main browsing layout with bottom nav */}
        <Route element={<MainLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
