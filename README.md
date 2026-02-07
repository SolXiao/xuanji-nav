# 璇玑导航 (XuanJi Navigator)

> 🪐 基于 Notion 的现代化智能导航网站 · 如北斗指引，一键直达

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ 功能特性

### 核心功能
- 🔄 **Notion 集成** - 通过官方 API 实现导航数据的远程同步与写入
- 📊 **双层分类体系** - 支持"主分类-子分类"的层级结构,侧边栏具备展开/收起联动
- 🤖 **智能推断系统** - 添加新站时,依据内置 Taxonomy 库自动建议最匹配的分类
- 🔍 **智能搜索** - 支持本地导航搜索和多引擎全网搜索切换
- 🌐 **国际化支持** - 基于 next-intl 的完整中英文支持

### 交互体验
- ✨ **沉浸式动效** - `requestAnimationFrame` 优化的鼠标追踪发光效果
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代化 UI** - 渐变色彩、毛玻璃效果、平滑动画
- 🚀 **快捷键支持** - `/` 快速聚焦搜索框,`Tab` 切换搜索引擎,`Esc` 清除搜索

### 技术亮点
- 📦 **高内聚架构** - 抽离 `useNavigationData` 逻辑钩子与静态配置
- ⚡ **性能优化** - 动效性能优化,减少资源占用
- 🎯 **类型安全** - 完整的 TypeScript 类型定义

## 🚀 快速开始

### 环境要求
- Node.js 18.17 或更高版本
- npm / yarn / pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境变量配置

在项目根目录创建 `.env.local` 文件,添加以下配置:

```env
# Notion API 配置
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

**获取 Notion 配置:**
1. 访问 [Notion Integrations](https://www.notion.so/my-integrations) 创建集成
2. 复制 Internal Integration Token 作为 `NOTION_API_KEY`
3. 在 Notion 中创建数据库,并将集成添加到数据库
4. 从数据库 URL 中提取 Database ID 作为 `NOTION_DATABASE_ID`

**Notion 数据库结构:**
数据库需要包含以下属性:
- `Name` (title) - 导航项名称
- `URL` (url) - 链接地址
- `Description` (rich_text) - 描述
- `Category` (select) - 主分类
- `SubCategory` (rich_text) - 子分类
- `Icon` (url) - 图标 URL

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
xuanji-nav/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # 国际化路由
│   │   │   ├── layout.tsx     # 本地化布局
│   │   │   └── page.tsx       # 主页
│   │   ├── api/               # API 路由
│   │   │   ├── add-item/      # 添加导航项
│   │   │   └── metadata/      # 获取网站元数据
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── AddItemButton.tsx  # 添加导航按钮
│   │   ├── BackToTop.tsx      # 返回顶部
│   │   ├── CategorySection.tsx # 分类区块
│   │   ├── Footer.tsx         # 页脚
│   │   ├── Navbar.tsx         # 导航栏
│   │   ├── NavigationCard.tsx # 导航卡片
│   │   ├── NavigationSidebar.tsx # 侧边栏
│   │   ├── SearchableNavigation.tsx # 搜索导航
│   │   └── SearchEngineMatrix.tsx # 搜索引擎矩阵
│   ├── hooks/                 # 自定义 Hooks
│   │   └── useNavigationData.ts # 导航数据逻辑
│   ├── i18n/                  # 国际化配置
│   │   ├── routing.ts         # 路由配置
│   │   └── request.ts         # 请求配置
│   ├── lib/                   # 工具库
│   │   ├── constants.ts       # 常量定义
│   │   ├── nav-utils.ts       # 导航工具函数
│   │   └── notion.ts          # Notion API 封装
│   └── types/                 # TypeScript 类型定义
│       └── nav.ts             # 导航类型
├── messages/                  # 国际化翻译文件
│   ├── zh.json               # 中文翻译
│   └── en.json               # 英文翻译
├── contexts/                  # 项目上下文文档
│   └── context.md            # 项目核心上下文
└── public/                    # 静态资源
```

## 🎯 使用指南

### 搜索功能
- **本地搜索**: 直接输入关键词搜索本地导航
- **引擎搜索**: 使用前缀激活搜索引擎
  - `gg` - Google
  - `gh` - GitHub
  - `so` - Stack Overflow
  - 更多引擎见搜索框下方快捷栏
- **快捷键**:
  - `/` - 快速聚焦搜索框
  - `Tab` - 切换搜索引擎
  - `Enter` - 执行搜索
  - `Esc` - 清除搜索/失焦

### 添加导航
1. 点击右侧悬浮的"添加星标"按钮
2. 输入网站 URL
3. 系统自动获取网站元数据并智能分类
4. 确认或修改信息后提交
5. 数据将自动同步到 Notion 数据库

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI 库**: [React 19](https://react.dev/)
- **语言**: [TypeScript 5](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **国际化**: [next-intl](https://next-intl-docs.vercel.app/)
- **数据源**: [Notion API](https://developers.notion.com/)
- **UI 组件**: [Sonner](https://sonner.emilkowal.ski/) (Toast 通知)
- **加载指示**: [NextTopLoader](https://www.npmjs.com/package/nextjs-toploader)

## 📝 开发说明

### 代码规范
- 所有代码注释使用中文
- 遵循 ESLint 和 TypeScript 规则
- 组件采用函数式组件 + Hooks
- 使用 CSS 变量管理主题色彩

### 提交规范
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢以下开源项目:
- [Next.js](https://nextjs.org/)
- [Notion API](https://developers.notion.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-intl](https://next-intl-docs.vercel.app/)

---

<div align="center">
  <p>如北斗指引 · 一键直达</p>
  <p>Made with ❤️ by XuanJi Team</p>
</div>
