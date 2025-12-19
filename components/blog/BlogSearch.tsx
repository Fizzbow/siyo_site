"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/types/blog";
import { BlogTags } from "./BlogTags";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Search, Calendar } from "lucide-react";

export interface BlogSearchProps {
  posts: BlogPost[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Reset query when dialog opens/closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setQuery(""), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    const terms = value.split(/\s+/);

    return posts
      .map((post) => {
        const haystack = `${post.title} ${post.summary} ${post.tags.join(" ")}`
          .toLowerCase()
          .normalize("NFKC");

        const matched = terms.every((term) => haystack.includes(term));

        if (!matched) return null;

        const score =
          (post.title.toLowerCase().includes(value) ? 0 : 10) +
          (post.summary.toLowerCase().includes(value) ? 0 : 5);

        return { post, score };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.score || 0) - (b!.score || 0))
      .map((item) => item!.post)
      .slice(0, 10);
  }, [posts, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-surface-muted border border-transparent hover:border-border-strong hover:bg-surface-elevated transition-all group cursor-pointer max-w-xs mx-auto"
        >
          <div className="flex items-center gap-2 text-muted group-hover:text-fg-1 transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Search posts...</span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[640px] p-0 border-none bg-transparent shadow-none"
        showCloseButton={false}
      >
        <div className="rounded-[28px] border border-white/20 bg-white/60 dark:bg-neutral-800/80 dark:border-neutral-700/50 backdrop-blur-2xl shadow-2xl p-2">
          <div
            className="flex flex-col w-full bg-white dark:bg-[#0A0A0A] rounded-[20px] overflow-hidden min-h-[300px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-neutral-800 shrink-0">
              <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              <input
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground/50 font-sans h-6"
                placeholder="Type to search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-gray-400 dark:text-gray-500">
                ESC
              </kbd>
            </div>

            <div className="flex-1 overflow-y-auto">
              {query.length === 0 ? (
                <div className="px-5 py-6">
                  <div className="mb-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Suggested Topics
                  </div>
                  <BlogTags
                    tags={Array.from(
                      new Set(posts.flatMap((post) => post.tags))
                    )}
                    align="start"
                  />
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No results found for &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Try searching for something else.
                  </p>
                </div>
              ) : (
                <ul className="p-2 space-y-1">
                  {results.map((post) => (
                    <li
                      key={post.slug}
                      className="group flex flex-col gap-1 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/blog/${post.slug}`);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 tabular-nums">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground/80 line-clamp-1">
                        {post.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
