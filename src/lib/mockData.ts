import { NavigationItem } from '@/types/nav';

export const MOCK_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'mock-1',
    title: 'Google',
    url: 'https://google.com',
    category: 'Search',
    description: 'The world\'s most popular search engine.',
    icon: '🔍',
  },
  {
    id: 'mock-2',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    description: 'Where the world builds software.',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
  },
  {
    id: 'mock-3',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'AI',
    description: 'AI chatbot by OpenAI.',
    icon: '🤖',
  },
  {
    id: 'mock-4',
    title: 'Bilibili',
    url: 'https://www.bilibili.com',
    category: 'Entertainment',
    description: 'Chinese video sharing website.',
    icon: '📺',
  },
    {
    id: 'mock-5',
    title: 'Notion',
    url: 'https://www.notion.so',
    category: 'Productivity',
    description: 'All-in-one workspace.',
    icon: '📝',
  },
];
