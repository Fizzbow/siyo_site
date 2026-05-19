"use client";

import { useEffect, useState, useMemo } from "react";
import type { Highlighter } from "shiki";
import { getSingletonHighlighter } from "shiki";
import { useTheme } from "next-themes";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps extends ComponentProps<"code"> {
  inline?: boolean;
}

// 创建高亮器实例的单例
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["min-light", "tokyo-night"],
      langs: [
        "bash",
        "jsx",
        "javascript",
        "typescript",
        "tsx",
        "json",
        "css",
        "html",
        "markdown",
        "mdx",
        "python",
        "java",
        "go",
        "rust",
        "sql",
        "yaml",
        "yml",
        "xml",
        "shell",
        "sh",
        "zsh",
      ],
    });
  }
  return highlighterPromise;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-fg-3 hover:text-fg-1"
      title="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  // 专门解构出 node 以防它被传到原生 code 标签上产生控制台警告
  const { ...restProps } = props as ComponentPropsWithoutRef<"code">;
  const { resolvedTheme } = useTheme();
  const match = useMemo(
    () => /language-(\w+)/.exec(className || ""),
    [className]
  );
  const language = match ? match[1] : "";
  const code = useMemo(() => String(children).replace(/\n$/, ""), [children]);

  // 核心修复：即使 inline 是 undefined，只要没有 language-xxx 类名，就应用内联样式
  const isInline = inline || !match;

  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    // 只有代码块（带语言的）才需要 Shiki 高亮逻辑
    if (isInline || !resolvedTheme) {
      return;
    }

    let cancelled = false;

    getHighlighterInstance()
      .then((highlighter) => {
        if (cancelled) return;

        const theme = resolvedTheme === "dark" ? "tokyo-night" : "min-light";
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: theme,
        });

        const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const innerHtml = codeMatch ? codeMatch[1] : html;

        if (!cancelled) {
          setHighlightedCode(innerHtml);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to highlight code:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [code, language, isInline, resolvedTheme]);

  // 内联样式分支
  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-fg-primary font-mono text-[0.85em]"
        {...restProps}
      >
        {children}
      </code>
    );
  }

  // 虚线样式的代码块外壳
  return (
    <div className="relative my-8 group">
      <div className="relative flex flex-col rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 bg-transparent overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 bg-transparent">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider text-fg-3">
            <Terminal size={10} />
            {language}
          </div>
          <CopyButton text={code} />
        </div>

        {/* Code body */}
        <div className="relative overflow-x-auto p-4 font-mono text-sm leading-relaxed">
          {!highlightedCode ? (
            <code
              className={`${className} whitespace-pre`}
              suppressHydrationWarning
              {...restProps}
            >
              {children}
            </code>
          ) : (
            <code
              className={`${className} whitespace-pre`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              suppressHydrationWarning
              {...restProps}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
