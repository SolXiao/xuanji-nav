'use client';

import { useState, useEffect, useRef } from 'react';
import { NavigationItem } from '@/types/nav';
import { useNavigationData } from '@/hooks/useNavigationData';
import { NavigationSidebar } from './NavigationSidebar';
import { CategorySection } from './CategorySection';
import { SearchEngineMatrix } from './SearchEngineMatrix';
import { BackToTop } from './BackToTop';
import { CATEGORY_ICONS } from '@/lib/constants';

interface SearchableNavigationProps {
  items: NavigationItem[];
}

export default function SearchableNavigation({ items }: SearchableNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const {
    filteredGroups,
    allCategories,
    categoryTree,
    isShortcutMode // Added isShortcutMode
  } = useNavigationData(items, searchQuery);

  // 鼠标追踪效果 (节流优化：使用 RequestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${mousePosRef.current.x}px`);
          document.documentElement.style.setProperty('--mouse-y', `${mousePosRef.current.y}px`);
          rafIdRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // 处理平滑滚动
  const scrollToAnchor = (primary: string, sub?: string) => {
    const elementId = sub ? `subcat-${primary}-${sub}` : `category-${primary}`;
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveCategory(primary);
    }
  };

  const getCategoryIcon = (cat: string) => {
    if (CATEGORY_ICONS[cat]) return CATEGORY_ICONS[cat];
    const key = Object.keys(CATEGORY_ICONS).find(k => cat.includes(k));
    return key ? CATEGORY_ICONS[key] : '📂';
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl min-h-[400px]">
        <div className="animate-spin text-6xl mb-6 opacity-80">🌌</div>
        <p className="text-2xl text-gray-300 font-light">虚空之中，暂无星系</p>
        <p className="text-sm text-gray-500 mt-4">请连接 Notion 数据库或检查配置</p>
      </div>
    );
  }

  const hasResults = Object.keys(filteredGroups).length > 0;

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-700">
      {/* 搜索框 */}
      <div className="sticky top-6 z-40 w-full max-w-2xl mx-auto px-4 md:px-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[--accent] via-[--secondary] to-[--accent] opacity-20 blur-xl rounded-full group-hover:opacity-40 transition duration-500 animate-pulse"></div>
          <input
            type="text"
            placeholder={isShortcutMode ? "正在向全宇宙同步搜索..." : "搜索星系 (输入 / 开启全网探索...)"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-[#0f172a]/70 backdrop-blur-xl text-white placeholder-gray-500 border rounded-full py-4 px-8 pr-16 text-lg focus:outline-none transition-all shadow-2xl
              ${isShortcutMode ? 'border-[--accent] ring-2 ring-[--accent]/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]' : 'border-white/10 focus:border-[--accent]/50'}`}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className={`text-xl transition-all duration-500 ${isShortcutMode ? 'scale-125 rotate-12 drop-shadow-[0_0_8px_var(--accent)]' : 'grayscale opacity-50'}`}>
              {isShortcutMode ? '☄️' : '🔭'}
            </span>
          </div>
        </div>
      </div>

      {isShortcutMode ? (
        /* Shortcut Mode: Only Show Search Engine Matrix */
        <div className="min-h-[50vh] flex flex-col items-center">
          <SearchEngineMatrix query={searchQuery} isShortcutMode={true} />
        </div>
      ) : (
        /* Normal Mode: Sidebar + Content */
        <div className="flex flex-col lg:flex-row gap-10 mt-2 relative">
          {/* 侧边层级导航 */}
          <NavigationSidebar
            categories={allCategories}
            categoryTree={categoryTree}
            activeCategory={activeCategory}
            scrollToAnchor={scrollToAnchor}
            getCategoryIcon={getCategoryIcon}
          />

          {/* 主内容区 */}
          <div className="flex-1 space-y-20 min-h-[60vh]">
            {!hasResults ? (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="text-6xl mb-6 grayscale opacity-50">🪐</div>
                <p className="text-xl font-light text-gray-400">本地未观测到相关天体</p>
                <p className="text-sm text-gray-600 mt-2 mb-10">或许这些深空入口能帮到你：</p>

                <SearchEngineMatrix query={searchQuery} />

                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-12 px-8 py-2 rounded-full border border-white/10 text-xs hover:bg-white/5 transition-all text-gray-500 uppercase tracking-widest"
                >
                  重置本地扫描
                </button>
              </div>
            ) : (
              Object.entries(filteredGroups).map(([primaryCategory, subGroups]) => (
                <CategorySection
                  key={primaryCategory}
                  primaryCategory={primaryCategory}
                  subGroups={subGroups}
                  getCategoryIcon={getCategoryIcon}
                />
              ))
            )}
          </div>
        </div>
      )}

      <BackToTop />
    </div>
  );
}
