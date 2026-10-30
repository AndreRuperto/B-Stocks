import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-mist-700 bg-mist-800 text-stone-100',
        secondary: 'border-mist-800 bg-mist-900/90 text-stone-300',
        outline: 'border-mist-700 bg-mist-950 text-stone-300',
        positive: 'border-emerald-800 bg-emerald-950/70 text-emerald-300 font-semibold',
        negative: 'border-red-800 bg-red-950/70 text-red-300 font-semibold',
        warning: 'border-amber-800 bg-amber-950/70 text-amber-300 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
