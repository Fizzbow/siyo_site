/**
 * Get the base URL for API requests
 * In server components, we need absolute URL
 */
export function getApiBaseUrl(): string {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // In server-side rendering, use localhost for development
  if (typeof window === "undefined") {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }

  // Client-side: use relative path (browser will resolve it)
  return "";
}
