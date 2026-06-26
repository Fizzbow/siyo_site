"use client";

import type { ReactElement } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { GeistTokenBlock, GeistTokenSpecimen } from "./GeistTokenSpecimen";
import {
  createMarkdownComponents,
  renderTermTooltipSyntax,
  sectionizeHeadings,
} from "./markdownComponents";

export interface MarkdownRendererProps {
  markdown: string;
}

const components = createMarkdownComponents({
  "geist-token-block": GeistTokenBlock,
  "geist-token-specimen": GeistTokenSpecimen,
}, [GeistTokenBlock, GeistTokenSpecimen]);

export function MarkdownRenderer({
  markdown,
}: MarkdownRendererProps): ReactElement {
  const renderedMarkdown = renderTermTooltipSyntax(markdown);

  return (
    <article className="max-w-none prose prose-neutral dark:prose-invert prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, sectionizeHeadings]}
        rehypePlugins={[rehypeRaw]}
        components={components as Components}
      >
        {renderedMarkdown}
      </ReactMarkdown>
    </article>
  );
}
