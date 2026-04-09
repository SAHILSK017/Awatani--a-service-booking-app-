import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Input = React.forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3 text-gray-400">
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
          Icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
