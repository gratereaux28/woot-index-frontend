/**
 * Central Modern.js configuration for the frontend app and its BFF routes.
 */
import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { env } from 'process';

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; frame-ancestors 'none'; form-action 'self';",
};

export default defineConfig({
  server: {
    port: env.PORT ? parseInt(env.PORT) : 3300,
  },
  output: {
    copy: [
      {
        from: 'server/modern.server.js',
        to: 'server/modern.server.js',
      },
    ],
    sourceMap: {
      js: false,
      css: false,
    },
  },
  dev: {
    server: {
      headers: securityHeaders,
    },
  },
  plugins: [appTools(), bffPlugin()],
});
