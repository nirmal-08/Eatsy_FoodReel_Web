import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    const response = await axios.post('http://localhost:8000/api/auth/user/login', {
      email,
      password
    }, {
      withCredentials: true
    })

    navigate("/");

  }

  return (
    <AuthLayout>
      <div className="auth-card" role="region" aria-labelledby="user-login-heading">
        <header>
          <h1 id="user-login-heading">Welcome back</h1>
          <p className="meta">User login</p>
        </header>
        <form className="auth-form" onSubmit={(event) => handleSubmit(event)} noValidate autoComplete="off">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="email" data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="inline">
            <div style={{ flex: 1 }} />
            <a className="alt-link" href="#">Forgot password?</a>
          </div>

          <div className="actions">

            <button type="submit" className="btn-primary">Sign in</button>

            <div className="inline" style={{ justifyContent: 'center', gap: '.75rem' }}>
              <a className="alt-link" href="/user/register">Register as normal user</a>


            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
