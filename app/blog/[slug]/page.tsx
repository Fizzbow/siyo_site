import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Tag } from "@/components/ui/Tag";
import { blogPosts } from "@/data/blogPosts";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: BlogPostPageProps): Metadata | undefined {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) return undefined;

  return {
    title: `${post.title} · Siyo`,
    description: post.summary,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const date = new Date(post.publishedAt);
  const formatted = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="surface-card p-6 space-y-6">
      <header className="space-y-3">
        <Link
          href="/blog"
          className="text-xs text-soft underline-offset-4 hover:underline hover:text-[color:var(--foreground)]"
        >
          ← Back to Blog
        </Link>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[color:var(--foreground)]">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-soft">
            <span>{formatted}</span>
            <span>·</span>
            <Tag variant="subtle">{post.category}</Tag>
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="text-[11px] underline-offset-4 hover:underline hover:text-[color:var(--foreground)]"
                onClick={() => {
                  window.location.href = `/blog?category=${encodeURIComponent(
                    tag
                  )}`;
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <MarkdownRenderer markdown={post.content} />
    </div>
  );
}
