import type { Metadata } from "next";
import Link from "next/link";
import { BlogListItem } from "@/components/blog/BlogListItem";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogTags } from "@/components/blog/BlogTags";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog · Siyo",
};

interface BlogPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = params?.category
    ? decodeURIComponent(params.category).trim()
    : undefined;

  const filtered = blogPosts.filter((post) => {
    if (!category) return true;
    // Only match by tags, not category
    return post.tags.some(
      (tag) => tag.toLowerCase() === category.toLowerCase()
    );
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const activeCategoryLabel = category ? (
    <span className="text-xs text-soft">
      Filtering by <span className="text-fg-2 font-medium">{category}</span>
    </span>
  ) : (
    <span className="text-xs text-soft">
      Showing recent posts. Use tags or search to narrow things down.
    </span>
  );

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  return (
    <div className="mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex flex-col items-start space-y-4 max-w-md">
          <div className="h-6 px-2.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[11px] font-medium uppercase tracking-wider flex items-center">
            Writing Log
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-fg-1">Blog</h1>
            <p className="text-base text-muted leading-relaxed">
              Notes on frontend, motion design, and product thinking.
            </p>
          </div>
        </div>

        <div className="w-full md:max-w-[320px] space-y-4 flex flex-col items-end">
          <BlogSearch posts={blogPosts} />
          <BlogTags tags={allTags} activeCategory={category} align="end" />
        </div>
      </header>

      <div className="w-full flex items-center justify-between pt-2 border-b border-border-subtle pb-3">
        {activeCategoryLabel}
        <Link
          href="/blog"
          className="text-xs text-soft hover:text-fg-1 transition-colors"
        >
          Clear filters
        </Link>
      </div>

      <div className="min-h-[50vh]">
        <ul className="space-y-2">
          {sorted.map((post) => (
            <BlogListItem key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </div >
  );
}
