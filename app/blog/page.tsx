import type { Metadata } from "next";
import Link from "next/link";
import { BlogListItem } from "@/components/blog/BlogListItem";
import { BlogSearch } from "@/components/blog/BlogSearch";
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
    // 只匹配 tags，不匹配 category
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
      Filtering by{" "}
      <span className="text-foreground font-medium">{category}</span>
    </span>
  ) : (
    <span className="text-xs text-soft">
      Showing recent posts. Use tags or search to narrow things down.
    </span>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <section className="surface-card p-6 flex flex-col gap-4">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="badge">
              <span className="badge-dot" />
              <span>Writing log</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-neutral-900">Blog</h1>
              <p className="text-sm text-muted">
                Notes on frontend, motion design, and product thinking.
              </p>
            </div>
          </div>
          <BlogSearch posts={blogPosts} />
        </header>

        <div className="flex items-center justify-between text-xs">
          {activeCategoryLabel}
          <Link
            href="/blog"
            className="text-soft underline-offset-4 hover:underline hover:text-foreground transition-colors"
          >
            Reset
          </Link>
        </div>

        <div className="surface-muted mt-2 p-3">
          <ul className="divide-y divide-[rgba(148,163,184,0.24)]">
            {sorted.map((post) => (
              <BlogListItem key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="surface-muted p-4 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.flatMap((post) => post.tags))).map(
              (tag) => (
                <Link
                  key={tag}
                  href={`/blog?category=${encodeURIComponent(tag)}`}
                  className="text-[11px] text-soft px-2 py-1 rounded-full hover:text-foreground transition-colors"
                >
                  {tag}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="surface-muted p-4 space-y-2 text-xs text-soft">
          <p>
            Search runs a fuzzy match on title, summary and tags. Describe what
            you are looking for in your own words.
          </p>
          <p>
            Over time this section will grow into more structured topics and
            series.
          </p>
        </div>
      </aside>
    </div>
  );
}
