import React from 'react';
import '../auth-shared.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      {children}
    </div>
  );
};

export default AuthLayout;
