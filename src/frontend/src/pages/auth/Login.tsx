import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
// import google from '@/assets/icons/google.svg';
// import { Principal } from '@dfinity/principal';

export default function Login() {
  const navigate = useNavigate();
  const {
    actor,
    loginWithEmail,
    setIsAuthenticated,
    setPrincipal,
    setWalletType,
  } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // input validation
    if (!data.email) {
      setError('Please enter your email!');
      setIsLoading(false);
      return;
    }
    if (!data.password) {
      setError('Please enter your password!');
      setIsLoading(false);
      return;
    }

    // process data
    try {
      if (!actor) {
        setError('Backend connection failed. Please try again.');
        setIsLoading(false);
        return;
      }

      const { status, message } = await loginWithEmail(data);
      if (status !== 'success') {
        setError(message);
        setIsLoading(false);
        return;
      }
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      const success = await authService.loginWithInternetIdentity();
      if (success) {
        setIsAuthenticated(authService.isAuthenticated);
        setPrincipal(authService.principal);
        setWalletType(authService.walletType);
        navigate('/');
      }
      return success;
    } catch (error) {
      console.error('Internet Identity login failed:', error);
      setError('Internet Identity login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      {error && (
        <div className="w-full max-w-sm rounded-lg border border-red-500 bg-red-500/20 px-4 py-2 text-center text-red-200 md:max-w-lg">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 md:max-w-lg md:space-y-5"
      >
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={handleChange}
          className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 md:px-6 md:py-4 md:text-lg"
          required
        />
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-[#2A8188] py-3 text-base font-medium text-white transition-colors hover:bg-[#2A8188]/90 disabled:opacity-50 md:py-4 md:text-lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>
      <div className="flex w-full max-w-sm items-center md:max-w-lg">
        <div className="flex-1 border-t border-white/30"></div>
        <span className="px-4 text-base text-white/70 md:px-6 md:text-lg">
          or
        </span>
        <div className="flex-1 border-t border-white/30"></div>
      </div>
      <div className="flex w-full max-w-sm flex-col space-y-3 md:max-w-lg md:space-y-4">
        {/* <Button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white px-6 py-3 text-lg font-medium text-black! transition-all hover:bg-gray-300! md:gap-4 md:px-8 md:py-4 md:text-xl"
        >
          <img src={google} alt="Google" className="h-5 w-5 md:h-6 md:w-6" />
          Continue with Google
        </Button> */}
        <Button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-transparent px-6 py-3 text-lg font-medium text-white transition-all hover:bg-white/10 md:gap-4 md:px-8 md:py-4 md:text-xl"
          onClick={handleWalletLogin}
        >
          <span className="text-xl md:text-2xl">🆔</span>
          Connect Internet Identity
        </Button>
      </div>
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
