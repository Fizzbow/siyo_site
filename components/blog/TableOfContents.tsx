"use client";

import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { motion } from "motion/react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent, headingId: string) => {
    e.preventDefault();

    isScrollingRef.current = true;
    setActiveId(headingId);

    document.getElementById(headingId)?.scrollIntoView({
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  if (headings.length === 0) return null;

  // TODO：修改溢出一行时，下面出现的星星点点的东西
  return (
    <motion.div
      className={clsx(
        "hidden xl:flex fixed right-8 top-32 z-40 flex-col gap-2 overflow-hidden",
        isHovered ? "items-start w-64" : "items-end w-12"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <nav className="flex flex-col gap-1.5 w-full">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleClick(e, heading.id)}
            className={clsx(
              "group flex items-center transition-all duration-200 relative",
              isHovered
                ? "w-full justify-start pl-4"
                : "w-full justify-end pr-2"
            )}
          >
            {/* Collapsed State: Horizontal Lines */}
            {!isHovered && (
              <motion.div
                key={`line-${heading.id}`}
                className={clsx(
                  "h-0.5 rounded-full transition-colors duration-300",
                  activeId === heading.id
                    ? "bg-blue-500"
                    : "bg-fg-3/30 group-hover:bg-fg-3/60"
                )}
                style={{
                  width:
                    activeId === heading.id
                      ? 24
                      : 12 + (heading.text.length % 10),
                }}
              />
            )}

            {/* Expanded State: Text Content */}
            {isHovered && (
              <motion.div
                key={`text-${heading.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  "text-xs transition-colors duration-200 line-clamp-1 border-l pl-3 py-1",
                  activeId === heading.id
                    ? "text-blue-500 font-medium border-blue-500"
                    : "text-fg-3 hover:text-fg-1 border-border-subtle"
                )}
              >
                {heading.text}
              </motion.div>
            )}
          </a>
        ))}
      </nav>
    </motion.div>
  );
}
