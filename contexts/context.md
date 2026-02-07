# 璇玑导航 (XuanJi Navigator) 项目上下文

## 1. 项目概述
**璇玑导航**是基于 Notion 作为内容管理后台的现代化智能导航网站，取名自古代天文仪器"璇玑"。
- **核心理念**: 精准如璇玑，快速如星光，璀璨如星辰，灵动如星轨。
- **目标**: 提供美观、易用的星空主题导航界面，与 Notion 数据库无感同步。

## 2. 技术栈
- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **组件库**: Sonner (Toast), NextTopLoader
- **国际化**: next-intl
- **数据源**: Notion API

## 3. 项目结构 (目标)
```
xuanji-nav/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # 国际化路由
│   │   ├── api/               # API 路由
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── AddItemButton.tsx  # 添加导航按钮
│   │   ├── BackToTop.tsx      # 返回顶部
│   │   ├── CategorySection.tsx # 分类区块
│   │   ├── DateTimeWidget.tsx # 时间组件
│   │   ├── NavigationCard.tsx # 导航卡片
│   │   ├── NavigationSidebar.tsx # 侧边栏
│   │   ├── SearchBar.tsx      # 智能搜索框
│   │   ├── SearchEngineMatrix.tsx # 搜索引擎矩阵
│   │   └── StatsPanel.tsx     # 统计面板
│   ├── hooks/                 # 自定义 Hooks
│   │   └── useNavigationData.ts # 导航数据逻辑
│   ├── i18n/                  # 国际化配置
│   │   ├── routing.ts         # 路由配置
│   │   └── request.ts         # 请求配置
│   ├── lib/                   # 工具库
│   │   ├── constants.ts       # 常量定义
│   │   ├── nav-utils.ts       # 导航工具函数
│   │   ├── notion.ts          # Notion API 封装
│   │   └── time-utils.ts      # 时间工具函数
│   └── types/                 # TypeScript 类型定义
│       └── nav.ts             # 导航类型
├── messages/                  # 国际化翻译文件
└── public/                    # 静态资源
```

## 4. 核心功能
- **智能导航**: 双层分类，智能推断，多引擎搜索。
- **数据同步**: Notion 无缝集成，支持导入导出，浏览器扩展同步。
- **交互体验**: 沉浸式动效，响应式设计，快捷键系统。
- **时间智能**: 实时时钟，迷你日历，时间统计。

## 5. 开发规范
- **语言**: 中文 (注释/文档), 英文 (代码/变量).
- **Git**: feat/fix/docs/style/refactor/perf/test/chore.
- **样式**: Tailwind CSS, CSS Variables for Theme.
