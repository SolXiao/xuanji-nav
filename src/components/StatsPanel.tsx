'use client';

import React, { useMemo, useEffect } from 'react';
import { NavigationItem } from '@/types/nav';
import { saveStatsSnapshot, calculateTrend, getRecentItems } from '@/lib/stats-tracker';

interface StatsPanelProps {
  items: NavigationItem[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ items = [] }) => {
  // 保存统计快照
  useEffect(() => {
    if (items.length > 0) {
      saveStatsSnapshot(items);
    }
  }, [items.length]); // 只在数量变化时保存

  const stats = useMemo(() => {
    const totalItems = items.length;

    // 统计各分类数量
    const categoryCountMap: Record<string, number> = {};
    items.forEach(item => {
      const cat = item.category || '未分类';
      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryCountMap);
    const subCategories = new Set(items.filter(i => i.subCategory).map(i => i.subCategory));

    // 排序分类 (按数量降序)
    const sortedCategories = Object.entries(categoryCountMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // 增加到前5名

    const maxCount = sortedCategories[0]?.[1] || 1;

    // 计算趋势
    const trend = calculateTrend(items);

    // 获取最近项目
    const recentItems = getRecentItems(items, 3);

    return {
      totalItems,
      categoryCount: categories.length,
      subCategoryCount: subCategories.size,
      topCategories: sortedCategories,
      maxCount,
      trend,
      recentItems,
    };
  }, [items]);

  const formatChange = (change: number) => {
    if (change === 0) return '±0';
    return change > 0 ? `+${change}` : `${change}`;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-500';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '━';
  };

  return (
    <div className="space-y-4">
      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-2">
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
        {/* 今日变化 */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex flex-col items-center justify-center hover:border-purple-500/40 transition-all">
          <span className={`text-xl font-bold ${getTrendColor(stats.trend.dailyChange)}`}>
            {formatChange(stats.trend.dailyChange)}
          </span>
          <span className="text-[9px] text-gray-500 uppercase font-mono mt-1">TODAY</span>
        </div>
      </div>

      {/* 趋势统计 */}
      {(stats.trend.dailyChange !== 0 || stats.trend.weeklyChange !== 0) && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📊 趋势</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <div className={`flex items-center gap-1 ${getTrendColor(stats.trend.dailyChange)}`}>
                <span>{getTrendIcon(stats.trend.dailyChange)}</span>
                <span>{formatChange(stats.trend.dailyChange)}</span>
                <span className="text-[9px] text-gray-500">今日</span>
              </div>
              <div className={`flex items-center gap-1 ${getTrendColor(stats.trend.weeklyChange)}`}>
                <span>{getTrendIcon(stats.trend.weeklyChange)}</span>
                <span>{formatChange(stats.trend.weeklyChange)}</span>
                <span className="text-[9px] text-gray-500">本周</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 分类分布条 */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:border-[--accent]/30 transition-all">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">星域密度分布</span>
          <span className="text-[9px] text-gray-600 font-mono">TOP {stats.topCategories.length}</span>
        </div>

        <div className="space-y-2">
          {stats.topCategories.map(([cat, count], index) => (
            <div key={cat} className="group">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-gray-400 truncate flex-1">{cat}</span>
                <span className="text-gray-500 font-mono ml-2">{count}</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 ${index === 0 ? 'bg-[--accent]' :
                      index === 1 ? 'bg-blue-500/80' :
                        index === 2 ? 'bg-purple-500/70' :
                          index === 3 ? 'bg-pink-500/60' :
                            'bg-gray-600/50'
                    }`}
                  style={{ width: `${(count / stats.maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      {stats.recentItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-green-500/20 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">最近收录</span>
            <span className="text-[9px] text-gray-600">RECENT</span>
          </div>
          <div className="space-y-1.5">
            {stats.recentItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="w-1 h-1 rounded-full bg-green-400 mt-1.5 group-hover:bg-green-300"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white truncate">{item.title}</div>
                  <div className="text-[9px] text-gray-500">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
