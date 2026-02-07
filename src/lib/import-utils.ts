import { NavigationItem } from '@/types/nav';

/**
 * 触发文件下载
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 验证和清理导入的数据
 */
export function validateNavigationItems(items: any[]): NavigationItem[] {
  if (!Array.isArray(items)) {
    throw new Error('数据格式错误：必须是数组');
  }

  return items.map((item, index) => {
    if (!item.title || !item.url || !item.category) {
      throw new Error(`第 ${index + 1} 条数据缺少必填字段 (title, url, category)`);
    }

    return {
      id: item.id || `imported-${Date.now()}-${index}`,
      title: String(item.title),
      url: String(item.url),
      category: String(item.category),
      subCategory: item.subCategory ? String(item.subCategory) : undefined,
      description: item.description ? String(item.description) : undefined,
      icon: item.icon ? String(item.icon) : undefined,
    };
  });
}

// ==================== JSON 格式 ====================

/**
 * 导出为 JSON 格式
 */
export function exportToJSON(items: NavigationItem[]): void {
  const content = JSON.stringify(items, null, 2);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  downloadFile(content, `xuanji-nav-${timestamp}.json`, 'application/json');
}

/**
 * 从 JSON 文件导入
 */
export async function importFromJSON(file: File): Promise<NavigationItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const validatedItems = validateNavigationItems(data);
        resolve(validatedItems);
      } catch (error) {
        reject(new Error(`JSON 解析失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

// ==================== CSV 格式 ====================

/**
 * 导出为 CSV 格式
 */
export function exportToCSV(items: NavigationItem[]): void {
  // CSV 表头
  const headers = ['ID', 'Title', 'URL', 'Category', 'SubCategory', 'Description', 'Icon'];

  // 转义 CSV 字段（处理逗号、引号、换行符）
  const escapeCSV = (value: string | undefined): string => {
    if (!value) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // 生成 CSV 内容
  const rows = items.map(item => [
    escapeCSV(item.id),
    escapeCSV(item.title),
    escapeCSV(item.url),
    escapeCSV(item.category),
    escapeCSV(item.subCategory),
    escapeCSV(item.description),
    escapeCSV(item.icon),
  ].join(','));

  const content = [headers.join(','), ...rows].join('\n');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

  // 添加 BOM 以支持 Excel 正确显示中文
  const bom = '\uFEFF';
  downloadFile(bom + content, `xuanji-nav-${timestamp}.csv`, 'text/csv;charset=utf-8');
}

/**
 * 从 CSV 文件导入
 */
export async function importFromCSV(file: File): Promise<NavigationItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV 文件为空或格式错误');
        }

        // 解析 CSV 行（处理引号包裹的字段）
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
              if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // 跳过下一个引号
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };

        // 跳过表头，解析数据行
        const items = lines.slice(1).map((line, index) => {
          const fields = parseCSVLine(line);

          if (fields.length < 3) {
            throw new Error(`第 ${index + 2} 行数据不完整`);
          }

          return {
            id: fields[0] || `imported-${Date.now()}-${index}`,
            title: fields[1],
            url: fields[2],
            category: fields[3],
            subCategory: fields[4] || undefined,
            description: fields[5] || undefined,
            icon: fields[6] || undefined,
          };
        });

        const validatedItems = validateNavigationItems(items);
        resolve(validatedItems);
      } catch (error) {
        reject(new Error(`CSV 解析失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

// ==================== HTML 书签格式 ====================

/**
 * 导出为 HTML 书签格式
 */
export function exportToHTML(items: NavigationItem[]): void {
  // 按分类分组
  const categorized = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  // 生成 HTML 书签结构
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>璇玑导航 - 书签</TITLE>
<H1>璇玑导航</H1>
<DL><p>
`;

  Object.entries(categorized).forEach(([category, categoryItems]) => {
    html += `    <DT><H3>${escapeHTML(category)}</H3>\n`;
    html += `    <DL><p>\n`;

    categoryItems.forEach(item => {
      const title = escapeHTML(item.title);
      const url = escapeHTML(item.url);
      const icon = item.icon || '';

      html += `        <DT><A HREF="${url}"${icon ? ` ICON="${escapeHTML(icon)}"` : ''}>${title}</A>\n`;
    });

    html += `    </DL><p>\n`;
  });

  html += `</DL><p>\n`;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  downloadFile(html, `xuanji-nav-${timestamp}.html`, 'text/html;charset=utf-8');
}

/**
 * 从 HTML 书签文件导入
 */
export async function importFromHTML(file: File): Promise<NavigationItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        console.log('📖 开始解析HTML书签文件，文件大小:', content.length, '字符');

        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        const items: NavigationItem[] = [];
        let folderCount = 0;

        // 递归处理书签节点
        const processNode = (node: Element, parentCategory: string = '未分类', depth: number = 0) => {
          const children = Array.from(node.children);
          let currentCategory = parentCategory;
          const indent = '  '.repeat(depth);

          console.log(`${indent}🔍 处理节点: ${node.tagName}, 子节点数: ${children.length}`);

          for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child.tagName === 'DT') {
              // 检查是否是文件夹（包含 H3 标签）
              const h3 = child.querySelector('H3');
              if (h3) {
                // 这是一个文件夹，更新当前分类
                currentCategory = h3.textContent?.trim() || '未分类';
                folderCount++;
                console.log(`${indent}📁 发现文件夹 #${folderCount}: "${currentCategory}"`);

                // 查找包含书签的 DL 节点，可能在：
                // 1. 当前 DT 内部的 DL
                // 2. 下一个兄弟节点是 DL
                let folderDL = child.querySelector('DL');

                if (!folderDL) {
                  let nextSibling = children[i + 1];
                  if (nextSibling && nextSibling.tagName === 'DL') {
                    folderDL = nextSibling;
                  }
                }

                if (folderDL) {
                  console.log(`${indent}  ↳ 找到DL节点，递归处理...`);
                  processNode(folderDL, currentCategory, depth + 1);
                } else {
                  console.warn(`${indent}  ⚠️ 未找到DL节点`);
                }
              } else {
                // 检查是否是书签（包含 A 标签）
                const a = child.querySelector('A');
                if (a) {
                  const url = a.getAttribute('HREF') || '';
                  const title = a.textContent?.trim() || '';
                  const icon = a.getAttribute('ICON') || undefined;

                  if (url && title) {
                    items.push({
                      id: `imported-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 9)}`,
                      title,
                      url,
                      category: currentCategory,
                      icon,
                    });
                    console.log(`${indent}  ✓ 书签 #${items.length}: "${title}" (${currentCategory})`);
                  } else {
                    console.warn(`${indent}  ⚠️ 跳过无效书签: url=${url}, title=${title}`);
                  }
                }
              }
            } else if (child.tagName === 'DL') {
              // 直接是 DL 标签，继续递归处理
              console.log(`${indent}  📂 发现嵌套DL，继续处理...`);
              processNode(child, currentCategory, depth + 1);
            }
          }
        };

        // 从根 DL 开始处理
        const rootDL = doc.querySelector('DL');
        if (rootDL) {
          console.log('🌲 从根DL节点开始解析...');
          processNode(rootDL, '未分类', 0);
        } else {
          console.error('❌ 未找到根DL节点');
        }

        console.log(`\n📊 解析完成统计:`);
        console.log(`  - 总书签数: ${items.length}`);
        console.log(`  - 文件夹数: ${folderCount}`);
        console.log(`  - 分类分布:`, items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>));

        if (items.length === 0) {
          throw new Error('未找到有效的书签数据');
        }

        const validatedItems = validateNavigationItems(items);
        resolve(validatedItems);
      } catch (error) {
        console.error('❌ HTML解析失败:', error);
        reject(new Error(`HTML 解析失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

/**
 * HTML 转义
 */
function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== 格式检测 ====================

/**
 * 检测文件格式
 */
export function detectFileFormat(file: File): 'json' | 'csv' | 'html' | 'unknown' {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'json':
      return 'json';
    case 'csv':
      return 'csv';
    case 'html':
    case 'htm':
      return 'html';
    default:
      return 'unknown';
  }
}

/**
 * 根据格式导入文件
 */
export async function importFile(file: File): Promise<NavigationItem[]> {
  const format = detectFileFormat(file);

  switch (format) {
    case 'json':
      return importFromJSON(file);
    case 'csv':
      return importFromCSV(file);
    case 'html':
      return importFromHTML(file);
    default:
      throw new Error('不支持的文件格式，请上传 JSON、CSV 或 HTML 文件');
  }
}
