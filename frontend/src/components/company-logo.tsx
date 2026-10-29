'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  ticker: string;
  logoUrl?: string;
  companyName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompanyLogo({
  ticker,
  logoUrl,
  companyName,
  size = 'md',
  className,
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-11 w-11 text-sm',
  };

  const imageSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const initials = ticker.slice(0, 2).toUpperCase();

  const primaryUrl =
    logoUrl && logoUrl.trim().length > 5
      ? logoUrl
      : `https://icons.brapi.dev/icons/${ticker.toUpperCase()}.svg`;

  return (
    <div
      data-testid={`company-logo-${ticker}`}
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded border border-zinc-300 bg-zinc-100 overflow-hidden font-bold text-zinc-800',
        sizeClasses[size],
        className,
      )}
      title={companyName || ticker}
    >
      {!hasError ? (
        <img
          src={primaryUrl}
          alt={companyName || ticker}
          loading="lazy"
          className={cn('object-contain', imageSizes[size])}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="select-none tracking-tight">{initials}</span>
      )}
    </div>
  );
}
