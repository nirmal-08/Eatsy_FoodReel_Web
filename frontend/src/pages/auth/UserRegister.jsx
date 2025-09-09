import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value; 
    
    // console.log({ fullName, email, password }); 

    const response = await axios.post('http://localhost:8000/api/auth/user/register', {
      fullName: fullName,
      email: email,
      password: password
    },{ withCredentials: true }
  )

    // console.log(response.data);

    navigate("/");

  }

  return (
    <AuthLayout>
      <div className="auth-card" role="region" aria-labelledby="user-register-heading">
        <header>
          <h1 id="user-register-heading">Create your account</h1>
          <p className="meta">User registration</p>
        </header>
    <form className="auth-form" onSubmit={(event)=>handleSubmit(event)} noValidate autoComplete="off">
          <div className="field">
            <label htmlFor="fullName">Full name</label>
      <input id="fullName" name="fullName" type="text" placeholder="" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" placeholder="" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="email" data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" placeholder="" autoComplete="new-password" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>

          <div className="actions">
            <button type="submit" className="btn-primary"  >Sign up</button>

            <div className="inline" style={{ justifyContent: 'center' }}>
              <a className="alt-link" href="/user/login">Already have an account? Sign in</a>
            </div>

          </div>
        </form>
        {/* <footer className="small">By continuing, you agree to basic terms & privacy.</footer> */}
      </div>
    </AuthLayout>
  );
};

export default UserRegister;
