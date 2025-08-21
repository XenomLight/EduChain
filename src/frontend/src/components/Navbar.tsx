import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from '../assets/icons/eduChain.svg';
import { useAuth } from '@/hooks/useAuth';
import Button from './ui/Button';
import React, { useState } from 'react';
import { authService } from '@/lib/auth';

const Navbar = () => {
  const {
    setIsAuthenticated,
    setPrincipal,
    setWalletType,
    isAuthenticated,
    principal,
    logout,
  } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showLogout, setShowLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // authService
    setIsLoading(true);
    try {
      const success = await authService.loginWithInternetIdentity();
      if (success) {
        setIsAuthenticated(authService.isAuthenticated);
        setPrincipal(authService.principal);
        setWalletType(authService.walletType);
        navigate('/dashboard');
      }
      return success;
    } catch (error) {
      console.error('Internet Identity login failed:', error);
      alert('Internet Identity login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { status, message } = await logout();
      if (status !== 'success') {
        alert(message);
        return;
      }
      navigate('/');
    } catch (error) {
      console.error('Internet Identity logout failed:', error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 z-50 flex w-[95%] -translate-x-1/2 items-center justify-between rounded-2xl bg-black/60 px-6 py-3 backdrop-blur-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
      </div>

      <div className="flex items-center gap-6 text-[#EEEEEE]">
        {[
          {
            name: isAuthenticated ? 'Dashboard' : 'Home',
            to: isAuthenticated ? '/dashboard' : '/',
          },
          { name: 'Courses', to: '/courses' },
          { name: 'Partners', to: '/partners' },
          { name: 'Settings', to: '/settings/profile' },
        ].map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `group relative transition ${isActive ? 'text-white' : 'text-[#EEEEEE]'}`
            }
            end={link.to === '/'} // penting! biar "/" gak aktif di semua route
          >
            {({ isActive }) => (
              <>
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#2A8188] ${
                    isActive
                      ? 'w-full transition-none'
                      : 'w-0 transition-all duration-300 group-hover:w-full'
                  }`}
                ></span>
              </>
            )}
          </NavLink>
        ))}

        {/* Search */}
        <div className="flex items-center rounded-lg bg-[#222222] px-3 py-1">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-28 bg-transparent px-2 text-gray-200 placeholder-gray-500 outline-none sm:w-40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            type="button"
            className="rounded-md bg-[#2A8188] px-3 py-1 transition hover:bg-[#246d73]"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="relative">
            <Button
              className="cursor-pointer rounded-lg bg-white! px-4 py-2 font-medium text-black! transition hover:bg-gray-200!"
              onClick={() => setShowLogout(!showLogout)}
            >
              {`${principal?.slice(0, 12)}...${principal?.slice(-8)}`}
            </Button>
            {showLogout && (
              <Button
                className="absolute right-0 -bottom-12 cursor-pointer rounded-lg bg-red-500 transition hover:bg-red-700!"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleLogin}
            className="cursor-pointer rounded-lg bg-[#2A8188] px-4 py-2 font-medium text-white transition hover:bg-[#246d73]"
            disabled={isLoading}
          >
            {isLoading ? 'Trying to login...' : 'Login'}
          </Button>
          // <>
          //   <Link to="/auth/login" className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-200">
          //     Login
          //   </Link>
          //   <Link to="/auth/register" className="rounded-lg bg-[#2A8188] px-4 py-2 font-medium text-white transition hover:bg-[#246d73]">
          //     Register
          //   </Link>
          // </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
