/**
 * Shared HTTP client used by the BFF lambdas to reach the upstream Woot API.
 */
const API_BASE_URL = process.env.WOOT_INDEX_API_BASE_URL ?? 'http://localhost:3200';
const API_ADMIN_KEY = process.env.WOOT_INDEX_API_ADMIN_KEY ?? '';

/**
 * Performs a GET request against the configured upstream API and serializes defined query params.
 */
export async function requestCatalogApi<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  const url = new URL(path, API_BASE_URL);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      'X-Admin-Key': API_ADMIN_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Woot API request failed (${response.status}) for ${url.pathname}`);
  }

  return response.json() as Promise<T>;
}
