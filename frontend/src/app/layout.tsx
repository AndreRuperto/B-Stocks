import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
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
      <body className={`${roboto.variable} font-sans min-h-screen bg-mist-950 text-stone-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
