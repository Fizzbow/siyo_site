import { getApiBaseUrl } from "./api";

/**
 * Unified API client - provides a base request method with baseUrl handling
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  /**
   * Make a request to the API
   * @param endpoint - API endpoint (e.g., "/api/blog" or "/api/blog?slug=xxx")
   * @param options - Optional fetch options
   */
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not found");
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
