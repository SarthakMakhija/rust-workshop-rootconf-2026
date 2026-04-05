import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://tech-lessons.in',
  base: '/rust-workshop-2026/',
  integrations: [react()],
});
