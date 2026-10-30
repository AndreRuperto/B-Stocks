import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'B-Stocks | Terminal Quantitativo e Fundamentalista da B3',
  description:
    'Sistema determinístico de análise de ações brasileiras da B3 com métodos Décio Bazin, Benjamin Graham, Médias Móveis, IFR e Tese via IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-mist-950 text-stone-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
