import React from 'react';
import { NavigationItem, SubCategoryMap } from '@/types/nav';
import { NavigationCard } from './NavigationCard';

interface CategorySectionProps {
  primaryCategory: string;
  subGroups: Record<string, NavigationItem[]>;
  getCategoryIcon: (cat: string) => string;
  searchQuery?: string;
  onDelete?: (id: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  primaryCategory,
  subGroups,
  getCategoryIcon,
  searchQuery,
  onDelete
}) => {
  return (
    <section className="space-y-10">
      {/* 一级分类标题 */}
      <div className="flex items-center gap-5 group mb-2">
        {/* 分类图标 */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl shadow-xl border border-white/10 group-hover:border-[--accent]/40 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
          {/* 图标背景光晕 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[--accent]/0 group-hover:from-[--accent]/15 to-transparent transition-all duration-700"></div>
          <span className="relative z-10 drop-shadow-lg">{getCategoryIcon(primaryCategory)}</span>
        </div>
        {/* 分类标题 */}
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-100 tracking-wide group-hover:from-[--accent-light] group-hover:via-white group-hover:to-[--accent-light] transition-all duration-700">
          {primaryCategory}
        </h2>
        {/* 装饰线 */}
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/5 to-transparent group-hover:from-[--accent]/40 group-hover:via-[--accent]/10 transition-all duration-700"></div>
      </div>

      {/* 遍历二级分类 */}
      <div className="space-y-12">
        {Object.entries(subGroups).map(([subCategory, catItems], subIdx) => (
          <div
            key={subCategory}
            id={`subcat-${primaryCategory}-${subCategory}`}
            className="space-y-6 scroll-mt-40 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ animationDelay: `${subIdx * 100}ms` }}
          >
            {subCategory !== 'default' && (
              <div className="flex items-center gap-3 ml-2 group/subcat">
                {/* 装饰性圆点 */}
                <span className="w-2 h-2 rounded-full bg-[--accent]/50 group-hover/subcat:bg-[--accent] group-hover/subcat:scale-150 transition-all duration-500 shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"></span>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.25em] group-hover/subcat:text-[--accent-light] group-hover/subcat:tracking-[0.3em] transition-all duration-500">
                  {subCategory}
                </h3>
                {/* 项目计数 */}
                <span className="text-[10px] text-gray-600 font-mono flex items-center gap-2 opacity-0 group-hover/subcat:opacity-100 transition-all duration-500">
                  <span className="w-8 h-px bg-gradient-to-r from-white/20 to-transparent"></span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{catItems.length}</span>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {catItems.map((item, itemIdx) => (
                <NavigationCard
                  key={item.id}
                  item={item}
                  index={itemIdx}
                  searchQuery={searchQuery}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
