export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category: string;
  subCategory?: string; // 二级分类
  description?: string;
}
