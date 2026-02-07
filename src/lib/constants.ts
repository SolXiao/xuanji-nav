/**
 * 分类图标映射
 */
export const CATEGORY_ICONS: Record<string, string> = {
  'AI': '🤖',
  'AI & GPT': '🧠',
  'Development': '💻',
  'Design': '🎨',
  'Tools': '🛠️',
  'Productivity': '⚡',
  'Resources': '📚',
  'Entertainment': '🎮',
  'Media': '🎬',
  'Social': '💬',
  'Crypto': '💰',
  'Other': '📦',
  'Search': '🔍',
  'Uncategorized': '🏷️'
};

/**
 * 智能分类建议库 (Taxonomy)
 */
export const NAV_TAXONOMY: Record<string, { subs: Record<string, string[]>, mainKeywords: string[] }> = {
  'AI & GPT': {
    mainKeywords: ['ai', 'gpt', 'llm', 'chatgpt', 'claude', 'deepseek', 'artificial intelligence', 'bot', '大模型', '智能', '推理'],
    subs: {
      'Chat': ['chat', '对话', '问答'],
      'Image': ['image', 'midjourney', 'stable diffusion', 'dalle', '绘图', '图片', '生成器'],
      'Agent': ['agent', 'workflow', 'automation', '工具链'],
      'Tools': ['tool', 'helper', '插件']
    }
  },
  'Development': {
    mainKeywords: ['code', 'git', 'dev', 'api', 'sdk', 'framework', 'library', 'editor', 'vscode', 'docker', 'linux', '开发', '编程', '代码', '仓库'],
    subs: {
      'Frontend': ['react', 'vue', 'nextjs', 'tailwind', 'css', 'frontend', '前端', 'typescript'],
      'Backend': ['node', 'python', 'java', 'go', 'rust', 'database', 'sql', 'backend', '后端', 'api'],
      'Tools': ['tool', 'debug', 'test', 'deploy', 'github', '工具', '辅助']
    }
  },
  'Design': {
    mainKeywords: ['design', 'ui', 'ux', 'color', 'icon', 'svg', 'figma', 'dribbble', 'behance', 'font', '设计', '配色', '图标', '字体'],
    subs: {
      'Inspiration': ['inspiration', 'showcase', 'gallery', '灵感', '参考'],
      'Assets': ['asset', 'resource', 'freebie', 'template', '素材', '模板', '图片'],
      'Tools': ['editor', 'create', 'layout', '工具']
    }
  },
  'Tools': {
    mainKeywords: ['tool', 'convert', 'pdf', 'image', 'generator', 'speedtest', 'proxy', 'terminal', '工具', '助手', '转换', '在线', '加密', '效率'],
    subs: {
      'Efficiency': ['efficiency', 'productivity', 'note', 'time', '效率', '笔记', '番茄钟'],
      'Web': ['browser', 'extension', 'search', '网页'],
      'DevOps': ['server', 'cloud', 'host', 'vps', '运维']
    }
  },
  'Resources': {
    mainKeywords: ['learn', 'tutorial', 'doc', 'course', 'blog', 'news', 'article', 'wiki', 'paper', 'resource', '资源', '教程', '文档', '博客'],
    subs: {
      'Doc': ['documentation', 'api', 'manual', '文档'],
      'Blog': ['article', 'post', 'news', '博客'],
      'Course': ['video', 'learning', 'class', '课程']
    }
  }
};

/**
 * 25+ 搜索引擎矩阵
 */
export interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: string;
  prefix?: string;
}

