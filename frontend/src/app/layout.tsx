import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B-Stocks | Análise Fundamentalista e Quantitativa da B3',
  description:
    'Sistema determinístico de análise de ações brasileiras da B3 com métodos Décio Bazin, Benjamin Graham, Médias Móveis, IFR e Tese via IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-100 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
