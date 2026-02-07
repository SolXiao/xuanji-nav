import { NAV_TAXONOMY } from './constants';

/**
 * 根据标题和描述建议分类和子分类
 */
export const suggestCategory = (title: string, description: string) => {
  const text = (title + ' ' + description).toLowerCase();

  for (const [mainCat, config] of Object.entries(NAV_TAXONOMY)) {
    if (config.mainKeywords.some(k => text.includes(k))) {
      let subCat = '';
      for (const [sub, subKeywords] of Object.entries(config.subs)) {
        if (subKeywords.some(sk => text.includes(sk))) {
          subCat = sub;
          break;
        }
      }
      return { category: mainCat, subCategory: subCat };
    }
  }

  return { category: 'Uncategorized', subCategory: '' };
};
