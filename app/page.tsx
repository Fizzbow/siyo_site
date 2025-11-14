import Link from "next/link";
import { projects } from "@/data/projects";
import { TextEffect } from "@/components/core/text-scramble";
import { FadeIn } from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <FadeIn
        as="section"
        className="surface-card p-7 lg:p-8 flex flex-col justify-between"
      >
        <div className="space-y-8">
          <div className="badge">
            <span className="badge-dot" />
            <span>Creative coding · Frontend · UI/UX</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                Siyo
              </h1>
              <span className="pill text-xs text-soft">
                Turning small ideas into thoughtful, polished interfaces.
              </span>
            </div>

            <TextScramble
              as="p"
              text="A frontend developer who enjoys motion, design systems, and the tension between code and visual storytelling."
              className="text-sm leading-relaxed text-slate-600 max-w-xl"
              durationMs={900}
              speedMs={42}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Focus",
              body: "Creative coding, front-end engineering, and interaction-heavy products.",
            },
            {
              title: "Currently",
              body: "Exploring small tools and motion experiments that make everyday flows feel smoother.",
            },
            {
              title: "Open to",
              body: "Collaborations on side projects, design systems, and product interfaces.",
            },
          ].map((card, index) => (
            <FadeIn
              key={card.title}
              as="div"
              delay={0.18 + index * 0.12}
              className="surface-muted p-4 flex flex-col gap-2"
            >
              <span className="text-xs text-slate-500 uppercase tracking-[0.18em]">
                {card.title}
              </span>
              <p className="text-sm text-slate-600">{card.body}</p>
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <FadeIn as="section" delay={0.3} className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Projects
            </span>
            <h2 className="text-base font-medium text-slate-900">
              Recent things I&apos;ve been working on
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline transition-colors"
          >
            View all
          </Link>
        </header>

        <div className="flex-1 surface-muted p-4 overflow-hidden">
          <ul className="space-y-3">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <FadeIn
                  as="div"
                  delay={0.35 + index * 0.06}
                  className="group rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-slate-50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {project.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {project.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-400">
                      {project.year}
                    </span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {project.techStack.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-slate-500">
          <span className="text-slate-600">Tip</span>: I write more detailed
          breakdowns and design notes in{" "}
          <Link
            href="/blog"
            className="underline underline-offset-4 hover:text-slate-900 transition-colors"
          >
            Blog
          </Link>
          .
        </div>
      </FadeIn>
    </div>
  );
}
