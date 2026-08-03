// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://danialamin.com',
  trailingSlash: 'never',

  // Every page stays prerendered. Only /api/unlock opts into server rendering
  // (via `export const prerender = false`), because the confidential cases must
  // never exist in a static file that anyone can fetch.
  adapter: node({ mode: 'standalone' }),
});
