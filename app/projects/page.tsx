import type { Metadata } from "next";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects · Siyo",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto space-y-12">
      <header className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-6 px-2.5 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 text-[11px] font-medium uppercase tracking-wider flex items-center">
              Projects
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg-1">
            Selected Work
          </h1>
          <p className="text-base text-muted leading-relaxed">
            A collection of product work and small experiments. More details
            live in the Blog.
          </p>
        </div>
      </header>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="group relative -mx-4 px-4 py-5 rounded-xl transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/[0.02]"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 className="text-base font-medium text-fg-1 group-hover:text-fg-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px] text-soft font-medium uppercase tracking-wider shrink-0">
                  <span>{project.year}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-soft font-medium uppercase tracking-wider">
                  {project.role}
                </span>
                <div className="w-0.5 h-0.5 rounded-full bg-border-strong" />
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] text-soft group-hover:text-muted transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
