"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

interface BlogTagsProps {
    tags: string[];
    activeCategory?: string;
}

export function BlogTags({ tags, activeCategory }: BlogTagsProps) {
    const [expanded, setExpanded] = useState(false);
    const INITIAL_COUNT = 10;

    const visibleTags = expanded ? tags : tags.slice(0, INITIAL_COUNT);
    const hasMore = tags.length > INITIAL_COUNT;

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex flex-wrap justify-center gap-1.5">
                <AnimatePresence mode="popLayout">
                    {visibleTags.map((tag) => {
                        const isActive = activeCategory?.toLowerCase() === tag.toLowerCase();
                        return (
                            <motion.div
                                key={tag}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    href={`/blog?category=${encodeURIComponent(tag)}`}
                                    className={clsx(
                                        "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border",
                                        isActive
                                            ? "bg-fg-1 text-background border-fg-1"
                                            : "bg-surface-muted border-transparent text-muted hover:border-border-strong hover:text-fg-1"
                                    )}
                                >
                                    {tag}
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {hasMore && (
                    <motion.button
                        layout
                        onClick={() => setExpanded(!expanded)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-muted border border-transparent text-soft hover:text-fg-1 hover:border-border-strong transition-all flex items-center gap-1"
                    >
                        {expanded ? "Show less" : `+${tags.length - INITIAL_COUNT} more`}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
