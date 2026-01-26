import React from 'react';
import { NavigationItem } from '@/types/nav';
import { NavigationCard } from './NavigationCard';

interface CategorySectionProps {
  primaryCategory: string;
  subGroups: Record<string, NavigationItem[]>;
  getCategoryIcon: (cat: string) => string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  primaryCategory,
  subGroups,
  getCategoryIcon
}) => {
  return (
    <section
      id={`category-${primaryCategory}`}
      className="scroll-mt-32 space-y-10"
    >
      {/* 一级分类标题 */}
      <div className="flex items-center gap-4 group">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shadow-inner border border-white/5 group-hover:border-[--accent]/30 transition-colors duration-500">
          {getCategoryIcon(primaryCategory)}
        </div>
        <h2 className="text-2xl font-bold text-gray-100 tracking-wide">
          {primaryCategory}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
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
              <div className="flex items-center gap-3 ml-1 group/subcat">
                <span className="w-1.5 h-1.5 rounded-full bg-[--accent]/40 group-hover/subcat:bg-[--accent] group-hover/subcat:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"></span>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.2em] group-hover/subcat:text-gray-200 transition-colors">
                  {subCategory}
                </h3>
                <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1 opacity-0 group-hover/subcat:opacity-100 transition-opacity">
                  <span className="w-4 h-px bg-white/10"></span>
                  {catItems.length} ITEMS
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catItems.map((item, itemIdx) => (
                <NavigationCard key={item.id} item={item} index={itemIdx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
