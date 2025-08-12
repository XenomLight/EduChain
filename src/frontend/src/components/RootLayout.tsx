import { cn } from '@/lib/utils';
import * as React from 'react';

export type RootLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <main
      className={cn('px-8 md:px-16 lg:px-32 xl:px-48', className)}
    >
      {children}
    </main>
  );
}
