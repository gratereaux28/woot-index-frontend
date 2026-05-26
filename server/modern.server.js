const API_BASE_URL = process.env.WOOT_INDEX_API_BASE_URL || 'http://localhost:3200';
const API_ADMIN_KEY = process.env.WOOT_INDEX_API_ADMIN_KEY ?? '';

const trackInvalidUrl = (path, url, headers) => {
  const apiUrl = new URL('/analytics/events', API_BASE_URL);
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      ...(API_ADMIN_KEY ? { 'X-Admin-Key': API_ADMIN_KEY } : {}),
    },
    body: JSON.stringify({ event: 'invalid_url', path, metadata: { url } }),
  }).catch(() => {});
};

const knownHtmlRoutes = new Set(['/', '/about', '/privacy', '/notfound']);

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'sha256-lH1cCoF8GR750pv/D7CtzWUKhEuepfCU9LxDg6p+mJs=' https://static.cloudflareinsights.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss: https://cloudflareinsights.com; frame-ancestors 'none'; form-action 'self';",
};

const applySecurityHeaders = response => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

const securityMiddleware = async (c, next) => {
  if (c.req.path.endsWith('.map')) {
    return applySecurityHeaders(new Response('Not found', { status: 404 }));
  }

  const acceptsHtml = c.req.header('accept')?.includes('text/html') ?? false;
  const looksLikeWellKnownRequest = c.req.path.startsWith('/.well-known/');
  const looksLikePageRequest =
    acceptsHtml || looksLikeWellKnownRequest || (!c.req.path.startsWith('/api') && !c.req.path.includes('.'));
  const shouldReturnNotFound = looksLikePageRequest && !knownHtmlRoutes.has(c.req.path);

  if (shouldReturnNotFound) {
    for (const header of ['cf-connecting-ip', 'cf-ipcountry', 'x-forwarded-for', 'user-agent', 'referer']) {
      const value = c.req.header?.[header];
      if (value) cfHeaders[header] = value;
    }

    trackInvalidUrl(
      c.req.path,
      c.req.url,
      cfHeaders,
    );

    return Response.redirect(new URL('/notfound', c.req.url), 302);
  }

  await next();
  applySecurityHeaders(c.res);
};

export default {
  middlewares: [
    {
      name: 'security-middleware',
      handler: securityMiddleware,
    },
  ],
};
