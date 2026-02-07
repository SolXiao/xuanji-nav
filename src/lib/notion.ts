import { Client } from '@notionhq/client';
import { NavigationItem } from '@/types/nav';

const notion = new Client({
  auth: process.env.NOTION_API_KEY, // 修正环境变量名以匹配 README
});

export const getDatabase = async (): Promise<NavigationItem[]> => {
  // 检查模拟数据模式
  if (process.env.USE_MOCK_DATA === 'true') {
    const { MOCK_NAVIGATION_ITEMS } = await import('./mockData');
    return MOCK_NAVIGATION_ITEMS;
  }

  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    console.error('NOTION_DATABASE_ID is not defined');
    return [];
  }

  let response;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await notion.databases.query({
        database_id: databaseId,
      });
      break;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.warn(`第 ${attempt}/${maxRetries} 次获取 Notion 数据库失败:`, errorMessage);
      if (attempt === maxRetries) {
        const { MOCK_NAVIGATION_ITEMS } = await import('./mockData');
        return MOCK_NAVIGATION_ITEMS;
      }
      // 重试前等待 (1s, 2s...)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  // 如果所有重试都失败且没有返回 mock 数据
  if (!response) {
    console.warn('Failed to fetch from Notion after retries, returning empty array.');
    // 再次尝试返回 Mock 数据作为最后的兜底
    try {
      const { MOCK_NAVIGATION_ITEMS } = await import('./mockData');
      return MOCK_NAVIGATION_ITEMS;
    } catch (e) {
      return [];
    }
  }

  try {
    const items = response.results.map((page: any) => {
      const props = page.properties;

      // 属性安全性检查
      // 假设标准名称：Name, URL, Category, Description
      // 根据实际数据库结构调整这些名称

      const title = props.Name?.title?.[0]?.plain_text ||
        props.Title?.title?.[0]?.plain_text ||
        '未命名';

      const url = props.URL?.url ||
        props.Link?.url ||
        '#';

      const category = props.Category?.select?.name ||
        props.Tags?.multi_select?.[0]?.name ||
        '未分类';

      const subCategory = props.SubCategory?.select?.name || undefined;

      const description = props.Description?.rich_text?.[0]?.plain_text || '';

      // 处理图标
      let icon = '';
      if (page.icon?.type === 'emoji') {
        icon = page.icon.emoji;
      } else if (page.icon?.type === 'file') {
        icon = page.icon.file.url;
      } else if (page.icon?.type === 'external') {
        icon = page.icon.external.url;
      }

      return {
        id: page.id,
        title,
        url,
        category,
        subCategory,
        description,
        icon,
      };
    });

    return items;
  } catch (error) {
    console.error('Failed to parse Notion response:', error);
    return [];
  }
};

export const addItem = async (item: Omit<NavigationItem, 'id'>) => {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }

  // 校验 Icon URL：必须是有效的 http/https 链接
  let iconObj: any = undefined;
  if (item.icon && (item.icon.startsWith('http://') || item.icon.startsWith('https://'))) {
    iconObj = {
      type: 'external',
      external: { url: item.icon }
    };
  }

  const properties: any = {
    Name: {
      title: [
        {
          text: {
            content: item.title,
          },
        },
      ],
    },
    URL: {
      url: item.url,
    },
    Category: {
      select: {
        name: item.category,
      },
    },
    Description: {
      rich_text: [
        {
          text: {
            content: item.description || '',
          },
        },
      ],
    },
  };

  if (item.subCategory) {
    properties.SubCategory = {
      select: {
        name: item.subCategory,
      },
    };
  }

  const maxRetries = 3;
  let lastError: any;

  // 重试逻辑应对网络波动 (ECONNRESET)
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        icon: iconObj,
        properties: properties,
      });
      return response;
    } catch (error: any) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed to create Notion page:`, error.message);
      lastError = error;

      // 如果是 Icon 错误，重试时移除 Icon
      if (error.message?.includes('icon') || error.code === 'validation_error') {
        iconObj = undefined;
        console.warn('Retrying without icon...');
        continue; // 立即重试，不带 icon
      }

      // 如果是网络错误，等待后重试
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  console.error('创建 Notion 页面最终失败:', lastError);
  throw lastError;
};

// 更新 Notion 数据库项
export const updateNotionItem = async (
  pageId: string,
  data: {
    title?: string;
    url?: string;
    description?: string;
    category?: string;
    icon?: string;
  }
): Promise<void> => {
  try {
    const properties: any = {};

    if (data.title !== undefined) {
      properties.Name = {
        title: [{ text: { content: data.title } }]
      };
    }

    if (data.url !== undefined) {
      properties.URL = {
        url: data.url
      };
    }

    if (data.description !== undefined) {
      properties.Description = {
        rich_text: [{ text: { content: data.description } }]
      };
    }

    if (data.category !== undefined) {
      properties.Category = {
        select: { name: data.category }
      };
    }

    if (data.icon !== undefined) {
      properties.Icon = {
        rich_text: [{ text: { content: data.icon } }]
      };
    }

    await notion.pages.update({
      page_id: pageId,
      properties
    });
  } catch (error) {
    console.error('Error updating Notion item:', error);
    throw error;
  }
};
