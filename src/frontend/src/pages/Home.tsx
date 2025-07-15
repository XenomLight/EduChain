import RootLayout from '@/components/RootLayout';
import logo from '@/assets/eduChain.svg';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <RootLayout className="relative flex-1">
      {/* image background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="image/background.webp"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* content */}
      <div className="flex min-h-screen w-full flex-col justify-center">
        <div className="flex w-full flex-col gap-16 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col md:w-1/2">
            <img src={logo} alt="EduChain Logo" className="w-112" />
            <div className="mt-2 ml-16">
              <h2 className="text-2xl font-semibold">Learn, Earn, On Chain</h2>
            </div>
          </div>
          <div className="hidden w-1/2 md:flex">
            <div className="flex w-full flex-col items-end gap-2 md:text-5xl lg:text-6xl xl:text-7xl">
              <div className="flex -translate-x-32 gap-8">
                <Link to="/auth/login">
                  <h1>Login</h1>
                </Link>
                <span>/</span>
              </div>
              <div>
                <Link to="/auth/register">
                  <h1>Register</h1>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
