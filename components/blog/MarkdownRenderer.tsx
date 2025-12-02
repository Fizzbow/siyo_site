import type { ReactElement, PropsWithChildren } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      className="mt-10 mb-6 text-3xl font-bold tracking-tight text-fg-1 scroll-mt-24"
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
      className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-fg-1 scroll-mt-24"
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
      className="mt-6 mb-3 text-xl font-medium tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h3>
  );
};

const Paragraph = ({ children }: PropsWithChildren) => (
  <p className="mb-5 text-[15px] leading-7 text-fg-2">{children}</p>
);

const UnorderedList = ({ children }: PropsWithChildren) => (
  <ul className="mb-5 ml-5 list-disc space-y-2 text-[15px] leading-7 text-fg-2 marker:text-fg-4">
    {children}
  </ul>
);

const OrderedList = ({ children }: PropsWithChildren) => (
  <ol className="mb-5 ml-5 list-decimal space-y-2 text-[15px] leading-7 text-fg-2 marker:text-fg-4">
    {children}
  </ol>
);

const ListItem = ({ children }: PropsWithChildren) => (
  <li className="pl-1">{children}</li>
);

const BlockQuote = ({ children }: PropsWithChildren) => (
  <blockquote className="my-6 border-l-4 border-blue-500/30 pl-4 text-[15px] italic text-fg-2 bg-surface-muted/50 py-3 pr-3 rounded-r-lg">
    {children}
  </blockquote>
);

const Emphasis = ({ children }: PropsWithChildren) => (
  <em className="text-fg-2 not-italic font-medium">{children}</em>
);

const Strong = ({ children }: PropsWithChildren) => (
  <strong className="font-semibold text-fg-1">{children}</strong>
);

const CodeBlock = ({ children }: PropsWithChildren) => {
  // Note: This component is used for inline code by react-markdown
  return (
    <code className="rounded-sm bg-surface-muted/80 font-mono! font-semibold px-1.5 py-0.5 text-[13px] text-blue-600 dark:text-blue-400 border border-border-subtle">
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
      <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-[#1e1e1e] p-4 text-[13px] leading-relaxed text-gray-300 shadow-sm font-mono">
        {children}
      </pre>
    </div>
  );
};

const components: Components = {
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
};

export function MarkdownRenderer({
  markdown,
}: MarkdownRendererProps): ReactElement {
  return (
    <article className="max-w-none prose prose-neutral dark:prose-invert prose-headings:scroll-mt-24">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
