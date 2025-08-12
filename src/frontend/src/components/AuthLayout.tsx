import * as React from 'react';
import RootLayout from '@/components/RootLayout';
import logo from '@/assets/icons/eduChain.svg';
import backgroundImage from '@/assets/image/background.webp';

export type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
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

          {/* Right Side - Form */}
          <div className="flex w-full flex-col items-center space-y-6 md:w-1/2 md:space-y-8">
            
            {/* Form Title */}
            <h1 className="text-3xl font-semibold text-white text-center md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-center text-base md:text-lg">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}