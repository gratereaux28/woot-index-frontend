import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { env } from 'process';

export default defineConfig({
  server: {
    port: env.PORT ? parseInt(env.PORT) : 3300,
  },
  plugins: [appTools(), bffPlugin()],
});
