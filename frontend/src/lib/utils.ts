import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatCompactCurrency(value: number): string {
  if (!value || value <= 0) return 'R$ 0';
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

export function formatPercent(value: number, showSign = false): string {
  const num = Number.isFinite(value) ? value : 0;
  const prefix = showSign && num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(2)}%`;
}

