import * as React from 'react';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';
import google from '@/assets/icons/google.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const { actor, login, principal } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = React.useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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

    // Validasi password
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Register biasa tanpa wallet - gunakan principal dummy atau email sebagai ID
      const dummyPrincipal = `email:${data.email}`;
      
      if (!actor) {
        setError('Backend connection failed. Please try again.');
        setIsLoading(false);
        return;
      }

      const result = await actor.Register(
        dummyPrincipal, // gunakan email sebagai identifier
        data.username,
        data.email,
        data.password,
        data.confirmPassword
      ) as string;

      if (result.includes('success')) {
        navigate('/');
      } else {
        setError(result);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletRegister = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await login(); // Connect wallet dulu
      
      // Setelah connect, register dengan principal asli
      if (principal && principal !== '2vxsx-fae') {
        const result = await actor?.Register(
          principal, // pakai principal dari wallet
          data.username,
          data.email,
          data.password,
          data.confirmPassword
        ) as string;

        if (result.includes('success')) {
          navigate('/');
        } else {
          setError(result);
        }
      }
    } catch (error) {
      console.error("Internet Identity connection failed:", error);
      setError('Internet Identity connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Register">
      {/* Error Message */}
      {error && (
        <div className="w-full max-w-sm md:max-w-lg bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 md:max-w-lg md:space-y-5">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={handleChange}
          className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
          required
        />
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Password Confirmation"
          value={data.confirmPassword}
          onChange={handleChange}
          className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-base py-3 px-4 md:text-lg md:py-4 md:px-6"
          required
        />
        
        {/* Sign Up Button */}
        <div className="flex justify-center pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-48 bg-[#2A8188] hover:bg-[#2A8188]/90 text-white text-base py-3 md:text-lg md:py-4 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
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
        {/* Google Button */}
        <button 
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white px-6 py-3 text-lg font-medium text-black transition-all hover:bg-gray-100 md:gap-4 md:px-8 md:py-4 md:text-xl"
        >
          <img src={google} alt="Google" className="h-5 w-5 md:h-6 md:w-6" />
          Sign In With Google
        </button>

        {/* Internet Identity Button */}
        <button
          onClick={handleWalletRegister}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-transparent px-6 py-3 text-lg font-medium text-white transition-all hover:bg-white/10 md:gap-4 md:px-8 md:py-4 md:text-xl"
        >
          <span className="text-xl md:text-2xl">🆔</span>
          Connect Internet Identity
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center text-white/80 space-y-2 text-base md:space-y-3 md:text-lg">
        <p>
          Already have an account?{' '}
          <Link to="/" className="text-blue-400 underline hover:text-blue-300">
            Click here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}











