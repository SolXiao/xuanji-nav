'use client';

import React from 'react';
import { SEARCH_ENGINES } from '@/lib/constants';
import { Search, Rocket } from 'lucide-react';

interface EmptyStateProps {
  query: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ query }) => {
  const handleEngineSearch = (url: string) => {
    window.open(`${url}${encodeURIComponent(query)}`, '_blank');
  };

  const suggestedEngines = SEARCH_ENGINES.filter(e =>
    ['google', 'github', 'bilibili', 'baidu', 'mdn'].includes(e.id)
  );

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-[--accent]/20 blur-[80px] rounded-full animate-pulse"></div>
        <div className="relative w-32 h-32 flex items-center justify-center text-8xl grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110 cursor-help">
          👨‍🚀
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <span className="text-xs">?</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">星图未发现匹配项</h3>
      <div className="text-gray-500 max-w-sm mb-12 text-sm leading-relaxed">
        “<span className="text-[--accent] italic font-medium">{query}</span>” 似乎不在当前的探测范围内。您可以尝试在更大的星域中搜索：
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-3xl">
        {suggestedEngines.map((engine) => (
          <button
            key={engine.id}
            onClick={() => handleEngineSearch(engine.url)}
            className="group relative flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-[--accent]/40 hover:bg-[--accent]/5 transition-all duration-300 active:scale-95"
          >
            <div className="text-3xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
              {engine.icon}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-500 group-hover:text-[--accent] uppercase tracking-widest transition-colors">
                {engine.name}
              </span>
              <div className="mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
                  {engine.prefix}
                </span>
                <Rocket className="w-2.5 h-2.5 text-[--accent]" />
              </div>
            </div>
          </button>
        ))}

        <button
          onClick={() => handleEngineSearch('https://www.google.com/search?q=')}
          className="col-span-2 md:col-span-5 mt-4 py-4 rounded-3xl bg-gradient-to-r from-[--accent]/10 to-purple-500/10 border border-white/10 hover:border-[--accent]/40 text-sm font-bold text-white tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]"
        >
          <Search className="w-4 h-4 text-[--accent]" />
          深入探索全网星系
        </button>
      </div>
    </div>
  );
};
