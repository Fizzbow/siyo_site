import { NextRequest, NextResponse } from "next/server";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getBlogPostsByTag,
} from "@/lib/blog";
import { BlogCategory } from "@/types/blog";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    // Get single post by slug
    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(post);
    }

    // Get posts by category
    if (category) {
      const posts = await getBlogPostsByCategory(category as BlogCategory);
      return NextResponse.json(posts);
    }

    // Get posts by tag
    if (tag) {
      const posts = await getBlogPostsByTag(tag);
      return NextResponse.json(posts);
    }

    // Get all posts
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
