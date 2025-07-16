import React from 'react';
import RootLayout from '@/components/RootLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import logo from '@/assets/icons/eduChain.svg';
import googleLogo from '@/assets/icons/google.svg';
import { Link } from 'react-router-dom';

export default function Home() {
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', data);
  };

  return (
    <RootLayout className="home-bg">
      <div className="home-overlay">
        <div className="home-left">
          <img src={logo} alt="EduChain Logo" className="home-logo" />
          <div className="home-subtext">Learn. Earn. On-chain.</div>
        </div>
        <div className="home-right">
          <form className="home-login-form" onSubmit={handleSubmit}>
            <h2 className="home-login-title">Login</h2>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              className="home-input"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              className="home-input"
            />
            <Button className="home-signin-btn short-btn">Sign In</Button>
            <button type="button" className="home-google-btn">
              <span className="google-icon-wrapper">
                <img src={googleLogo} alt="Google logo" className="google-logo" />
              </span>
              Sign in with Google
            </button>
            <div className="home-register-row">
              <span className="home-register-text">Don't have an account? </span>
              <Link to="/auth/register" className="home-register-link">Register here</Link>
            </div>
          </form>
        </div>
      </div>
    </RootLayout>
  );
}
