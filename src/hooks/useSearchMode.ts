import { useMemo } from 'react';
import { SEARCH_ENGINES } from '@/lib/constants';

interface SearchModeResult {
  isShortcutMode: boolean;
  engineId: string | null;
  displayQuery: string;
}

/**
 * 解析搜索查询，确定搜索模式（本地 vs 快捷指令/搜索引擎）
 * @param searchQuery 原始查询字符串
 */
export function useSearchMode(searchQuery: string): SearchModeResult {
  return useMemo(() => {
    const trimmedQuery = searchQuery.trim();

    // 1. 检查是否以 / 开头 (通用搜索模式)
    if (searchQuery.startsWith('/')) {
      return {
        isShortcutMode: true,
        engineId: null,
        displayQuery: searchQuery.substring(1).trim()
      };
    }

    // 2. 检查前缀匹配 (如 "g ", "gh ")
    const firstSpaceIndex = searchQuery.indexOf(' ');
    if (firstSpaceIndex !== -1) {
      const prefix = searchQuery.substring(0, firstSpaceIndex).toLowerCase();
      const engine = SEARCH_ENGINES.find(e => e.prefix === prefix);

      if (engine) {
        return {
          isShortcutMode: true,
          engineId: engine.id,
          displayQuery: searchQuery.substring(firstSpaceIndex + 1).trim()
        };
      }
    }

    // 3. 默认本地搜索模式
    return {
      isShortcutMode: false,
      engineId: null,
      displayQuery: trimmedQuery
    };
  }, [searchQuery]);
}
