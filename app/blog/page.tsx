import type { Metadata } from "next";
// import Link from "next/link";
import { BlogListItem } from "@/components/blog/BlogListItem";
import { BlogSearch } from "@/components/blog/BlogSearch";
// import { BlogTags } from "@/components/blog/BlogTags";
import { getAllBlogPosts } from "@/lib/blog";

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

  const blogPosts = await getAllBlogPosts();

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

  // const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  return (
    <div className="mx-auto space-y-12">
      <header className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-full max-w-md mx-auto space-y-4">
          <BlogSearch posts={blogPosts} />
          {/* <BlogTags tags={allTags} activeCategory={category} align="center" /> */}
        </div>
      </header>

      <div className="min-h-[50vh]">
        <ul className="space-y-6">
          {sorted.map((post) => (
            <BlogListItem key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </div>
  );
}
