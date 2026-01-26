import { Client } from '@notionhq/client';
import { NavigationItem } from '@/types/nav';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (): Promise<NavigationItem[]> => {
  // Check for Mock Data mode
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
    } catch (error: any) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed to fetch Notion database:`, error.message);
      if (attempt === maxRetries) {
        const { MOCK_NAVIGATION_ITEMS } = await import('./mockData');
        return MOCK_NAVIGATION_ITEMS;
      }
      // Wait before retrying (1s, 2s...)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  if (!response) return [];

  try {
    const items = response.results.map((page: any) => {
      const props = page.properties;

      // Safety checks for properties
      // Assuming standard names: Name, URL, Category, Description
      // Adjust these based on actual database structure

      const title = props.Name?.title?.[0]?.plain_text ||
        props.Title?.title?.[0]?.plain_text ||
        'Untitled';

      const url = props.URL?.url ||
        props.Link?.url ||
        '#';

      const category = props.Category?.select?.name ||
        props.Tags?.multi_select?.[0]?.name ||
        'Uncategorized';

      const subCategory = props.SubCategory?.select?.name || undefined;

      const description = props.Description?.rich_text?.[0]?.plain_text || '';

      // Handle icon
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

  try {
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

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      icon: item.icon ? {
        type: 'external',
        external: { url: item.icon }
      } : undefined,
      properties: properties,
    });
    return response;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};
