import { NavigationItem } from '@/types/nav';

/**
 * URL标准化 - 用于去重对比
 * 1. 移除协议差异（http/https）
 * 2. 移除 www. 前缀
 * 3. 移除末尾斜杠
 * 4. 转小写
 */
export function normalizeURL(url: string): string {
  try {
    const urlObj = new URL(url);

    // 移除 www. 前缀
    let hostname = urlObj.hostname.replace(/^www\./, '');

    // 转小写
    hostname = hostname.toLowerCase();

    // 移除末尾斜杠
    let pathname = urlObj.pathname.replace(/\/$/, '');

    // 组合标准化URL（不包含协议）
    const normalized = `${hostname}${pathname}${urlObj.search}`;

    return normalized;
  } catch {
    // 如果URL无效，返回原始URL的小写版本
    return url.toLowerCase().replace(/\/$/, '');
  }
}

/**
 * 重复项分组接口
 */
export interface DuplicateGroup {
  normalizedUrl: string;
  items: NavigationItem[];
  count: number;
}

/**
 * 查找重复项
 * @param items 所有导航项
 * @returns 重复项分组数组（每组至少2个项目）
 */
export function findDuplicates(items: NavigationItem[]): DuplicateGroup[] {
  // 使用Map来分组
  const urlMap = new Map<string, NavigationItem[]>();

  items.forEach(item => {
    const normalized = normalizeURL(item.url);

    if (!urlMap.has(normalized)) {
      urlMap.set(normalized, []);
    }
    urlMap.get(normalized)!.push(item);
  });

  // 只保留有重复的组（数量 >= 2）
  const duplicates: DuplicateGroup[] = [];

  urlMap.forEach((items, normalizedUrl) => {
    if (items.length >= 2) {
      duplicates.push({
        normalizedUrl,
        items,
        count: items.length,
      });
    }
  });

  // 按重复数量降序排序
  duplicates.sort((a, b) => b.count - a.count);

  return duplicates;
}

/**
 * 统计重复项信息
 */
export function getDuplicateStats(duplicates: DuplicateGroup[]) {
  const totalDuplicateGroups = duplicates.length;
  const totalDuplicateItems = duplicates.reduce((sum, group) => sum + group.count, 0);
  const itemsToRemove = duplicates.reduce((sum, group) => sum + (group.count - 1), 0);

  return {
    totalGroups: totalDuplicateGroups,
    totalItems: totalDuplicateItems,
    canRemove: itemsToRemove,
  };
}
