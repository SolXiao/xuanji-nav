/**
 * 导航项基础接口
 */
export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category: string;
  subCategory?: string;
  description?: string;
}

/**
 * 子分类映射表 (子分类名称 -> 导航项数组)
 */
export type SubCategoryMap = Record<string, NavigationItem[]>;

/**
 * 分组导航项 (一级分类 -> 子分类映射表)
 */
export type GroupedNavigationItems = Record<string, SubCategoryMap>;

/**
 * 分类树结构 (一级分类 -> 子分类数组)
 */
export type CategoryTree = Record<string, string[]>;

/**
 * 导出格式支持
 */
export type ExportFormat = 'json' | 'csv' | 'html';

/**
 * 批量导入进度状态
 */
export interface BatchImportProgress {
  current: number;
  total: number;
  success: number;
  failed: number;
  skipped: number;
}

