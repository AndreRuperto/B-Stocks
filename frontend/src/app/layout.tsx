import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
