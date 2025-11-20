import Link from "next/link";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextScramble } from "@/components/motion-primitives/text-scramble";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg-1">
                Siyo
              </span>
            </div>

            <TextScramble
              as="p"
              className="text-sm leading-relaxed text-fg-3 max-w-xl"
            >
              A frontend developer who enjoys motion, design systems, and the
              tension between code and visual storytelling.
            </TextScramble>
          </div>
        </div>
      </section>

      <header className="flex items-center justify-between">
        <span className="uppercase text-xl sm:text-2xl font-semibold tracking-tight text-fg-1">
          Projects
        </span>

        <Link
          href="/projects"
          className="text-xs text-fg-4 hover:text-fg-primary underline-offset-4 hover:underline transition-colors"
        >
          View all
        </Link>
      </header>
      {/* <FadeIn as="section" delay={0.01} className="flex flex-col gap-10"> */}

      <ul className="space-y-3">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <FadeIn
              as="div"
              delay={0.1 + index * 0.001}
              className="group rounded-xl py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-neutral-50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg-1">
                    {project.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-fg-4">
                    {project.role}
                  </span>
                </div>
                <p className="text-xs text-fg-3 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-fg-4">{project.year}</span>
              </div>
            </FadeIn>
          </li>
        ))}
      </ul>

      <div className="text-xs text-fg-4">
        <span className="text-fg-3">Tip</span>: I write more detailed breakdowns
        and design notes in{" "}
        <Link
          href="/blog"
          className="underline underline-offset-4 hover:text-fg-primary transition-colors"
        >
          Blog
        </Link>
        .
      </div>
      {/* </FadeIn> */}
    </div>
  );
}
