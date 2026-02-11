'use client';

import { useState, useEffect, useRef } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { NavigationItem } from '@/types/nav';
import { useSearch } from '@/context/SearchContext';
import { SearchBar } from './SearchBar';

interface NavbarProps {
  items: NavigationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [time, setTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen, isShortcutMode, engineId } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#0f172a]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* 左侧：品牌标识 */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[--accent] to-purple-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <span className="text-3xl relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">🪐</span>
            </div>

            <div className="flex flex-col justify-center h-full">
              <span className="text-lg font-bold text-white tracking-wider leading-none group-hover:text-[--accent-light] transition-colors duration-300">
                璇玑 <span className="text-[--accent] font-light opacity-80">NAVIGATOR</span>
              </span>
              <span className="text-[9px] text-gray-500 font-mono tracking-[0.3em] uppercase mt-1 group-hover:text-[--accent] transition-colors duration-500">
                Ver 5.0.0
              </span>
            </div>
          </div>

          {/* 中间：搜索触发器 (Empty Space Utilization) */}
          <div className="flex-1 max-w-2xl mx-auto px-8 hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-full max-w-[400px] h-10 mx-auto rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[--accent]/30 flex items-center px-4 gap-3 text-gray-400 transition-all duration-300 group
                 ${searchQuery ? 'border-[--accent]/50 bg-[--accent]/5 text-[--accent]' : ''}`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                {isShortcutMode ? '🚀' : '🔭'}
              </span>
              <span className="flex-1 text-left text-sm truncate font-light tracking-wide opacity-70 group-hover:opacity-100">
                {searchQuery || "点击或按 '/' 唤醒探索协议..."}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono border border-white/5">/</span>
            </button>
          </div>

            {/* 右侧：控制按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[--accent]/30 transition-all duration-300"
              aria-label="Settings"
            >
              <div className="absolute inset-0 bg-[--accent]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-[--accent] transition-all duration-500 group-hover:rotate-90" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        items={items}
      />

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md" onClick={() => setIsSearchOpen(false)}></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-3xl px-6 animate-in zoom-in-95 slide-in-from-top-4 duration-300">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isShortcutMode={isShortcutMode}
              activeEngine={engineId ? { id: engineId, name: engineId, url: '', icon: '🚀', prefix: '', category: 'default' } : undefined}
              onSearch={() => setIsSearchOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsSearchOpen(false);
              }}
              inputRef={inputRef}
            />

            {/* Search Tips */}
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400 font-mono">
              <span>[TAB] 切换引擎</span>
              <span>[ESC] 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
