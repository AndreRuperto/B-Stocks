'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { fetchMarketNews } from '@/lib/api';
import { MarketNewsArticle } from '@/lib/schemas';
import { Calendar, ExternalLink, Newspaper } from 'lucide-react';

export function MarketNewsSection() {
  const [articles, setArticles] = useState<MarketNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchMarketNews()
      .then((res) => {
        if (!active) return;
        setArticles(res.items.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="noticias"
      data-testid="market-news-section"
      className="scroll-mt-24 space-y-6"
      aria-label="Notícias da Bolsa de Valores B3 e Ibovespa"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold tracking-wider"
            >
              <Newspaper className="mr-1.5 h-3 w-3 text-emerald-400" />
              Feed em Tempo Real • Exclusivo Bolsa &amp; B3
            </Badge>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
            Últimas Notícias da Bolsa Brasileira
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Cobertura filtrada sobre o Ibovespa, balanços corporativos,
            dividendos e movimentações das ações listadas na B3.
          </p>
        </div>
      </div>

      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex h-80 flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 animate-pulse"
            >
              <div className="h-40 w-full rounded-xl bg-zinc-800/80" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-zinc-800" />
                <div className="h-3 w-full rounded bg-zinc-800/70" />
                <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-10 text-center text-xs text-zinc-400">
          Nenhuma notícia da bolsa disponível no momento (-).
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const formattedDate = (() => {
              const dt = new Date(article.publishedAt);
              if (Number.isNaN(dt.getTime())) return '-';
              return dt.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            })();

            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="market-news-card"
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/75 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge
                        variant="outline"
                        className="border-zinc-700/90 bg-zinc-950/90 text-[10px] font-bold text-emerald-300 backdrop-blur-md"
                      >
                        {article.source}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-100 leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 px-5 py-3.5 text-[11px] font-semibold text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    {formattedDate}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:text-emerald-300">
                    Ler matéria completa
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
