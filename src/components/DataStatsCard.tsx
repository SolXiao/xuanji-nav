'use client';

import React, { useMemo } from 'react';
import { NavigationItem } from '@/types/nav';

interface DataStatsCardProps {
  items: NavigationItem[];
}

export const DataStatsCard: React.FC<DataStatsCardProps> = ({ items = [] }) => {
  const stats = useMemo(() => {
    const totalItems = items.length;

    // 统计各分类数量
    const categoryCountMap: Record<string, number> = {};
    items.forEach(item => {
      const cat = item.category || 'Uncategorized';
      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryCountMap);
    const subCategories = new Set(items.filter(i => i.subCategory).map(i => i.subCategory));

    // 排序分类 (按数量降序)
    const sortedCategories = Object.entries(categoryCountMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // 取前4名

    const maxCount = sortedCategories[0]?.[1] || 1;

    return {
      totalItems,
      categoryCount: categories.length,
      subCategoryCount: subCategories.size,
      topCategories: sortedCategories,
      maxCount
    };
  }, [items]);

  return (
    <div className="space-y-4">
      {/* 核心指标 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <span className="text-xl font-bold text-white">{stats.totalItems}</span>
          <span className="text-[9px] text-gray-500 uppercase font-mono mt-1">NODES</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <span className="text-xl font-bold text-[--accent]">{stats.categoryCount}</span>
          <span className="text-[9px] text-gray-500 uppercase font-mono mt-1">SECTORS</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <span className="text-xl font-bold text-blue-400">{stats.subCategoryCount}</span>
          <span className="text-[9px] text-gray-500 uppercase font-mono mt-1">SUBS</span>
        </div>
      </div>

      {/* 分类分布条 */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:border-[--accent]/30 transition-all">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">星域密度分布</span>
        </div>

        <div className="space-y-2">
          {stats.topCategories.map(([cat, count], index) => (
            <div key={cat} className="group">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-gray-400">{cat}</span>
                <span className="text-gray-500 font-mono">{count}</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 ${index === 0 ? 'bg-[--accent]' :
                    index === 1 ? 'bg-blue-500/80' :
                      index === 2 ? 'bg-purple-500/70' :
                        'bg-gray-600/60'
                    }`}
                  style={{ width: `${(count / stats.maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
