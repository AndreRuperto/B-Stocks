import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      data-testid="brand-logo"
      title="B-Stocks"
      className="inline-flex items-center"
    >
      <Image
        src="/logo.png"
        alt="B-Stocks"
        width={174}
        height={39}
        priority
        className={cn('h-9 w-auto select-none', className)}
      />
    </Link>
  );
}
