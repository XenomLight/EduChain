import { cn } from '@/lib/utils';
import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variants?: 'primary';
}

export default function Button({
  className,
  variants = 'primary',
  children,
  ...props
}: ButtonProps) {
  switch (variants) {
    case 'primary':
      return (
        <button
          className={cn(
            'text-foreground bg-primary hover:bg-primary/80 shadow-foreground/50 rounded-lg px-4 py-2 shadow-md transition-colors focus:outline-none',
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
  }
}
