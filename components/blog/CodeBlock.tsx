"use client";

import { useEffect, useState, useMemo } from "react";
import { getSingletonHighlighter } from "shiki";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import type { Highlighter } from "shiki";

interface CodeBlockProps extends ComponentProps<"code"> {
  inline?: boolean;
}

// 创建高亮器实例的单例
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["min-light", "nord"],
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

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const { resolvedTheme } = useTheme();
  const match = useMemo(
    () => /language-(\w+)/.exec(className || ""),
    [className]
  );
  const language = match ? match[1] : "";
  const code = useMemo(() => String(children).replace(/\n$/, ""), [children]);
  const shouldHighlight = !inline && !!match;

  const [highlightedCode, setHighlightedCode] = useState<string>("");
  // 使用 lazy initialization 来检测是否在客户端
  const [isMounted, setIsMounted] = useState(() => false);

  // 确保只在客户端 hydration 后才开始加载高亮
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!shouldHighlight || !isMounted || !resolvedTheme) {
      return;
    }

    // 主题变化时先清空高亮代码，避免显示旧主题
    setHighlightedCode("");

    let cancelled = false;

    getHighlighterInstance()
      .then((highlighter) => {
        if (cancelled) return;

        // 根据当前主题选择对应的主题
        const theme = resolvedTheme === "dark" ? "nord" : "min-light";
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
  }, [code, language, shouldHighlight, isMounted, resolvedTheme]);

  // 内联代码或没有语言标记的代码块
  if (inline || !match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // 在客户端 hydration 完成前，始终显示原始代码以确保一致性
  if (!isMounted || !highlightedCode) {
    return (
      <code className={className} suppressHydrationWarning {...props}>
        {children}
      </code>
    );
  }

  // 使用 shiki 高亮后的 HTML
  return (
    <code
      className={className}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      suppressHydrationWarning
      {...props}
    />
  );
};

export default CodeBlock;
