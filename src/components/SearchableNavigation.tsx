'use client';

import { useState, useEffect, useRef } from 'react';
import { NavigationItem } from '@/types/nav';
import { useNavigationData } from '@/hooks/useNavigationData';
import { NavigationSidebar } from './NavigationSidebar';
import { CategorySection } from './CategorySection';
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
    categoryTree
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
            placeholder="搜索星系 (e.g. AI, 设计...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f172a]/70 backdrop-blur-xl text-white placeholder-gray-500 border border-white/10 rounded-full py-4 px-8 pr-16 text-lg focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all shadow-2xl"
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
            <span className="text-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">🔭</span>
          </div>
        </div>
      </div>

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
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
              <div className="text-6xl mb-6 grayscale opacity-50">🪐</div>
              <p className="text-xl font-light">未观测到相关天体</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-all text-[--accent-light]"
              >
                清除搜索结果
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

      <BackToTop />
    </div>
  );
}
