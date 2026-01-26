'use client';

import React, { useState } from 'react';
import { SEARCH_ENGINES } from '@/lib/constants';

interface SearchEngineMatrixProps {
  query: string;
  isShortcutMode?: boolean;
}

const CATEGORIES = ['All', 'General', 'Tech', 'Community', 'Media', 'Academic', 'Design'];

export const SearchEngineMatrix: React.FC<SearchEngineMatrixProps> = ({ query, isShortcutMode }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // 处理查询词（移除前缀）
  const displayQuery = isShortcutMode ? query.substring(1).trim() : query.trim();

  const filteredEngines = SEARCH_ENGINES.filter(engine =>
    activeCategory === 'All' || engine.category === activeCategory
  );

  if (!displayQuery && !isShortcutMode) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide px-4 md:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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
        {filteredEngines.map((engine, idx) => (
          <a
            key={engine.id}
            href={`${engine.url}${encodeURIComponent(displayQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1e293b]/40 backdrop-blur-md border border-white/5 hover:border-[--accent]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[--accent]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 grayscale-[0.5] group-hover:grayscale-0">
              {engine.icon}
            </span>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
              {engine.name}
            </span>

            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <span className="text-[10px] text-[--accent] font-mono">SEARCH ↗</span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          {displayQuery ? `Searching for "${displayQuery}" across the universe` : 'Enter keywords to navigate beyond boundaries'}
        </p>
      </div>
    </div>
  );
};
