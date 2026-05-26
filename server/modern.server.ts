import type { Context, MiddlewareHandler, Next } from 'hono';

const knownHtmlRoutes = new Set(['/', '/about', '/privacy']);

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; frame-ancestors 'none'; form-action 'self';",
};

const applySecurityHeaders = (response: Response): Response => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

const securityMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
  if (c.req.path.endsWith('.map')) {
    return applySecurityHeaders(new Response('Not found', { status: 404 }));
  }

  const acceptsHtml = c.req.header('accept')?.includes('text/html') ?? false;
  const looksLikeWellKnownRequest = c.req.path.startsWith('/.well-known/');
  const looksLikePageRequest =
    acceptsHtml || looksLikeWellKnownRequest || (!c.req.path.startsWith('/api') && !c.req.path.includes('.'));
  const shouldReturnNotFound = looksLikePageRequest && !knownHtmlRoutes.has(c.req.path);

  if (shouldReturnNotFound) {
    return applySecurityHeaders(new Response('Not found', { status: 404 }));
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
