"use client";

import React from "react";
import type { PropsWithChildren, ReactNode } from "react";

import CodeBlock from "./CodeBlock";
import { TermTooltip } from "./TermTooltip";
import { slugify } from "@/lib/utils";

export type MdNode = {
  type?: string;
  depth?: number;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

const termTooltipPattern = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getTextContent(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) {
      return getTextContent(props.children);
    }
  }
  return "";
}

export function sectionizeHeadings() {
  return (tree: MdNode) => {
    if (!Array.isArray(tree.children)) {
      return;
    }

    const newChildren: MdNode[] = [];
    let currentSection: MdNode | null = null;

    const pushSection = () => {
      if (currentSection) {
        newChildren.push(currentSection);
        currentSection = null;
      }
    };

    tree.children.forEach((node) => {
      if (node.type === "heading") {
        pushSection();
        const depth = node.depth ?? 1;
        currentSection = {
          type: "section",
          data: {
            hName: "section",
            hProperties: {
              className: ["md-section"],
              "data-md-depth": String(depth),
            },
          },
          children: [node],
        };
      } else if (currentSection) {
        currentSection.children?.push(node);
      } else {
        newChildren.push(node);
      }
    });

    pushSection();
    tree.children = newChildren;
  };
}

export function renderTermTooltipSyntax(markdown: string) {
  return markdown.replace(termTooltipPattern, (_, label: string, tip: string) => {
    return `<span data-term-tooltip="true" data-tip="${escapeHtmlAttribute(tip.trim())}">${escapeHtmlText(label.trim())}</span>`;
  });
}

const Heading1 = ({ children }: PropsWithChildren) => {
  const text = getTextContent(children);
  const id = text ? slugify(text) : undefined;
  return (
    <h1
      id={id}
      className="my-10 text-3xl font-bold tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h1>
  );
};

const Heading2 = ({ children }: PropsWithChildren) => {
  const text = getTextContent(children);
  const id = text ? slugify(text) : undefined;
  return (
    <h2
      id={id}
      className="my-6 text-2xl font-bold tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h2>
  );
};

const Heading3 = ({ children }: PropsWithChildren) => {
  const text = getTextContent(children);
  const id = text ? slugify(text) : undefined;
  return (
    <h3
      id={id}
      className="my-6 text-xl font-bold tracking-tight text-fg-1 scroll-mt-24"
    >
      {children}
    </h3>
  );
};

function containsBlockComponent(children: ReactNode, blockComponents: unknown[]): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }
    if (blockComponents.includes(child.type)) {
      return true;
    }
    const props = child.props as { children?: ReactNode };
    return props.children
      ? containsBlockComponent(props.children, blockComponents)
      : false;
  });
}

const createParagraph = (blockComponents: unknown[]) => {
  const Paragraph = ({ children }: PropsWithChildren) => {
    if (containsBlockComponent(children, blockComponents)) {
      return <>{children}</>;
    }

    return <p className="text-sm leading-7 text-fg-2">{children}</p>;
  };

  return Paragraph;
};

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

type SpanProps = PropsWithChildren<{
  "data-term-tooltip"?: string | boolean;
  "data-tip"?: string;
}>;

const Span = ({ children, ...props }: SpanProps) => {
  if (props["data-term-tooltip"]) {
    return <TermTooltip tip={props["data-tip"]}>{children}</TermTooltip>;
  }

  return <span>{children}</span>;
};

const BlockQuote = ({ children }: PropsWithChildren) => (
  <blockquote className="my-2 border-l-3 font-mono font-semibold border-fg-primary  pl-1 text-sm text-fg-3 pr-3 rounded-r-lg">
    <div className="dark:bg-neutral-900 py-1 px-2">{children}</div>
  </blockquote>
);

const Emphasis = ({ children }: PropsWithChildren) => (
  <em className="text-fg-2 not-italic font-medium">{children}</em>
);

const Strong = ({ children }: PropsWithChildren) => (
  <strong className="font-semibold text-fg-1">{children}</strong>
);

const emojiOnlyPattern =
  /^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D]+$/u;

function isEmojiOnly(text: string) {
  const trimmed = text.trim();
  return trimmed.length > 0 && emojiOnlyPattern.test(trimmed);
}

function splitCalloutContent(children: ReactNode): {
  icon: string | null;
  content: ReactNode;
} {
  const items = React.Children.toArray(children);
  if (items.length === 0) {
    return { icon: null, content: children };
  }

  const first = items[0];

  if (typeof first === "string" && isEmojiOnly(first)) {
    return { icon: first.trim(), content: items.slice(1) };
  }

  if (React.isValidElement(first) && first.type === "p") {
    const props = first.props as { children?: ReactNode };
    const text = getTextContent(props.children).trim();
    if (isEmojiOnly(text)) {
      return { icon: text, content: items.slice(1) };
    }
  }

  return { icon: null, content: children };
}

const Aside = ({ children }: PropsWithChildren) => {
  const { icon, content } = splitCalloutContent(children);

  return (
    <aside className="md-callout">
      {icon ? (
        <span className="md-callout__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <div className="md-callout__body">{content}</div>
    </aside>
  );
};

const PreBlock = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export function createMarkdownComponents(
  customComponents: Record<string, React.ComponentType> = {},
  blockComponents: unknown[] = []
) {
  return {
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: createParagraph(blockComponents),
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    blockquote: BlockQuote,
    em: Emphasis,
    strong: Strong,
    code: CodeBlock,
    span: Span,
    pre: PreBlock,
    aside: Aside,
    ...customComponents,
  };
}
