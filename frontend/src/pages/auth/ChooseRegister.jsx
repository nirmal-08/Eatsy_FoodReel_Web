import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import { Link } from 'react-router-dom';

// Modern chooser component with subtle glassy panels, motion and icons.
const ChooseRegister = () => {
  return (
    <AuthLayout>
      <div className="auth-card choose-card" role="region" aria-labelledby="choose-register-heading">
        <header>
          <h1 id="choose-register-heading">Create your account</h1>
          <p className="meta">Select the experience that fits you best</p>
        </header>

        <div className="choose-grid" aria-describedby="choose-help-text">
          <OptionPanel
            title="I'm a Customer"
            description="Browse restaurants, discover dishes & place quick orders."
            primaryTo="/user/register"
            primaryLabel="Register as User"
            secondaryTo="/user/login"
            secondaryLabel="Login"
            icon={(
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-3.5 3.8-6 7.5-6s6.7 2.5 7.5 6"/></svg>
            )}
            accent="user"
          />
          <OptionPanel
            title="I'm a Food Partner"
            description="List your menu, manage orders & grow your business."
            primaryTo="/food-partner/register"
            primaryLabel="Register as Partner"
            secondaryTo="/food-partner/login"
            secondaryLabel="Login"
            icon={(
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10h18"/><path d="M5 10V7a7 7 0 0 1 14 0v3"/><path d="M12 14v4"/><path d="M9 14h6"/><path d="M8 21h8"/></svg>
            )}
            accent="partner"
          />
        </div>

        <p id="choose-help-text" className="choose-help">You can always create another account type later.</p>
      </div>
    </AuthLayout>
  );
};

const OptionPanel = ({ title, description, primaryTo, primaryLabel, secondaryTo, secondaryLabel, icon, accent }) => {
  return (
    <section className={`option-panel accent-${accent}`}>
      <div className="panel-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p className="desc">{description}</p>
      <div className="panel-actions">
        <Link to={primaryTo} className="panel-btn primary">{primaryLabel}</Link>
        <Link to={secondaryTo} className="panel-btn subtle">{secondaryLabel}</Link>
      </div>
    </section>
  );
};

export default ChooseRegister;
