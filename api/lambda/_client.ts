/**
 * Shared HTTP client used by the BFF lambdas to reach the upstream Woot API.
 */
const API_BASE_URL = process.env.WOOT_INDEX_API_BASE_URL || process.env.WOOT_API_BASE_URL || 'http://localhost:3200';
const API_ADMIN_KEY = process.env.WOOT_INDEX_API_ADMIN_KEY ?? '';

const requestHeaders = {
  ...(API_ADMIN_KEY ? { 'X-Admin-Key': API_ADMIN_KEY } : {}),
};

export class UpstreamApiError extends Error {
  status: number;

  constructor(status: number, message = 'Upstream service failed') {
    super(message);
    this.name = 'UpstreamApiError';
    this.status = status;
  }
}

const statusFromUpstream = (status: number) => {
  if (status === 404) {
    return 404;
  }

  if (status >= 400 && status < 500) {
    return 400;
  }

  return 502;
};

const messageFromStatus = (status: number) => {
  if (status === 404) {
    return 'Resource not found';
  }

  if (status >= 400 && status < 500) {
    return 'Invalid upstream request';
  }

  return 'Upstream service failed';
};

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

  let response: Response;

  try {
    response = await fetch(url, {
      headers: requestHeaders,
    });
  } catch (error) {
    throw new UpstreamApiError(502);
  }

  if (!response.ok) {
    const status = statusFromUpstream(response.status);
    throw new UpstreamApiError(status, messageFromStatus(response.status));
  }

  return response.json() as Promise<T>;
}

/**
 * Performs a POST request against the configured upstream API.
 */
export async function postCatalogApi<T>(path: string, data: unknown): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  let response: Response;

  const { headers, ...body } = data as {headers?: Record<string, string>};

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        ...requestHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new UpstreamApiError(502);
  }

  if (!response.ok) {
    const status = statusFromUpstream(response.status);
    throw new UpstreamApiError(status, messageFromStatus(response.status));
  }

  return response.json() as Promise<T>;
}
