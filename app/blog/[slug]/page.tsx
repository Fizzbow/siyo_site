import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { blogPosts } from "@/data/blogPosts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return undefined;

  return {
    title: `${post.title} · Siyo`,
    description: post.summary,
  };
}

// Helper to extract headings from markdown
function extractHeadings(markdown: string) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    headings.push({ id, text, level });
  }
  return headings;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return notFound();
  }

  const date = new Date(post.publishedAt);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const headings = extractHeadings(post.content);

  return (
    <>
      <TableOfContents headings={headings} />

      <header
        className="fixed left-0 right-0 mx-auto max-w-6xl flex justify-between items-center top-0 z-10 pt-8
          backdrop-blur-xl backdrop-saturate-150 bg-white/70  dark:bg-[#0F0F10]/80"
      >
        <Link
          className={cn(buttonVariants({ variant: "ghost" }), "z-11")}
          href="/blog"
        >
          <ChevronLeft size={14} />
          <span>Back</span>
        </Link>

        <ReadingProgress />
      </header>
      <div className="relative mx-auto px-6 pt-8 pb-24">
        <div className="min-w-0">
          <header className="mb-10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-fg-3">
                <time
                  dateTime={post.publishedAt}
                  className="font-medium text-fg-2"
                >
                  {formatted}
                </time>
                <span className="h-0.5 w-0.5 rounded-full bg-fg-3/50" />
                <span className="font-medium uppercase tracking-wider text-fg-3">
                  {post.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-fg-1 sm:text-4xl sm:leading-tight">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-500/5 px-2.5 py-1 text-[11px] font-medium text-blue-600/80 dark:text-blue-400/80 border border-transparent"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MarkdownRenderer markdown={post.content} />
          </div>
        </div>
      </div>
    </>
  );
}
