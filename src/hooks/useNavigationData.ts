import { useMemo } from 'react';
import { NavigationItem, GroupedNavigationItems, CategoryTree } from '@/types/nav';
import { SEARCH_ENGINES } from '@/lib/constants';

export function useNavigationData(
  items: NavigationItem[],
  displayQuery: string,
  isShortcutMode: boolean
) {
  // 1. 搜索过滤逻辑
  const matchedItems = useMemo(() => {
    // 如果是快捷指令模式，且已经有了明确的显示内容，或者还没有内容但处于该模式，不返回本地匹配
    if (isShortcutMode) return [];

    const query = displayQuery.toLowerCase();
    if (!query) return items;

    return items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      item.url.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(query))
    );
  }, [items, isShortcutMode, displayQuery]);

  // 2. 嵌套分组逻辑: { [primaryCategory]: { [subCategory || 'default']: NavigationItem[] } }
  const filteredGroups = useMemo<GroupedNavigationItems>(() => {
    const groups: GroupedNavigationItems = {};

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
  const categoryTree = useMemo<CategoryTree>(() => {
    const tree: CategoryTree = {};
    Object.entries(filteredGroups).forEach(([primary, subGroups]) => {
      tree[primary] = Object.keys(subGroups).filter(sub => sub !== 'default');
    });
    return tree;
  }, [filteredGroups]);

  return {
    matchedItems,
    filteredGroups,
    allCategories,
    categoryTree
  };
}
