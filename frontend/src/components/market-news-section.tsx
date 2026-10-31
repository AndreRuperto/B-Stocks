'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMarketNews } from '@/lib/api';
import { MarketNewsArticle } from '@/lib/schemas';
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const featured = articles[0];
  const centerArticles = articles.slice(1, 3);
  const sideArticles = articles.slice(3, 6);

  return (
    <section
      id="noticias"
      data-testid="market-news-section"
      className="space-y-6"
      aria-label="Notícias da Bolsa de Valores B3 e Ibovespa"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#2b3a4a]">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-amber-500" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-100">
            Notícias em destaque
          </h2>
        </div>

        <Link
          href="/terminal"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-300 hover:text-stone-100 transition-colors"
        >
          <span>Ver lista completa</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 h-96 rounded-2xl bg-[#1e2a36] animate-pulse" />
          <div className="lg:col-span-4 space-y-4">
            <div className="h-44 rounded-2xl bg-[#1e2a36] animate-pulse" />
            <div className="h-44 rounded-2xl bg-[#1e2a36] animate-pulse" />
          </div>
          <div className="lg:col-span-3 space-y-3">
            <div className="h-24 rounded-2xl bg-[#1e2a36] animate-pulse" />
            <div className="h-24 rounded-2xl bg-[#1e2a36] animate-pulse" />
            <div className="h-24 rounded-2xl bg-[#1e2a36] animate-pulse" />
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-[#2b3a4a] bg-[#1a2533] p-10 text-center text-xs text-stone-400">
          Nenhuma notícia da bolsa disponível no momento (-).
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {featured && (
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#2b3a4a] bg-[#1a2533] p-5 shadow-xl">
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="market-news-card"
                className="group block space-y-3"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-950">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-md border border-amber-800/60 bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                      {featured.source || 'Mercado'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="inline-block rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    Destaque Principal
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-stone-100 leading-snug group-hover:text-stone-300 transition-colors line-clamp-2">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                    {featured.summary}
                  </p>
                </div>
              </a>

              {sideArticles.length > 0 && (
                <div className="mt-5 border-t border-[#253242] pt-4 space-y-2.5">
                  {sideArticles.slice(0, 2).map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 text-xs text-stone-300 hover:text-stone-100 transition-colors"
                    >
                      <span className="text-stone-500 font-bold">•</span>
                      <span className="line-clamp-1 font-medium group-hover:underline">
                        {item.title}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="lg:col-span-4 flex flex-col gap-5">
            {centerArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="market-news-card"
                className="group flex flex-1 flex-col justify-between rounded-2xl border border-[#2b3a4a] bg-[#1a2533] p-4 shadow-xl transition-all hover:border-[#384c5f]"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-950">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <span className="rounded-md border border-slate-700 bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-stone-300 backdrop-blur-md">
                        {article.source || 'Bolsa B3'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 space-y-1.5">
                    <span className="inline-block rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-stone-300">
                      Mercado
                    </span>
                    <h3 className="text-sm font-black text-stone-100 leading-snug line-clamp-2 group-hover:text-stone-300 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#253242] pt-2.5 text-[11px] text-stone-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-stone-400 group-hover:text-stone-200">
                    Ler matéria
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl border border-[#2b3a4a] bg-[#1a2533] p-5 shadow-xl">
            <div>
              <h3 className="text-sm font-black text-stone-100 uppercase tracking-wider mb-4 pb-2 border-b border-[#253242]">
                As mais lidas hoje
              </h3>

              <div className="space-y-4">
                {sideArticles.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="market-news-card"
                    className="group flex items-start gap-3 transition-all"
                  >
                    <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-950">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="inline-block rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                        {article.source || 'Bolsa B3'}
                      </span>
                      <h4 className="text-xs font-bold text-stone-200 leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {article.title}
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#253242] text-center">
              <Link
                href="/terminal"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-200 transition-colors"
              >
                <span>Feed do Terminal</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
