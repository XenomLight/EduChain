import RootLayout from '@/components/RootLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import logo from '@/assets/icons/eduChain.svg';
import google from '@/assets/icons/google.svg';
import { Link } from 'react-router-dom';
import backgroundImage from '@/assets/image/background.webp';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, login, logout, principal, actor } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <RootLayout className="relative flex-1">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to EduChain!</h1>
            <p className="mb-4">Principal: {principal}</p>
            <button 
              onClick={logout}
              className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </RootLayout>
    );
  }

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      await login();
    } catch (error) {
      console.error("Internet Identity login failed:", error);
      setError('Internet Identity login failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      if (!actor) {
        setError('Please connect with Internet Identity first');
        setIsLoggingIn(false);
        return;
      }

      // Panggil Login function dari backend
      const result = await actor.Login(
        principal, // kirim principal dari useAuth
        loginData.email,
        loginData.password
      ) as string;

      if (result.includes('success')) {
        // Login berhasil, state akan update otomatis via useAuth
        console.log('Login successful');
      } else {
        setError(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    
    try {
      // TODO: Implement test login
      console.log('Test login not implemented yet');
      setError('Test login not implemented yet');
    } catch (error) {
      console.error('Test login error:', error);
      setError('Test login failed. Make sure backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fillTestCredentials = () => {
    setLoginData({
      email: 'test@email.com',
      password: 'testpass'
    });
  };

  return (
    <RootLayout className="relative flex-1">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={backgroundImage}
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="flex min-h-screen w-full items-center justify-center px-4 md:px-8">
        <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-12 md:flex-row md:items-center md:justify-between">
          
          {/* Left Side - Logo and Tagline */}
          <div className="flex w-full flex-col items-center md:w-1/2 md:items-start">
            <img src={logo} alt="EduChain Logo" className="w-64 md:w-96" />
            <div className="mt-4 text-center md:ml-16 md:text-left">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                Learn, Earn, On Chain
              </h2>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex w-full flex-col items-center space-y-6 md:w-1/2 md:space-y-8">
            
            {/* Login Form Title */}
            <h1 className="text-3xl font-semibold text-white text-center md:text-5xl">
              Continue to EduChain
            </h1>
            <p className="text-white/80 text-center text-base md:text-lg">
              with email, Google, or Web3 login
            </p>

            {/* Error Message */}
            {error && (
              <div className="w-full max-w-sm md:max-w-lg bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="w-full max-w-sm space-y-4 md:max-w-lg md:space-y-5">
              <Input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={loginData.email}
                onChange={handleInputChange}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
              />
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
              />
              
              {/* Continue Button - lebih kecil, di tengah */}
              <div className="flex justify-center pt-2">
                <Button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-48 bg-primary hover:bg-primary/90 text-base py-3 md:text-lg md:py-4 disabled:opacity-50"
                >
                  {isLoggingIn ? 'Logging in...' : 'Continue'}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex w-full max-w-sm items-center md:max-w-lg">
              <div className="flex-1 border-t border-white/30"></div>
              <span className="px-4 text-white/70 text-base md:px-6 md:text-lg">or</span>
              <div className="flex-1 border-t border-white/30"></div>
            </div>

            {/* Social Login Options */}
            <div className="flex w-full max-w-sm flex-col space-y-3 md:max-w-lg md:space-y-4">
              {/* Google Login - full width */}
              <button className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white px-6 py-3 text-lg font-medium text-black transition-all hover:bg-gray-100 md:gap-4 md:px-8 md:py-4 md:text-xl">
                <img src={google} alt="Google" className="h-5 w-5 md:h-6 md:w-6" />
                Continue with Google
              </button>

              {/* Wallet Login - full width */}
              <button
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-transparent px-6 py-3 text-lg font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50 md:gap-4 md:px-8 md:py-4 md:text-xl"
              >
                {isConnecting ? (
                  "Connecting to Internet Identity..."
                ) : (
                  <>
                    <span className="text-xl md:text-2xl">🆔</span>
                    Continue with Internet Identity
                  </>
                )}
              </button>
            </div>

            {/* Test Buttons for Development */}
            <div className="flex w-full max-w-sm flex-col space-y-2 md:max-w-lg">
              <button 
                onClick={fillTestCredentials}
                className="text-sm text-yellow-400 underline hover:text-yellow-300"
              >
                Fill Test Credentials
              </button>
              <button 
                onClick={handleTestLogin}
                disabled={isLoggingIn}
                className="text-sm text-green-400 underline hover:text-green-300 disabled:opacity-50"
              >
                {isLoggingIn ? 'Testing...' : 'Quick Test Login'}
              </button>
            </div>

            {/* Help Links */}
            <div className="text-center text-white/80 space-y-2 text-base md:space-y-3 md:text-lg">
              <p>
                Don't have a wallet?{' '}
                <a 
                  href="https://nfid.one/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Learn how
                </a>
              </p>
              <p>
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-blue-400 underline hover:text-blue-300">
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
