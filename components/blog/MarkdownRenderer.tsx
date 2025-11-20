import type { ReactElement, PropsWithChildren } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownRendererProps {
  markdown: string;
}

const Heading2 = ({ children }: PropsWithChildren) => (
  <h2 className="mt-6 mb-3 text-xl font-semibold text-fg-1">{children}</h2>
);

const Paragraph = ({ children }: PropsWithChildren) => (
  <p className="mb-3 text-sm leading-relaxed text-fg-3">{children}</p>
);

const UnorderedList = ({ children }: PropsWithChildren) => (
  <ul className="mb-3 ml-4 list-disc space-y-1 text-sm text-fg-3">
    {children}
  </ul>
);

const OrderedList = ({ children }: PropsWithChildren) => (
  <ol className="mb-3 ml-4 list-decimal space-y-1 text-sm text-fg-3">
    {children}
  </ol>
);

const BlockQuote = ({ children }: PropsWithChildren) => (
  <blockquote className="mb-4 border-l border-neutral-200 pl-3 text-sm text-fg-4">
    {children}
  </blockquote>
);

const Emphasis = ({ children }: PropsWithChildren) => (
  <em className="text-fg-2 not-italic">{children}</em>
);

const Strong = ({ children }: PropsWithChildren) => (
  <strong className="font-semibold text-fg-1">{children}</strong>
);

const components: Components = {
  h2: Heading2,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  blockquote: BlockQuote,
  em: Emphasis,
  strong: Strong,
  code: ({ children }) => {
    // react-markdown v9 renders inline code and code blocks separately as `code` / `pre > code`.
    // Here we keep a simple unified style; inline code is usually embedded in text.
    if (typeof children === "string" || Array.isArray(children)) {
      return (
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-fg-1 border border-neutral-200">
          {children}
        </code>
      );
    }

    return (
      <pre className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-fg-1 overflow-x-auto">
        <code>{children}</code>
      </pre>
    );
  },
};

export function MarkdownRenderer({
  markdown,
}: MarkdownRendererProps): ReactElement {
  return (
    <article className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
