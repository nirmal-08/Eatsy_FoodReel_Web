import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerRegister = () => {

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const businessName = form.businessName.value;
    const ownerName = form.ownerName.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const password = form.password.value;

    const response = await axios.post('https://eatsy-foodreel-web.onrender.com/api/auth/food-partner/register', {
      name: ownerName,
      contactName: businessName,
      email: email,
      phone: phone,
      address: address,
      password: password
    }, { withCredentials: true }
    )

    // console.log(response.data);
    navigate("/create-food");
  }






  return (
    <AuthLayout>
      <div className="auth-card" role="region" aria-labelledby="partner-register-heading">
        <header>
          <h1 id="partner-register-heading">Join as a Food Partner</h1>
          <p className="meta">Restaurant / Kitchen registration</p>
        </header>
        <form className="auth-form" onSubmit={(event) => handleSubmit(event)} noValidate autoComplete="off">
          <div className="field">
            <label htmlFor="businessName">Business name</label>
            <input id="businessName" name="businessName" type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="ownerName">Owner / contact</label>
            <input id="ownerName" name="ownerName" type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="email">Business email</label>
            <input id="email" name="email" type="email" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="email" data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="tel" data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" />
          </div>
          <div className="actions">
            <button type="submit" className="btn-primary">Create partner account</button>
            <div className="inline" style={{ justifyContent: 'center' }}>
              <a className="alt-link" href="/food-partner/login">Already registered? Sign in</a>
            </div>
          </div>
        </form>
        <footer className="small">We'll review details to maintain quality and safety.</footer>
      </div>
    </AuthLayout>
  );
};

export default PartnerRegister;
