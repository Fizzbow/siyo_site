"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/types/blog";
import { BlogTags } from "./BlogTags";

export interface BlogSearchProps {
  posts: BlogPost[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

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
    <>
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-surface-muted border border-transparent hover:border-border-strong hover:bg-surface-elevated transition-all group cursor-pointer max-w-xs mx-auto"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2 text-muted group-hover:text-fg-1 transition-colors">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="text-xs font-medium">Search posts...</span>
        </div>
      </button>

      {open ? (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search posts"
          onClick={() => setOpen(false)}
        >
          <div
            className="search-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-panel__input-row">
              <span className="text-soft text-sm">Search now...</span>
              <input
                autoFocus
                className="search-panel__input"
                placeholder="Type a title, keyword or tag"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="button"
                className="text-xs text-soft"
                onClick={() => setOpen(false)}
              >
                Esc
              </button>
            </div>

            <BlogTags
              tags={Array.from(new Set(posts.flatMap((post) => post.tags)))}
            />

            <div className="search-panel__list">
              {query.length === 0 ? (
                <p className="px-2 py-3 text-xs text-soft">
                  Try searching for “motion”, “design system”, or “nextjs”.
                </p>
              ) : results.length === 0 ? (
                <p className="px-2 py-3 text-xs text-soft">
                  No results. Maybe try a different wording?
                </p>
              ) : (
                <ul>
                  {results.map((post) => (
                    <li
                      key={post.slug}
                      className="search-panel__item"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/blog/${post.slug}`);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[color:var(--foreground)]">
                          {post.title}
                        </span>
                        <span className="text-[10px] text-soft">
                          {post.publishedAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-soft line-clamp-2">
                        {post.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
