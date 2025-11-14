import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { BlogPost } from "@/data/blogPosts";

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
    <li className="group rounded-xl px-3 py-3 flex items-start justify-between gap-4 cursor-pointer hover:bg-[rgba(15,23,42,0.92)] transition-colors">
      <div className="space-y-1">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-sm font-medium text-[color:var(--foreground)] group-hover:underline underline-offset-4">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-muted line-clamp-2">{post.summary}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <Tag variant="subtle">{post.category}</Tag>
          {post.tags.slice(0, 2).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-soft">{formatted}</span>
      </div>
    </li>
  );
}


