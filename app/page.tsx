import Link from "next/link";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextScramble } from "@/components/motion-primitives/text-scramble";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="space-y-8">
          <div className="badge">
            <span className="badge-dot" />
            <span>Creative coding · Frontend · UI/UX</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
                Siyo
              </h1>
              <span className="pill text-xs text-soft">
                Turning small ideas into thoughtful, polished interfaces.
              </span>
            </div>

            <TextScramble
              as="p"
              className="text-sm leading-relaxed text-neutral-600 max-w-xl"
            >
              A frontend developer who enjoys motion, design systems, and the
              tension between code and visual storytelling.
            </TextScramble>
          </div>
        </div>
      </section>

      <FadeIn as="section" delay={0.3} className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Projects
            </span>
            <h2 className="text-base font-medium text-neutral-900">
              Recent things I&apos;ve been working on
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs text-neutral-500 hover:text-[#007AFF] underline-offset-4 hover:underline transition-colors"
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
                  className="group rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-neutral-50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {project.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                        {project.role}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-neutral-400">
                      {project.year}
                    </span>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-neutral-500">
          <span className="text-neutral-600">Tip</span>: I write more detailed
          breakdowns and design notes in{" "}
          <Link
            href="/blog"
            className="underline underline-offset-4 hover:text-[#007AFF] transition-colors"
          >
            Blog
          </Link>
          .
        </div>
      </FadeIn>
    </div>
  );
}
