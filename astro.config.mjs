import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tech-lessons.in',
  base: '/rust-workshop-2026/',
  integrations: [react(), sitemap()],
});
