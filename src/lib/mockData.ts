import { NavigationItem } from '@/types/nav';

export const MOCK_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'mock-1',
    title: 'Google',
    url: 'https://google.com',
    category: '搜索',
    description: '全球最受欢迎的搜索引擎。',
    icon: '🔍',
  },
  {
    id: 'mock-2',
    title: 'GitHub',
    url: 'https://github.com',
    category: '开发',
    description: '全球最大的软件开发平台。',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
  },
  {
    id: 'mock-3',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'AI',
    description: 'OpenAI 开发的智能聊天机器人。',
    icon: '🤖',
  },
  {
    id: 'mock-4',
    title: 'Bilibili',
    url: 'https://www.bilibili.com',
    category: '娱乐',
    description: '国内知名的视频弹幕网站。',
    icon: '📺',
  },
  {
    id: 'mock-5',
    title: 'Notion',
    url: 'https://www.notion.so',
    category: '效率',
    description: '全能的数字化笔记与协作空间。',
    icon: '📝',
  },
];
