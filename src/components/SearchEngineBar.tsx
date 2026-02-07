'use client';

import React from 'react';
import { SearchEngine, SEARCH_ENGINES } from '@/lib/constants';

interface SearchEngineBarProps {
  engineId: string | null;
  onSetEngineMode: (prefix: string) => void;
}

export const SearchEngineBar: React.FC<SearchEngineBarProps> = ({
  engineId,
  onSetEngineMode,
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 group-focus-within:opacity-100 translate-y-2 group-focus-within:translate-y-0 transition-all pointer-events-none group-focus-within:pointer-events-auto overflow-hidden">
      <div className="flex gap-2 overflow-x-auto py-1 px-2 no-scrollbar">
        {SEARCH_ENGINES.slice(0, 10).map(eng => (
          <button
            key={eng.id}
            onClick={() => onSetEngineMode(eng.prefix!)}
            className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all hover:bg-white/5 group/icon
              ${engineId === eng.id ? 'bg-[--accent]/10 border border-[--accent]/20' : 'border border-transparent'}`}
          >
            <span className={`text-xl transition-transform group-hover/icon:scale-110 ${engineId === eng.id ? '' : 'grayscale-[0.5]'}`}>{eng.icon}</span>
            <span className={`text-[9px] uppercase tracking-tighter ${engineId === eng.id ? 'text-[--accent]' : 'text-gray-500'}`}>{eng.prefix}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
