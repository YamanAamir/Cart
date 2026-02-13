'use client';

import { cn } from '@/lib/utils';

export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent',
        sizeClasses[size]
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}