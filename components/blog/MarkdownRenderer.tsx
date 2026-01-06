"use client";

import type { ReactElement, PropsWithChildren } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useTheme } from "next-themes";

import CodeBlock from "./CodeBlock";

export interface MarkdownRendererProps {
  markdown: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const Heading1 = ({ children }: PropsWithChildren) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h1
      id={id}
      className="mt-10 mb-6 text-2xl font-semibold tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h1>
  );
};

const Heading2 = ({ children }: PropsWithChildren) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h2
      id={id}
      className="mt-8 mb-4 text-xl font-semibold tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h2>
  );
};

const Heading3 = ({ children }: PropsWithChildren) => {
  const id = typeof children === "string" ? slugify(children) : undefined;
  return (
    <h3
      id={id}
      className="mt-6 mb-3 text-lg font-medium tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h3>
  );
};

const Paragraph = ({ children }: PropsWithChildren) => (
  <p className="text-sm leading-7 text-fg-2">{children}</p>
);

const UnorderedList = ({ children }: PropsWithChildren) => (
  <ul className="mb-5 ml-5 list-disc space-y-2 text-sm leading-7 text-fg-2 marker:text-fg-4">
    {children}
  </ul>
);

const OrderedList = ({ children }: PropsWithChildren) => (
  <ol className="mb-5 ml-5 list-decimal space-y-2 text-sm leading-7 text-fg-2 marker:text-fg-4">
    {children}
  </ol>
);

const ListItem = ({ children }: PropsWithChildren) => (
  <li className="pl-1">{children}</li>
);

const BlockQuote = ({ children }: PropsWithChildren) => (
  <blockquote className="my-2 border-l-3 font-mono font-semibold border-fg-primary  pl-1 text-sm text-fg-3 pr-3 rounded-r-lg">
    <div className="dark:bg-neutral-900 py-2 px-2">{children}</div>
  </blockquote>
);

const Emphasis = ({ children }: PropsWithChildren) => (
  <em className="text-fg-2 not-italic font-medium">{children}</em>
);

const Strong = ({ children }: PropsWithChildren) => (
  <strong className="font-semibold text-fg-1">{children}</strong>
);

const Aside = ({ children }: PropsWithChildren) => {
  return (
    <aside className="my-6 rounded-md bg-neutral-100/80 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 pl-4 pr-4 py-3">
      <div className="text-sm font-mono font-semibold leading-relaxed text-fg-2 [&_strong]:text-fg-1 [&_code]:text-fg-primary">
        {children}
      </div>
    </aside>
  );
};

const PreBlock = ({ children }: PropsWithChildren) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative my-8 group">
      {/* Dashed border container */}
      <div className="absolute -inset-2 rounded-xl border-2 border-dashed border-blue-500/20 dark:border-blue-400/10 pointer-events-none" />

      {/* 根据主题设置背景色，shiki 的样式会覆盖这个 */}
      <pre
        className={`overflow-x-auto rounded-lg p-4 text-sm leading-relaxed font-mono ${
          resolvedTheme === "dark" ? "bg-[#2e3440]" : "bg-white"
        }`}
      >
        {children}
      </pre>
    </div>
  );
};

const components = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: BlockQuote,
  em: Emphasis,
  strong: Strong,
  code: CodeBlock,
  pre: PreBlock,
  aside: Aside,
};

export function MarkdownRenderer({
  markdown,
}: MarkdownRendererProps): ReactElement {
  return (
    <article className="max-w-none prose prose-neutral dark:prose-invert prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components as Components}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
