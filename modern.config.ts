/**
 * Central Modern.js configuration for the frontend app and its BFF routes.
 */
import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { env } from 'process';

export default defineConfig({
  server: {
    port: env.PORT ? parseInt(env.PORT) : 3300,
  },
  dev: {
    server: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy':
          "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; frame-ancestors 'none';",
      },
    },
  },
  plugins: [appTools(), bffPlugin()],
});
