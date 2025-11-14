export type ProjectCategory = "product" | "exploration" | "open-source";

export interface Project {
  slug: string;
  title: string;
  description: string;
  role: string;
  year: string;
  category: ProjectCategory;
  techStack: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    slug: "creative-dashboard",
    title: "Creative Dashboard for Independent Makers",
    description:
      "一套为独立开发者设计的工作台界面，用于管理 roadmap、实验项目和日常工作的轻量化工具。",
    role: "Design & Frontend",
    year: "2024",
    category: "product",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "#",
  },
  {
    slug: "motion-playground",
    title: "Motion Playground",
    description:
      "围绕滚动、鼠标和文本交互构建的一组动效实验，探索如何用细腻的 micro-interaction 让界面变得更有温度。",
    role: "Creative Coding",
    year: "2023",
    category: "exploration",
    techStack: ["Canvas", "GSAP"],
  },
  {
    slug: "typed-ui-kit",
    title: "Typed UI Kit",
    description:
      "一个面向中小团队的 TypeScript 组件库，提供设计一致、可定制的基础组件，并内置暗色模式和响应式布局。",
    role: "Design System",
    year: "2023",
    category: "open-source",
    techStack: ["React", "Storybook"],
    link: "#",
  },
];


