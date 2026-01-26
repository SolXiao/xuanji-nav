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
