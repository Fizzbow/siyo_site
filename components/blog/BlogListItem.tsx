import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export interface BlogListItemProps {
  post: BlogPost;
}

export function BlogListItem({ post }: BlogListItemProps) {
  const date = new Date(post.publishedAt);
  const formatted = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <li className="group relative -mx-4 px-4 py-4 cursor-pointer rounded-xl transition-colors hover:bg-surface-muted/50 dark:hover:bg-white/[0.02]">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" />
      <div className="relative z-10 flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-base font-medium text-fg-1 group-hover:text-fg-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted line-clamp-2 leading-relaxed">
              {post.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] text-soft font-medium uppercase tracking-wider">
              {formatted}
            </span>
            <div className="w-0.5 h-0.5 rounded-full bg-border-strong" />
            <div className="flex items-center gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-soft group-hover:text-muted transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
