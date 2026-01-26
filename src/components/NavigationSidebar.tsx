import React from 'react';

interface NavigationSidebarProps {
  categories: string[];
  categoryTree: Record<string, string[]>;
  activeCategory: string;
  scrollToAnchor: (primary: string, sub?: string) => void;
  getCategoryIcon: (cat: string) => string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  categories,
  categoryTree,
  activeCategory,
  scrollToAnchor,
  getCategoryIcon
}) => {
  return (
    <aside className="lg:w-60 flex-shrink-0">
      <nav className="sticky top-32 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-4 lg:pb-0 scrollbar-hide px-1">
        {categories.map(category => {
          const isActive = activeCategory === category;
          const subcats = categoryTree[category] || [];

          return (
            <div key={category} className="flex flex-col group/nav">
              <button
                onClick={() => scrollToAnchor(category)}
                className={`flex items-center gap-3 px-5 py-3 rounded-r-xl text-sm transition-all duration-300 text-left border-l-2
                   ${isActive
                    ? 'border-[--accent] bg-gradient-to-r from-[--accent]/10 to-transparent text-[--accent-light] font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:pl-6'
                  }`}
              >
                <span className="text-lg opacity-80 group-hover/nav:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category)}
                </span>
                <span className="truncate">{category}</span>
              </button>

              {/* 二级菜单逻辑 */}
              {isActive && subcats.length > 0 && (
                <div className="hidden lg:flex flex-col ml-10 mt-1 mb-2 border-l border-white/5 gap-1 animate-in slide-in-from-left-2 duration-300">
                  {subcats.map(sub => (
                    <button
                      key={sub}
                      onClick={() => scrollToAnchor(category, sub)}
                      className="px-4 py-1.5 text-[11px] text-gray-500 hover:text-[--accent-light] hover:bg-white/5 rounded-r-lg transition-all text-left truncate relative group/sub"
                    >
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-white/20 group-hover/sub:bg-[--accent]/40"></span>
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
