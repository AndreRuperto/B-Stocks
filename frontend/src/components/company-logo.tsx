'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  ticker: string;
  logoUrl?: string;
  companyName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TICKER_ICON_ALIAS: Record<string, string> = {
  NATU: 'NTCO3',
  AUAU: 'PETZ3',
  TOKY: 'MBLY3',
  FASA: 'FESA4',
  EQPA: 'EQPA3',
  CEED: 'EQTL3',
  CTKA: 'CTKA4',
  CEDO: 'CEDO4',
  AMBV: 'ABEV3',
  AXIA: 'ELET3',
  ELET: 'ELET3',
  TRPL: 'ISAE4',
  VIIA: 'BHIA3',
  VVAR: 'BHIA3',
  ALSO: 'ALOS3',
  GUAR: 'RIAA3',
  CESP: 'AURE3',
  BRDT: 'VBBR3',
  OMGE: 'SRNA3',
  RRRP: 'BRAV3',
  ENAT: 'BRAV3',
  LCAM: 'RENT3',
  SOMA: 'AZZA3',
  ARZZ: 'AZZA3',
  PRGA: 'BRFS3',
  WIZS: 'WIZC3',
  CARD: 'CSUD3',
  BTOW: 'AMER3',
  LAME: 'AMER3',
  GNDI: 'HAPV3',
  SULA: 'RDOR3',
  VIVT: 'VIVT3',
  VALE: 'VALE3',
  WEGE: 'WEGE3',
  KLBN: 'KLBN11',
  TAEE: 'TAEE11',
  SAPR: 'SAPR11',
  ALUP: 'ALUP11',
  GGBR: 'GGBR4',
  GOAU: 'GOAU4',
  USIM: 'USIM5',
  CMIG: 'CMIG4',
  CPLE: 'CPLE6',
};

function buildCandidateLogoUrls(ticker: string, providedUrl?: string): string[] {
  const clean = ticker.toUpperCase().trim();
  const root = clean.replace(/[0-9A-Z]*$/, (m) => (/^[0-9]/.test(m) ? '' : m)).slice(0, 4);
  const urls: string[] = [];

  if (providedUrl && providedUrl.trim().length > 5 && !providedUrl.includes('placeholder')) {
    urls.push(providedUrl.trim());
  }

  if (TICKER_ICON_ALIAS[root]) {
    urls.push(`https://icons.brapi.dev/icons/${TICKER_ICON_ALIAS[root]}.svg`);
  }

  urls.push(`https://icons.brapi.dev/icons/${clean}.svg`);
  urls.push(`https://raw.githubusercontent.com/thefintz/icones-b3/main/icones/${clean}.png`);

  if (root.length === 4) {
    urls.push(`https://icons.brapi.dev/icons/${root}3.svg`);
    urls.push(`https://icons.brapi.dev/icons/${root}4.svg`);
    urls.push(`https://icons.brapi.dev/icons/${root}11.svg`);
    urls.push(`https://icons.brapi.dev/icons/${root}6.svg`);
    urls.push(`https://raw.githubusercontent.com/thefintz/icones-b3/main/icones/${root}3.png`);
    urls.push(`https://raw.githubusercontent.com/thefintz/icones-b3/main/icones/${root}4.png`);
    urls.push(`https://raw.githubusercontent.com/thefintz/icones-b3/main/icones/${root}11.png`);
  }

  return Array.from(new Set(urls));
}

const BADGE_PALETTES = [
  { bg: '#064e3b', border: '#059669', text: '#a7f3d0' },
  { bg: '#1e3a8a', border: '#2563eb', text: '#bfdbfe' },
  { bg: '#3b0764', border: '#7c3aed', text: '#ddd6fe' },
  { bg: '#7c2d12', border: '#ea580c', text: '#fed7aa' },
  { bg: '#134e4a', border: '#0d9488', text: '#99f6e4' },
  { bg: '#312e81', border: '#4f46e5', text: '#c7d2fe' },
];

export function CompanyLogo({
  ticker,
  logoUrl,
  companyName,
  size = 'md',
  className,
}: CompanyLogoProps) {
  const candidates = useMemo(
    () => buildCandidateLogoUrls(ticker, logoUrl),
    [ticker, logoUrl],
  );
  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    setUrlIndex(0);
  }, [ticker, logoUrl]);

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

  const cleanTicker = ticker.toUpperCase().trim();
  const initials = cleanTicker.replace(/[0-9]+$/, '').slice(0, 3) || cleanTicker.slice(0, 2);
  const paletteIdx =
    (cleanTicker.charCodeAt(0) * 7 + cleanTicker.charCodeAt(cleanTicker.length - 1) * 13) %
    BADGE_PALETTES.length;
  const palette = BADGE_PALETTES[paletteIdx];

  const currentUrl = urlIndex < candidates.length ? candidates[urlIndex] : null;

  return (
    <div
      data-testid={`company-logo-${ticker}`}
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-lg border border-mist-700/80 bg-mist-800/90 overflow-hidden font-bold text-stone-200',
        sizeClasses[size],
        className,
      )}
      style={
        !currentUrl
          ? {
              backgroundColor: palette.bg,
              borderColor: palette.border,
              color: palette.text,
            }
          : undefined
      }
      title={companyName || ticker}
    >
      {currentUrl ? (
        <img
          src={currentUrl}
          alt={companyName || ticker}
          loading="lazy"
          className={cn('object-contain', imageSizes[size])}
          onError={() => setUrlIndex((prev) => prev + 1)}
        />
      ) : (
        <span className="tracking-tighter font-extrabold select-none">
          {initials}
        </span>
      )}
    </div>
  );
}
