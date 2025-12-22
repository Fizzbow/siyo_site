import type { ReactElement, PropsWithChildren } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  <blockquote className="my-2 border-l-4 font-mono font-semibold border-blue-500/30 pl-4 text-sm italic text-fg-2 bg-surface-muted/50 py-3 pr-3 rounded-r-lg">
    {children}
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

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: SyntaxHighlighterProps) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (!inline && match) {
    return (
      <SyntaxHighlighter
        {...props}
        style={nightOwl}
        language={language}
        PreTag="div" // We use div because we wrap it in our custom PreBlock style
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.9rem",
          lineHeight: "1.7",
          borderRadius: "0.5rem",
          backgroundColor: "#1e1e1e",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }

  // Fallback for inline code or code blocks without language
  return (
    <code
      className="rounded-sm font-mono font-semibold px-1.5 py-0.5 text-xs text-fg-primary bg-fg-primary/5"
      {...props}
    >
      {children}
    </code>
  );
};

const PreBlock = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative my-8 group">
      {/* Dashed border container */}
      <div className="absolute -inset-2 rounded-xl border-2 border-dashed border-blue-500/20 dark:border-blue-400/10 pointer-events-none" />

      {/* Code content */}
      <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-[#1e1e1e] p-4 text-sm leading-relaxed text-gray-300 shadow-sm font-mono">
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
