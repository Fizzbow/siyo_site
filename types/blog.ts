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
