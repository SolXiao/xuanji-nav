'use client';

import React from 'react';
import { SEARCH_ENGINES } from '@/lib/constants';

interface SearchEngineMatrixProps {
  query: string;
  isShortcutMode?: boolean;
  activeEngineId?: string;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const CATEGORIES = ['All', 'General', 'Tech', 'Community', 'Media', 'Academic', 'Design'];

export const SearchEngineMatrix: React.FC<SearchEngineMatrixProps> = ({
  query,
  isShortcutMode,
  activeEngineId,
  activeCategory = 'All',
  onCategoryChange
}) => {
  // 处理查询词（已经在外部处理过了，这里只做简单的 trim）
  const displayQuery = query.trim();

  // 如果处于快捷模式且正好匹配到了特定引擎，我们将该引擎置顶
  const filteredEngines = SEARCH_ENGINES.filter(engine =>
    activeCategory === 'All' || engine.category === activeCategory
  ).sort((a, b) => {
    if (a.id === activeEngineId) return -1;
    if (b.id === activeEngineId) return 1;
    return 0;
  });

  if (!displayQuery && !isShortcutMode) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide px-4 md:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange?.(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border
              ${activeCategory === cat
                ? 'bg-[--accent] border-[--accent] text-[--primary-dark]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Engines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0">
        {filteredEngines.map((engine, idx) => {
          const isActive = engine.id === activeEngineId;
          return (
            <a
              key={engine.id}
              href={`${engine.url}${encodeURIComponent(displayQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1e293b]/40 backdrop-blur-md border transition-all duration-300 overflow-hidden
                ${isActive
                  ? 'border-[--accent] ring-1 ring-[--accent]/30 scale-105 shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)] bg-[#1e293b]/60'
                  : 'border-white/5 hover:border-[--accent]/40 hover:-translate-y-1'}`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[--accent]/10 to-transparent transition-opacity
                ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>

              <span className={`text-3xl mb-3 transition-transform duration-300 
                ${isActive ? 'scale-110 grayscale-0' : 'group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0'}`}>
                {engine.icon}
              </span>
              <span className={`text-xs font-medium transition-colors
                ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {engine.name}
              </span>

              <div className={`mt-2 transition-all 
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}>
                <span className="text-[10px] text-[--accent] font-mono">SEARCH ↗</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center px-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] leading-loose">
          {displayQuery
            ? `Searching for "${displayQuery}" across the universe`
            : (activeEngineId ? `Ready to search with ${SEARCH_ENGINES.find(e => e.id === activeEngineId)?.name}` : 'Enter keywords to navigate beyond boundaries')}
        </p>
      </div>
    </div>
  );
};
