import type { ReactElement, PropsWithChildren } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownRendererProps {
  markdown: string;
}

const Heading2 = ({ children }: PropsWithChildren) => (
  <h2 className="mt-6 mb-3 text-xl font-semibold text-slate-900">{children}</h2>
);

const Paragraph = ({ children }: PropsWithChildren) => (
  <p className="mb-3 text-sm leading-relaxed text-slate-700">{children}</p>
);

const UnorderedList = ({ children }: PropsWithChildren) => (
  <ul className="mb-3 ml-4 list-disc space-y-1 text-sm text-slate-700">
    {children}
  </ul>
);

const OrderedList = ({ children }: PropsWithChildren) => (
  <ol className="mb-3 ml-4 list-decimal space-y-1 text-sm text-slate-700">
    {children}
  </ol>
);

const BlockQuote = ({ children }: PropsWithChildren) => (
  <blockquote className="mb-4 border-l border-slate-200 pl-3 text-sm text-slate-500">
    {children}
  </blockquote>
);

const Emphasis = ({ children }: PropsWithChildren) => (
  <em className="text-slate-800 not-italic">{children}</em>
);

const Strong = ({ children }: PropsWithChildren) => (
  <strong className="font-semibold text-slate-900">{children}</strong>
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
    // react-markdown v9 会把行内 code 与代码块分别渲染为 `code` / `pre > code`，
    // 这里简单统一样式，行内 code 在 Markdown 中一般会被包裹在文本中使用。
    if (typeof children === "string" || Array.isArray(children)) {
      return (
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-800 border border-slate-200">
          {children}
        </code>
      );
    }

    return (
      <pre className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 overflow-x-auto">
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
