'use client';

import { useState, useEffect, useRef } from 'react';
import { NavigationItem, CategoryTree, GroupedNavigationItems } from '@/types/nav';
import { useNavigationData } from '@/hooks/useNavigationData';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useSearch } from '@/context/SearchContext';
import { NavigationSidebar } from './NavigationSidebar';
import { CategorySection } from './CategorySection';
import { ContentResults } from './ContentResults';
import { SearchEngineMatrix } from './SearchEngineMatrix';
import { BackToTop } from './BackToTop';
import { CATEGORY_ICONS, SEARCH_ENGINES } from '@/lib/constants';
import { EmptyState } from './EmptyState';
import { FloatingActionButton } from './FloatingActionButton';
import { AddLinkModal } from './Modals/AddLinkModal';
import { saveLocalLink, getCachedLinks, deleteLocalLink } from '@/lib/storage/indexeddb';
import { toast } from 'sonner';
import { ConfirmModal } from './Modals/ConfirmModal';

interface SearchableNavigationProps {
  items: NavigationItem[];
}

export default function SearchableNavigation({ items = [] }: SearchableNavigationProps) {
  const [localItems, setLocalItems] = useState<NavigationItem[]>([]);
  const [mergedItems, setMergedItems] = useState<NavigationItem[]>(items);

  // Use Context for search state
  const { searchQuery, isShortcutMode, engineId, displayQuery, setSearchQuery } = useSearch();

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSearchCategory, setActiveSearchCategory] = useState('All'); // For SearchEngineMatrix
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 初始化加载本地数据并合并
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const local = await getCachedLinks();
        setLocalItems(local);
      } catch (e) {
        console.error('Failed to load local links', e);
      }
    };
    loadLocalData();
  }, []);

  // 当 items 或 localItems 变化时更新合并列表
  useEffect(() => {
    const notionIds = new Set(items.map(i => i.id));
    const uniqueLocal = localItems.filter(i => !notionIds.has(i.id));
    setMergedItems([...items, ...uniqueLocal]);
  }, [items, localItems]);

  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  });

  // 删除本地项
  const handleDeleteRequest = (id: string) => {
    setConfirmModal({ isOpen: true, itemId: id });
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      try {
        await deleteLocalLink(confirmModal.itemId);
        setLocalItems(prev => prev.filter(item => item.id !== confirmModal.itemId));
        toast.success('星标已移除');
      } catch (e) {
        toast.error('移除失败');
      } finally {
        setConfirmModal({ isOpen: false, itemId: null });
      }
    }
  };

  // 2. 获取过滤后的导航数据
  const {
    filteredGroups,
    allCategories,
    categoryTree,
  } = useNavigationData(mergedItems, displayQuery, isShortcutMode);

  // 鼠标追踪效果
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

  // 实现 Scroll-Spy (自动跟踪激活分类)
  const scrolledCategory = useScrollSpy('.category-section-wrapper', {
    root: null,
    rootMargin: '-150px 0px -70% 0px',
    threshold: 0
  }, isShortcutMode);

  useEffect(() => {
    if (scrolledCategory) {
      setActiveCategory(scrolledCategory);
    }
  }, [scrolledCategory]);

  const getCategoryIcon = (cat: string) => {
    if (CATEGORY_ICONS[cat]) return CATEGORY_ICONS[cat];
    const key = Object.keys(CATEGORY_ICONS).find(k => cat.includes(k));
    return key ? CATEGORY_ICONS[key] : '📂';
  };

  if (mergedItems.length === 0) {
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
    <div className="flex flex-col gap-10 md:gap-16 w-full animate-in fade-in duration-700">

      {isShortcutMode ? (
        /* Shortcut Mode: Centered Matrix */
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8">
          <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
            {/* Removed SearchBar */}
          </div>

          <SearchEngineMatrix
            query={displayQuery}
            isShortcutMode={true}
            activeEngineId={engineId || undefined}
            activeCategory={activeSearchCategory}
            onCategoryChange={setActiveSearchCategory}
          />
        </div>
      ) : (
        /* Normal Mode: Grid Layout (Sidebar + Content) */
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 relative items-start">
          {/* Sticky Sidebar */}
          <NavigationSidebar
            items={mergedItems}
            categories={allCategories}
            categoryTree={categoryTree}
            activeCategory={activeCategory}
            scrollToAnchor={scrollToAnchor}
            getCategoryIcon={getCategoryIcon}
          />

          {/* Main Content Column */}
          <div className="w-full min-w-0 space-y-8">
            <ContentResults
              filteredGroups={filteredGroups}
              displayQuery={displayQuery}
              getCategoryIcon={getCategoryIcon}
              onDelete={handleDeleteRequest}
              hasResults={hasResults}
            />
          </div>
        </div>
      )}

      <BackToTop />

      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const newItem = {
              ...data,
              id: `local-${Date.now()}`,
              createdAt: new Date().toISOString()
            };
            await saveLocalLink(newItem);
            setLocalItems(prev => [...prev, newItem]);
            toast.success('星标已点亮，已存入本地星图');
          } catch (e) {
            toast.error('点亮星标失败，请检查轨道');
          }
        }}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="移除星标"
        description="确定要将此星标从您的本地星图中移除吗？此操作无法撤销。"
        confirmText="确认移除"
        isDestructive={true}
      />
    </div>
  );
}
