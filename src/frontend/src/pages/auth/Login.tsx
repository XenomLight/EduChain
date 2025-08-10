import * as React from 'react';
import RootLayout from '@/components/RootLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import google from '@/assets/icons/google.svg';
import logo from '@/assets/icons/eduChain.svg';
import { Link } from 'react-router-dom';
import backgroundImage from '@/assets/image/background.webp';

export default function Login() {
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
    <RootLayout className="relative flex-1">
      {/* image background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={backgroundImage}
          alt="Background"
          className="h-full w-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* content */}
      <div className="flex min-h-screen w-full flex-col justify-center">
        <div className="flex w-full flex-col gap-16 md:flex-row md:items-center md:justify-between">
          <div className="hidden w-1/2 flex-col md:flex">
            <img src={logo} alt="EduChain Logo" className="w-112" />
            <div className="mt-2 ml-16">
              <h2 className="text-2xl font-semibold">Learn, Earn, On Chain</h2>
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <h1 className="text-5xl font-semibold">Login</h1>
            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
              />
              <Button className="w-full">Sign In</Button>
              <Button className="bg-foreground! hover:bg-foreground/90! text-background! flex w-full items-center justify-center gap-4">
                <span>
                  <img width={24} src={google} alt="Google logo" />
                </span>
                Sign In With Google
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p>
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-primary">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
