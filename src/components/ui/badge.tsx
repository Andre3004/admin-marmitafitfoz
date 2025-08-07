import * as React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  variant: {
    default: 'bg-gray-900 hover:bg-gray-900/80 border-transparent text-gray-50',
    secondary:
      'bg-gray-100 hover:bg-gray-100/80 border-transparent text-gray-900',
    destructive:
      'bg-red-500 hover:bg-red-500/80 border-transparent text-gray-50',
    outline: 'text-gray-950 border-gray-200 bg-white hover:bg-gray-100',
  },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants.variant;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
        badgeVariants.variant[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
