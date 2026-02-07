import { NavigationItem } from '@/types/nav';

/**
 * 统计历史记录接口
 */
export interface StatsHistory {
  date: string; // YYYY-MM-DD
  totalItems: number;
  categories: number;
  timestamp: number;
}

/**
 * 趋势数据接口
 */
export interface StatsTrend {
  dailyChange: number;
  weeklyChange: number;
  dailyPercent: number;
  weeklyPercent: number;
}

const STORAGE_KEY = 'xuanji-stats-history';
const MAX_HISTORY_DAYS = 30;

/**
 * 获取统计历史记录
 */
export function getStatsHistory(): StatsHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: StatsHistory[] = JSON.parse(stored);
    return history.filter(h => h && h.date && h.totalItems !== undefined);
  } catch (error) {
    console.error('Failed to load stats history:', error);
    return [];
  }
}

/**
 * 保存统计数据快照
 */
export function saveStatsSnapshot(items: NavigationItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getStatsHistory();
    const today = new Date().toISOString().split('T')[0];

    // 检查今天是否已有记录
    const todayIndex = history.findIndex(h => h.date === today);

    const snapshot: StatsHistory = {
      date: today,
      totalItems: items.length,
      categories: new Set(items.map(i => i.category || '未分类')).size,
      timestamp: Date.now(),
    };

    let updated: StatsHistory[];
    if (todayIndex >= 0) {
      // 更新今天的记录
      updated = [...history];
      updated[todayIndex] = snapshot;
    } else {
      // 添加新记录
      updated = [snapshot, ...history];
    }

    // 只保留最近N天
    const trimmed = updated.slice(0, MAX_HISTORY_DAYS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save stats snapshot:', error);
  }
}

/**
 * 计算趋势数据
 */
export function calculateTrend(items: NavigationItem[]): StatsTrend {
  const history = getStatsHistory();

  if (history.length === 0) {
    return {
      dailyChange: 0,
      weeklyChange: 0,
      dailyPercent: 0,
      weeklyPercent: 0,
    };
  }

  const current = items.length;
  const yesterday = history[1];
  const lastWeek = history[7];

  const dailyChange = yesterday ? current - yesterday.totalItems : 0;
  const weeklyChange = lastWeek ? current - lastWeek.totalItems : 0;

  const dailyPercent = yesterday && yesterday.totalItems > 0
    ? (dailyChange / yesterday.totalItems) * 100
    : 0;

  const weeklyPercent = lastWeek && lastWeek.totalItems > 0
    ? (weeklyChange / lastWeek.totalItems) * 100
    : 0;

  return {
    dailyChange,
    weeklyChange,
    dailyPercent,
    weeklyPercent,
  };
}

/**
 * 获取最近添加的项目（基于ID时间戳）
 */
export function getRecentItems(items: NavigationItem[], count: number = 5): NavigationItem[] {
  // 尝试从ID中提取时间戳（假设ID格式包含时间信息）
  // 或者基于数组顺序（假设新添加的在后面）
  return items.slice(-count).reverse();
}

/**
 * 清除统计历史
 */
export function clearStatsHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
