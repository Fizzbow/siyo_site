import React from "react";

export type ProjectCategory = "product" | "exploration" | "open-source";

export interface Project {
  slug: string;
  title: string;
  description: string;
  role: string;
  year: string;
  category: ProjectCategory;
  techStack: string[];
  link: string;
  icon?: React.ReactNode;
}

export const projects: Project[] = [
  {
    slug: "creative-dashboard",
    title: "Sodo",
    description:
      "A studio-like workspace for independent developers to manage roadmaps, experiments, and everyday tasks in one focused view.",
    role: "Design & Frontend",
    year: "2024",
    category: "product",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/Fizzbow/Sodo",
    icon: React.createElement(
      "svg",
      {
        width: "21",
        height: "21",
        viewBox: "0 0 21 21",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      React.createElement("path", {
        d: "M16.0781 0H4.92188C2.2036 0 0 2.2036 0 4.92188V16.0781C0 18.7964 2.2036 21 4.92188 21H16.0781C18.7964 21 21 18.7964 21 16.0781V4.92188C21 2.2036 18.7964 0 16.0781 0Z",
        fill: "#1a1a1a",
      }),
      React.createElement("path", {
        d: "M6.5 10.5L9 13L14.5 7.5",
        stroke: "white",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      })
    ),
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
    link: "#",
    icon: React.createElement(
      "svg",
      {
        width: "21",
        height: "21",
        viewBox: "0 0 21 21",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      React.createElement("path", {
        d: "M16.0781 0H4.92188C2.2036 0 0 2.2036 0 4.92188V16.0781C0 18.7964 2.2036 21 4.92188 21H16.0781C18.7964 21 21 18.7964 21 16.0781V4.92188C21 2.2036 18.7964 0 16.0781 0Z",
        fill: "#1a1a1a",
      }),
      React.createElement("path", {
        d: "M5 10.5C6 8 8.5 7 10.5 7.5C12.5 8 14.5 9.5 16 10.5",
        stroke: "white",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }),
      React.createElement("path", {
        d: "M5 13.5C6 11 8.5 10 10.5 10.5C12.5 11 14.5 12.5 16 13.5",
        stroke: "white",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      })
    ),
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
    icon: React.createElement(
      "svg",
      {
        width: "21",
        height: "21",
        viewBox: "0 0 21 21",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      React.createElement("path", {
        d: "M16.0781 0H4.92188C2.2036 0 0 2.2036 0 4.92188V16.0781C0 18.7964 2.2036 21 4.92188 21H16.0781C18.7964 21 21 18.7964 21 16.0781V4.92188C21 2.2036 18.7964 0 16.0781 0Z",
        fill: "#1a1a1a",
      }),
      React.createElement("rect", {
        x: "5",
        y: "6",
        width: "11",
        height: "2",
        rx: "0.5",
        fill: "white",
      }),
      React.createElement("rect", {
        x: "5",
        y: "10",
        width: "8",
        height: "2",
        rx: "0.5",
        fill: "white",
      }),
      React.createElement("rect", {
        x: "5",
        y: "14",
        width: "9",
        height: "2",
        rx: "0.5",
        fill: "white",
      })
    ),
  },
];
