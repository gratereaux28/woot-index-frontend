import type { MiddlewareHandler } from 'hono';
import type { ServerConfig } from '@modern-js/server-core';

const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next();
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; frame-ancestors 'none';",
  );
};

export default {
  middlewares: [
    {
      name: 'security-headers',
      handler: securityHeaders,
    },
  ],
} satisfies ServerConfig;
