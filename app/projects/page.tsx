import type { Metadata } from "next";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects · Siyo",
};

export default function ProjectsPage() {
  return (
    <div className="surface-card p-6 space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="badge">
            <span className="badge-dot" />
            <span>Selected work</span>
          </div>
          <div>
            <h1 className="text-lg font-medium text-neutral-900">Projects</h1>
            <p className="text-sm text-muted">
              A collection of product work and small experiments. More details
              live in the Blog.
            </p>
          </div>
        </div>
      </header>

      <ul className="space-y-3">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="surface-muted p-4 rounded-2xl flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-[color:var(--foreground)]">
                  {project.title}
                </h2>
                <p className="mt-1 text-xs text-muted">{project.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-[11px] text-soft">
                <span>{project.year}</span>
                <span>{project.role}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-soft">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-full bg-[rgba(15,23,42,0.92)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
