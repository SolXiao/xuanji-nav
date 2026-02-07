'use client';

import React, { useRef, useEffect } from 'react';
import { SearchEngine } from '@/lib/constants';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isShortcutMode: boolean;
  activeEngine?: SearchEngine;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  isShortcutMode,
  activeEngine,
  onSearch,
  onKeyDown,
  inputRef,
}) => {
  return (
    <div className="relative group">
      {/* 增强的动态光晕背景 */}
      <div className={`absolute -inset-2 bg-gradient-to-r from-[--accent] via-[--secondary] to-[--accent] rounded-full blur-3xl transition-all duration-700 ease-out
        ${isShortcutMode ? 'opacity-60 scale-110 animate-pulse' : 'opacity-15 group-hover:opacity-35 group-focus-within:opacity-40 group-focus-within:scale-105'}`}>
      </div>

      <div className="relative flex items-center">
        {/* 引擎模式指示器 (仅在快捷模式下显示) */}
        {isShortcutMode && activeEngine && (
          <div className="absolute left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[--accent]/10 border border-[--accent]/30 backdrop-blur-md animate-in zoom-in-50 duration-300 z-10">
            <span className="text-sm">{activeEngine.icon}</span>
            <span className="text-[10px] font-bold text-[--accent] uppercase tracking-tighter">{activeEngine.name}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={isShortcutMode ? `🚀 正在探测...` : "🔭 探索星系 · 按 Tab 切换引擎 · 按 / 快速聚焦"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className={`w-full bg-[#0f172a]/95 backdrop-blur-3xl text-white placeholder-gray-400/70 border rounded-full py-6 text-xl font-light tracking-wide focus:outline-none transition-all duration-500 shadow-2xl
            ${isShortcutMode
              ? 'border-[--accent] ring-4 ring-[--accent]/25 shadow-[0_0_60px_rgba(var(--accent-rgb),0.4)] scale-[1.02] pl-32 pr-36'
              : 'border-white/10 hover:border-white/20 focus:border-[--accent]/60 focus:ring-2 focus:ring-[--accent]/15 focus:scale-[1.01] px-12 pr-36'
            }`}
        />

        <div className="absolute right-7 flex items-center gap-3">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer hover:rotate-90 active:scale-90 border border-white/5 hover:border-white/20"
              aria-label="清除搜索"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="w-px h-7 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <button
            onClick={onSearch}
            className={`text-3xl transition-all duration-500 hover:scale-125 active:scale-95 cursor-pointer flex items-center justify-center p-2 rounded-full
              ${isShortcutMode
                ? 'scale-125 rotate-12 drop-shadow-[0_0_20px_var(--accent)] bg-[--accent]/10 border border-[--accent]/30'
                : 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            title={activeEngine ? `使用 ${activeEngine.name} 搜索` : "全网探测"}
            aria-label="执行搜索"
          >
            {activeEngine ? activeEngine.icon : (isShortcutMode ? '☄️' : '🔭')}
          </button>
        </div>
      </div>
    </div>
  );
};
