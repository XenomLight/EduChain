import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-foreground p-4',
        className
      )}
      {...props}
    />
  );
};

export default Input;
