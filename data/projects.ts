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
      "A studio-like workspace for independent developers to manage roadmaps, experiments, and everyday tasks in one focused view.",
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
      "A set of motion experiments around scroll, cursor and text interactions, exploring how small micro-interactions can make interfaces feel more human.",
    role: "Creative Coding",
    year: "2023",
    category: "exploration",
    techStack: ["Canvas", "GSAP"],
  },
  {
    slug: "typed-ui-kit",
    title: "Typed UI Kit",
    description:
      "A TypeScript-first component library for small teams, with consistent, customizable primitives and built‑in dark mode and responsive layouts.",
    role: "Design System",
    year: "2023",
    category: "open-source",
    techStack: ["React", "Storybook"],
    link: "#",
  },
];
