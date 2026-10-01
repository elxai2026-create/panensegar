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
  // Cloudflare Pages menyajikan berkas dari folder sebagai /path/ dan
  // me-redirect /path ke /path/. Setting 'always' membuat canonical link
  // dan sitemap memakai bentuk yang sama dengan yang benar-benar dilayani,
  // sehingga tidak ada satu pun URL sitemap yang kena redirect.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});