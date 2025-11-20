"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

interface BlogTagsProps {
    tags: string[];
    activeCategory?: string;
    align?: "start" | "center" | "end";
}

export function BlogTags({ tags, activeCategory, align = "center" }: BlogTagsProps) {
    const [expanded, setExpanded] = useState(false);
    // Heuristic: if there are many tags, we assume they might wrap.
    // A safer way without measuring is to just show the button if tags > 7.
    const showToggle = tags.length > 7;

    const justifyClass = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
    }[align];

    const itemsClass = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
    }[align];

    return (
        <div className={clsx("flex flex-col gap-2 w-full", itemsClass)}>
            <motion.div
                className={clsx(
                    "flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 ease-in-out",
                    justifyClass,
                    expanded ? "max-h-[500px]" : "max-h-[26px]"
                )}
            >
                {tags.map((tag) => {
                    const isActive = activeCategory?.toLowerCase() === tag.toLowerCase();
                    return (
                        <Link
                            key={tag}
                            href={`/blog?category=${encodeURIComponent(tag)}`}
                            className={clsx(
                                "px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all border h-[26px] flex items-center",
                                isActive
                                    ? "bg-fg-1 text-background border-fg-1"
                                    : "bg-surface-muted border-transparent text-muted hover:border-border-strong hover:text-fg-1"
                            )}
                        >
                            {tag}
                        </Link>
                    );
                })}
            </motion.div>

            {showToggle && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] font-medium text-soft hover:text-fg-1 transition-colors flex items-center gap-1 mt-1"
                >
                    {expanded ? (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                            Show less
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            Show more
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
