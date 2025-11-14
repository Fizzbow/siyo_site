export type BlogCategory = "tech" | "product" | "note";

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  category: BlogCategory;
  tags: string[];
  summary: string;
  content: string;
}

const baseIntro = `
欢迎来到我的个人笔记，这里记录了我在前端、动效和产品设计上的一些思考。

> 这些文章更像是「工作日志」而不是最终结论。希望它们能给你带来一点灵感，或者至少是一个思考的起点。
`;

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-smooth-loading-experience",
    title: "设计一个顺滑的页面载入体验",
    publishedAt: "2024-03-06",
    category: "product",
    tags: ["experience", "motion", "ui"],
    summary:
      "从 Linear 等产品中拆解页面切换时「向上渐显」的体验细节，并在 Next.js 中实现一个可复用的过渡方案。",
    content: `${baseIntro}

## 为什么载入动画很重要

人眼对**动效的一致性**非常敏感。页面切换时的过渡动画不仅是好看，更是信息层级的提示：

- 当前页面已经结束
- 新的上下文正在被构建
- 交互依然在「我」的掌控之中

## 一个简单可复用的方案

在这个站点里，我选择用 CSS 做一个轻量的过渡：

- 使用 \`keyframes\` 控制 opacity + translateY
- 在布局里通过 \`key={pathname}\` 强制触发动画
- 整体时长控制在 400ms 左右，避免显得拖沓

未来会考虑用更强大的工具（例如 Framer Motion）做更复杂的场景，但目前这个方案足够轻量且稳定。
`,
  },
  {
    slug: "notes-on-building-a-personal-site",
    title: "打造一个舒服的个人网站：从 Linear 偷师",
    publishedAt: "2024-02-18",
    category: "tech",
    tags: ["nextjs", "design", "personal-site"],
    summary:
      "记录这个个人站点从零到一的过程：信息架构、交互细节，以及如何用极少的元素做出清爽的界面。",
    content: `${baseIntro}

## 信息架构：先想清楚「入口」

对个人网站来说，我更关心这些问题：

1. 别人进入首页第一眼能不能认出我是谁？
2. 能不能迅速找到 Blog、项目和联系方式？
3. 动效是否是「辅助」而不是干扰？

## 设计语言：向 Linear 学什么

我从 Linear 身上借了几件东西：

- 暗色基底 + 柔和光影
- 简单但明确的层级结构
- 几乎所有东西都有一点点 micro-interaction

这些特性让界面在保持冷静的同时，又不会显得死板。
`,
  },
  {
    slug: "small-components-for-rich-articles",
    title: "从小组件开始，让文章更「立体」",
    publishedAt: "2024-01-10",
    category: "note",
    tags: ["components", "writing", "ux"],
    summary:
      "文章不一定只有文字。通过引入 Tag、Callout 等组件，可以让信息结构更清晰，也更有节奏感。",
    content: `${baseIntro}

## 先从 Tag 开始

本页使用的 Tag 组件非常简单：

1. 提供 \`variant\` 区分强调程度
2. 保持尺寸小而克制
3. 在暗色背景上依然保持足够的对比度

后面会逐步加入更多内容组件，例如 Callout、时间轴和代码块高亮等。
`,
  },
];
