import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-zinc-700 bg-zinc-800 text-zinc-100',
        secondary: 'border-zinc-800 bg-zinc-900/90 text-zinc-300',
        outline: 'border-zinc-700 bg-zinc-950 text-zinc-300',
        positive: 'border-zinc-700 bg-zinc-800 text-zinc-100 font-semibold',
        negative: 'border-zinc-700 bg-zinc-800 text-zinc-100 font-semibold',
        warning: 'border-zinc-700 bg-zinc-800 text-zinc-100 font-semibold',
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
