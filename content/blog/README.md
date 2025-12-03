# Blog Posts

This directory contains all blog posts as MDX files.

## File Format

Each blog post should be a `.md` or `.mdx` file with the following frontmatter:

```yaml
---
slug: your-post-slug
title: Your Post Title
publishedAt: 2024-01-01
category: tech | product | note
tags: [tag1, tag2, tag3]
summary: A brief summary of the post
---
Your markdown content here...
```

## API Usage

### Get all blog posts

```
GET /api/blog
```

### Get post by slug

```
GET /api/blog?slug=your-post-slug
```

### Get posts by category

```
GET /api/blog?category=tech
```

### Get posts by tag

```
GET /api/blog?tag=nextjs
```

## Examples

- `GET /api/blog` - Returns all blog posts
- `GET /api/blog?slug=designing-smooth-loading-experience` - Returns single post
- `GET /api/blog?category=product` - Returns all product posts
- `GET /api/blog?tag=motion` - Returns all posts with "motion" tag
