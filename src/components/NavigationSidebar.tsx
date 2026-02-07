import { CategoryTree, NavigationItem } from '@/types/nav';

interface NavigationSidebarProps {
  items: NavigationItem[]; // 用于数据统计
  categories: string[];
  categoryTree: CategoryTree;
  activeCategory: string;
  scrollToAnchor: (primary: string, sub?: string) => void;
  getCategoryIcon: (cat: string) => string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  items,
  categories,
  categoryTree,
  activeCategory,
  scrollToAnchor,
  getCategoryIcon
}) => {
  return (
    <aside className="w-full lg:w-auto">
      <nav className="sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar flex lg:flex-col overflow-x-auto gap-2 pb-4 lg:pb-0 px-1">

        <div className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mb-2 px-5 hidden lg:block opacity-50">
          星图导航
        </div>

        {/* 全部区域置顶入口 */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            scrollToAnchor('');
          }}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm transition-all duration-300 text-left border-l-2
            ${activeCategory === ''
              ? 'border-[--accent] bg-gradient-to-r from-[--accent]/10 to-transparent text-[--accent-light] font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
        >
          <span className="text-lg">🌌</span>
          <span className="truncate">全部星域</span>
        </button>

        <div className="h-px bg-white/5 my-2 mx-5 hidden lg:block"></div>
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