export const SEARCH_ENGINES: SearchEngine[] = [
  // General
  { id: 'google', name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=', category: 'General', prefix: 'g' },
  { id: 'baidu', name: '百度', icon: '🐾', url: 'https://www.baidu.com/s?wd=', category: 'General', prefix: 'bd' },
  { id: 'bing', name: 'Bing', icon: '🦋', url: 'https://www.bing.com/search?q=', category: 'General', prefix: 'b' },
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆', url: 'https://duckduckgo.com/?q=', category: 'General', prefix: 'd' },

  // Tech & Dev
  { id: 'github', name: 'GitHub', icon: '🐙', url: 'https://github.com/search?q=', category: 'Tech', prefix: 'gh' },
  { id: 'stackoverflow', name: 'StackOverflow', icon: '🥞', url: 'https://stackoverflow.com/search?q=', category: 'Tech', prefix: 'so' },
  { id: 'mdn', name: 'MDN Web Docs', icon: '🦊', url: 'https://developer.mozilla.org/zh-CN/search?q=', category: 'Tech', prefix: 'mdn' },
  { id: 'npm', name: 'npm', icon: '📦', url: 'https://www.npmjs.com/search?q=', category: 'Tech', prefix: 'npm' },
  { id: 'pypi', name: 'PyPI', icon: '🐍', url: 'https://pypi.org/search/?q=', category: 'Tech', prefix: 'py' },
  { id: 'dockerhub', name: 'Docker Hub', icon: '🐳', url: 'https://hub.docker.com/search?q=', category: 'Tech', prefix: 'dk' },

  // Community & Social
  { id: 'v2ex', name: 'V2EX', icon: '⚡', url: 'https://www.v2ex.com/search?q=', category: 'Community', prefix: 'v' },
  { id: 'reddit', name: 'Reddit', icon: '👽', url: 'https://www.reddit.com/search/?q=', category: 'Community', prefix: 'rd' },
  { id: 'juejin', name: '稀土掘金', icon: '💎', url: 'https://juejin.cn/search?query=', category: 'Community', prefix: 'jj' },
  { id: 'zhihu', name: '知乎', icon: '🌀', url: 'https://www.zhihu.com/search?type=content&q=', category: 'Community', prefix: 'zh' },
  { id: 'weibo', name: '微博', icon: '👁️', url: 'https://s.weibo.com/weibo?q=', category: 'Community', prefix: 'wb' },

  // Media
  { id: 'bilibili', name: 'Bilibili', icon: '📺', url: 'https://search.bilibili.com/all?keyword=', category: 'Media', prefix: 'bi' },
  { id: 'youtube', name: 'YouTube', icon: '🎬', url: 'https://www.youtube.com/results?search_query=', category: 'Media', prefix: 'yt' },
  { id: 'deepl', name: 'DeepL Translate', icon: '🌐', url: 'https://www.deepl.com/translator#any/any/', category: 'Media', prefix: 'tl' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', url: 'https://www.xiaohongshu.com/search_result?keyword=', category: 'Media', prefix: 'xhs' },

  // Academic & Resources
  { id: 'arxiv', name: 'arXiv', icon: '📓', url: 'https://arxiv.org/search/?query=', category: 'Academic', prefix: 'ax' },
  { id: 'googlescholar', name: 'Google Scholar', icon: '🎓', url: 'https://scholar.google.com/scholar?q=', category: 'Academic', prefix: 'gs' },
  { id: 'wikipedia', name: 'Wikipedia', icon: '📖', url: 'https://zh.wikipedia.org/wiki/Special:Search?search=', category: 'Academic', prefix: 'wk' },
  { id: 'libgen', name: 'LibGen', icon: '📚', url: 'https://libgen.is/search.php?req=', category: 'Academic', prefix: 'lg' },

  // Design
  { id: 'figma', name: 'Figma Community', icon: '🎨', url: 'https://www.figma.com/community/search?resource_type=mixed&sort_by=popular&query=', category: 'Design', prefix: 'fg' },
  { id: 'dribbble', name: 'Dribbble', icon: '🏀', url: 'https://dribbble.com/search/', category: 'Design', prefix: 'dr' },
  { id: 'behance', name: 'Behance', icon: '🅱️', url: 'https://www.behance.net/search/projects?search=', category: 'Design', prefix: 'bh' },
];
