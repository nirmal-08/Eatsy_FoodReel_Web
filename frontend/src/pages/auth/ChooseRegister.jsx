import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { User, Utensils, ChevronRight, Sparkles } from 'lucide-react';

// Modern chooser component
const ChooseRegister = () => {
  const [hoveredPanel, setHoveredPanel] = useState(null);

  return (
    <AuthLayout>
      <div
        className="auth-card choose-card"
        role="region"
        aria-labelledby="choose-register-heading"
      >
        <header className="choose-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {/* <Sparkles size={20} color="var(--color-accent)" /> */}
            <h1 id="choose-register-heading">Create your account</h1>
            {/* <Sparkles size={20} color="var(--color-accent)" /> */}
          </div>
          <p className="meta">
            Select the experience that fits you best.
          </p>
        </header>

        <div
          className="choose-grid"
          aria-describedby="choose-help-text"
        >
          <OptionPanel
            title="I'm a Customer"
            description="Browse restaurants, discover dishes & place quick orders. Get food delivered to your doorstep with ease."
            primaryTo="/user/register"
            primaryLabel="Register as User"
            secondaryTo="/user/login"
            secondaryLabel="Login"
            icon={<User size={38} strokeWidth={1.5} />}
            accent="user"
            isHovered={hoveredPanel === 'user'}
            onHover={() => setHoveredPanel('user')}
            onLeave={() => setHoveredPanel(null)}
          />
          <OptionPanel
            title="I'm a Food Partner"
            description="List your menu, manage orders & grow your business. Reach thousands of hungry customers in your area."
            primaryTo="/food-partner/register"
            primaryLabel="Register as Partner"
            secondaryTo="/food-partner/login"
            secondaryLabel="Login"
            icon={<Utensils size={38} strokeWidth={1.5} />}
            accent="partner"
            isHovered={hoveredPanel === 'partner'}
            onHover={() => setHoveredPanel('partner')}
            onLeave={() => setHoveredPanel(null)}
          />
        </div>

        <p id="choose-help-text" className="choose-help">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={12} /> You can always create another account type later. <Sparkles size={12} />
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

// Option panel card
const OptionPanel = ({
  title,
  description,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
  icon,
  accent,
  isHovered,
  onHover,
  onLeave
}) => {
  return (
    <section 
      className={`option-panel accent-${accent}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      aria-label={title}
    >
      <div className="panel-icon" aria-hidden="true">
        {icon}
      </div>
      <h2>{title}</h2>
      <p className="desc">{description}</p>
      <div className="panel-actions">
        <Link to={primaryTo} className="panel-btn primary">
          {primaryLabel}
          <ChevronRight size={16} />
        </Link>
        <Link to={secondaryTo} className="panel-btn subtle">
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
};

export default ChooseRegister;