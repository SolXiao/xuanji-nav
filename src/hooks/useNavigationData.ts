import { useMemo } from 'react';
import { NavigationItem } from '@/types/nav';

export function useNavigationData(items: NavigationItem[], searchQuery: string) {
  // 是否处于外部搜索模式 (以 / 开头)
  const isShortcutMode = searchQuery.startsWith('/');

  // 1. 搜索过滤逻辑
  const matchedItems = useMemo(() => {
    // 如果是快捷指令模式，为了性能和 UI 清晰，不返回本地匹配结果
    if (isShortcutMode) return [];

    const query = searchQuery.toLowerCase();
    if (!query) return items;

    return items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      item.url.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(query))
    );
  }, [items, searchQuery, isShortcutMode]);

  // 2. 嵌套分组逻辑: { [primaryCategory]: { [subCategory || 'default']: NavigationItem[] } }
  const filteredGroups = useMemo(() => {
    const groups: Record<string, Record<string, NavigationItem[]>> = {};

    matchedItems.forEach(item => {
      const primary = item.category;
      const sub = item.subCategory || 'default';

      if (!groups[primary]) {
        groups[primary] = {};
      }
      if (!groups[primary][sub]) {
        groups[primary][sub] = [];
      }
      groups[primary][sub].push(item);
    });

    return groups;
  }, [matchedItems]);

  // 3. 提取所有一级分类 (用于侧边栏渲染)
  const allCategories = useMemo(() => {
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories).sort();
  }, [items]);

  // 4. 构建层级树结构 (用于侧边栏展开显示)
  const categoryTree = useMemo(() => {
    const tree: Record<string, string[]> = {};
    Object.entries(filteredGroups).forEach(([primary, subGroups]) => {
      tree[primary] = Object.keys(subGroups).filter(sub => sub !== 'default');
    });
    return tree;
  }, [filteredGroups]);

  return {
    matchedItems,
    filteredGroups,
    allCategories,
    categoryTree,
    isShortcutMode
  };
}
