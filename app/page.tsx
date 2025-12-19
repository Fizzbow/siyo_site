import Link from "next/link";
import { Project, projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextScramble } from "@/components/motion-primitives/text-scramble";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogPost } from "@/types/blog";

export default async function Home() {
  const blogPosts = await getAllBlogPosts();
  const sortedBlogs = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <main className="flex flex-col gap-6">
      <section className="space-y-2">
        <div className="flex flex-col items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-fg-1">
            Siyo
          </span>

          <span className="text-sm font-semibold leading-relaxed text-fg-1">
            I love work on: creative coding | frontend | UI/UX
          </span>
        </div>

        <TextScramble
          as="p"
          className="text-sm leading-relaxed text-fg-1 max-w-xl"
        >
          A frontend developer who enjoys motion, design systems, and the
          tension between code and visual storytelling.
        </TextScramble>
      </section>

      <header className="flex items-center justify-between mt-10">
        <span className="uppercase text-base font-semibold tracking-tight text-fg-1">
          Projects
        </span>

        <Link
          href="/projects"
          className="text-xs font-medium text-fg-2 hover:text-fg-primary underline-offset-4 hover:underline transition-colors"
        >
          View all
        </Link>
      </header>
      {/* <FadeIn as="section" delay={0.01} className="flex flex-col gap-10"> */}

      <ul className="space-y-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </ul>

      <header className="flex items-center justify-between mt-10">
        <span className="uppercase text-base font-semibold tracking-tight text-fg-1">
          Blog
        </span>

        <Link
          href="/blog"
          className="text-xs font-medium text-fg-2 hover:text-fg-primary underline-offset-4 hover:underline transition-colors"
        >
          View all
        </Link>
      </header>

      <ul className="space-y-6">
        {sortedBlogs.map((blog, index) => (
          <BlogCard key={blog.slug} blog={blog} index={index} />
        ))}
      </ul>
      {/* Debug: {sortedBlogs.length} blogs */}
    </main>
  );
}

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  return (
    <li key={project.slug}>
      <FadeIn
        as="div"
        delay={0.1 + index * 0.001}
        className="group rounded-xl py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-neutral-50 "
      >
        <Link
          href={`/projects/${project.slug}`}
          className="flex flex-row w-full justify-between items-center"
        >
          <div className="flex items-center gap-6">
            {project.icon}
            <span className="text-sm font-medium text-fg-1">
              {project.title}{" "}
              {/* <span className=" text-fg-primary">{project.slug}</span> */}
            </span>
          </div>

          <span className="text-xs font-medium text-fg-3">{project.year}</span>
        </Link>
      </FadeIn>
    </li>
  );
};

const BlogCard = ({ blog, index }: { blog: BlogPost; index: number }) => {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li key={blog.slug}>
      <FadeIn
        as="div"
        delay={0.1 + index * 0.05}
        className="group rounded-xl py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-neutral-50"
      >
        <Link
          href={`/blog/${blog.slug}`}
          className="flex flex-row w-full justify-between items-start"
        >
          <time
            dateTime={blog.publishedAt}
            className="text-xs text-fg-3 font-medium shrink-0"
          >
            {formattedDate}
          </time>
          <div className="flex  flex-col max-w-[300px] items-start justify-start w-full gap-2">
            <span className="text-sm font-medium text-fg-1 line-clamp-1 flex-1 min-w-0 text-left">
              {blog.title}
            </span>
            <span className="text-xs font-medium text-fg-3 line-clamp-2">
              {blog.summary}
            </span>
          </div>
        </Link>
      </FadeIn>
    </li>
  );
};
