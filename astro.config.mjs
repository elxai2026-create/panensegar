// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config

/**
 * URL kanonik produksi. Dipakai untuk canonical link, Open Graph, dan sitemap,
 * jadi harus sama persis dengan domain yang dipakai saat deploy.
 * Override dengan environment variable SITE_URL bila perlu (mis. pratinjau).
 */
const SITE_URL = process.env.SITE_URL ?? 'https://panensegar.jamesq.my.id';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});