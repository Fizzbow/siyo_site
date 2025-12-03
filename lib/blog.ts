import fs from "fs";
import path from "path";
import { BlogCategory, BlogPost } from "@/types/blog";

const blogDirectory = path.join(process.cwd(), "content/blog");

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      return parseBlogPost(fileContents, fileName);
    })
    .filter((post): post is BlogPost => post !== null);

  return allPostsData.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

export async function getBlogPostsByCategory(
  category: BlogCategory
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.category === category);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

function parseBlogPost(
  fileContents: string,
  fileName: string
): BlogPost | null {
  // Parse frontmatter (YAML format)
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContents.match(frontmatterRegex);

  if (!match) {
    return null; // Skip files without proper frontmatter
  }

  const [, frontmatter, content] = match;
  const metadata: Record<string, string | string[]> = {};

  // Parse YAML frontmatter line by line
  const lines = frontmatter.split("\n");
  let currentKey = "";
  let currentValue = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this is a new key-value pair
    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex > 0) {
      // Save previous key-value if exists
      if (currentKey) {
        metadata[currentKey] = parseYamlValue(currentValue.trim());
      }

      currentKey = trimmedLine.substring(0, colonIndex).trim();
      currentValue = trimmedLine.substring(colonIndex + 1).trim();
    } else if (currentKey) {
      // Continuation of previous value
      currentValue += " " + trimmedLine;
    }
  }

  // Save last key-value
  if (currentKey) {
    metadata[currentKey] = parseYamlValue(currentValue.trim());
  }

  // Parse tags array
  let tags: string[] = [];
  if (metadata.tags) {
    if (Array.isArray(metadata.tags)) {
      tags = metadata.tags;
    } else if (typeof metadata.tags === "string") {
      // Handle array format: [tag1, tag2, tag3]
      const tagsMatch = metadata.tags.match(/\[(.*?)\]/);
      if (tagsMatch) {
        tags = tagsMatch[1]
          .split(",")
          .map((tag) => tag.trim().replace(/['"]/g, ""));
      } else {
        tags = [metadata.tags];
      }
    }
  }

  const slug =
    (typeof metadata.slug === "string" ? metadata.slug : null) ||
    fileName.replace(/\.(md|mdx)$/, "");

  return {
    slug,
    title: (typeof metadata.title === "string" ? metadata.title : "") || "",
    publishedAt:
      (typeof metadata.publishedAt === "string"
        ? metadata.publishedAt
        : typeof metadata.date === "string"
        ? metadata.date
        : "") || "",
    category: (metadata.category as BlogCategory) || "note",
    tags,
    summary:
      (typeof metadata.summary === "string" ? metadata.summary : "") || "",
    content: content.trim(),
  };
}

function parseYamlValue(value: string): string | string[] {
  // Remove quotes if present
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Parse array format: [value1, value2, value3]
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/['"]/g, ""));
  }

  return value;
}
