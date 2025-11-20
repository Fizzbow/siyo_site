export type BlogCategory = "tech" | "product" | "note";

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  category: BlogCategory;
  tags: string[];
  summary: string;
  content: string;
}

const baseIntro = `
Welcome to my personal notes. This is where I record thoughts on frontend
development, motion design, and product thinking.

> These posts are more like working logs than final conclusions. I hope they
> give you a bit of inspiration—or at least a starting point.
`;

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-smooth-loading-experience",
    title: "Designing a Smooth Page Loading Experience",
    publishedAt: "2024-03-06",
    category: "product",
    tags: ["experience", "motion", "ui"],
    summary:
      'Breaking down the subtle "lift up" transition used in tools like Linear, and rebuilding a reusable loading pattern in Next.js.',
    content: `${baseIntro}

## Why loading transitions matter

Our eyes are extremely sensitive to **consistency in motion**. A good loading
transition is not just decoration — it communicates state:

- The current page has finished its job
- A new context is being constructed
- The user is still in control of the interaction

## A small, reusable pattern

For this site I chose a very lightweight CSS-based transition:

- Use \`keyframes\` to animate opacity + translateY
- Use \`key={pathname}\` in the layout to force the animation on route change
- Keep the total duration around 400ms so it feels quick but not abrupt

In the future I might reach for heavier tools like Framer Motion for more
complex flows, but this pattern is a good baseline: easy to reason about,
easy to remove, and hard to break.
`,
  },
  {
    slug: "notes-on-building-a-personal-site",
    title: "Notes on Building a Calm Personal Site (With a Bit of Linear DNA)",
    publishedAt: "2024-02-18",
    category: "tech",
    tags: ["nextjs", "design", "personal-site"],
    summary:
      "How this personal site came together: information architecture, interaction details, and keeping the interface calm with very few elements.",
    content: `${baseIntro}

## Information architecture: clarify the entry points

For a personal site, I mainly care about three questions:

1. Can visitors immediately tell who I am from the hero?
2. Can they quickly find the blog, projects, and contact?
3. Do animations support comprehension instead of competing for attention?

## Visual language: what I borrowed from Linear

From Linear I borrowed a few ideas:

- A dark base with soft, layered lighting
- A simple but very clear hierarchy
- Tiny micro-interactions on almost everything

Together these choices keep the interface calm while still feeling alive.
`,
  },
  {
    slug: "small-components-for-rich-articles",
    title: "Small Components, Richer Articles",
    publishedAt: "2024-01-10",
    category: "note",
    tags: ["components", "writing", "ux"],
    summary:
      "Articles do not have to be just text. Tags, callouts and other components can give structure and rhythm to long-form writing.",
    content: `${baseIntro}

## Starting with the Tag component

The Tag component used on this page is intentionally small in scope:

1. A \`variant\` prop to control emphasis
2. A compact size that never dominates the layout
3. Enough contrast to stay readable on a dark background

Over time I want to add more content components — callouts, timelines, richer
code blocks — so the articles feel more like small products than plain text.
`,
  },
];
