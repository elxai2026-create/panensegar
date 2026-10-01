## 9. Arsitektur Teknis

### 9.1 Stack

| Lapisan | Teknologi | Versi |
| --- | --- | --- |
| Framework | Astro (static output) | 7.3.5 |
| Bahasa | TypeScript (strict) | — |
| Styling | Tailwind CSS + `@tailwindcss/vite` | 4.3.3 |
| CMS | Sveltia CMS (via CDN script) | — |
| Content | Astro Content Layer (glob loader + Zod) | — |
| Sitemap | `@astrojs/sitemap` | 3.7.4 |
| Typecheck | `@astrojs/check` | — |

Runtime = tidak ada. Output build = direktori statis `dist/`.

### 9.2 Struktur Direktori

```
.
├── prd.md                     # dokumen ini (gabungan section)
├── prd_sections/              # sumber per-bagian PRD
├── astro.config.mjs           # Astro + Tailwind + sitemap
├── package.json
├── public/
│   ├── admin/
│   │   ├── index.html         # entry point Sveltia CMS
│   │   └── config.yml         # definisi koleksi & field CMS
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── assets/
    │   ├── brand/             # logo.svg, hero.jpg, farm.jpg
    │   └── products/          # 13 foto produk (.jpg)
    ├── components/
    │   ├── BaseLayout.astro   # shell halaman (root layout)
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── FloatingWA.astro
    │   ├── WAButton.astro     # CTA WhatsApp (tombol berlabel)
    │   ├── WaIcon.astro       # ikon WA (inline SVG)
    │   ├── ProductCard.astro
    │   ├── SectionHeading.astro
    │   └── Breadcrumb.astro
    ├── content.config.ts      # skema content collection
    ├── data/
    │   ├── products/          # 13 berkas JSON
    │   ├── categories/        # 5 berkas JSON
    │   └── site/profile.json
    ├── layouts/
    │   └── BaseLayout.astro
    ├── lib/
    │   ├── catalog.ts         # query & agregasi produk
    │   ├── format.ts          # format harga & tanggal
    │   ├── schema.ts          # pembangun JSON-LD
    │   └── whatsapp.ts        # helper tautan WA
    ├── pages/
    │   ├── index.astro        # P-01 Beranda
    │   ├── 404.astro          # P-06 Not Found
    │   ├── tentang-kami.astro# P-05 Tentang Kami
    │   ├── produk/
    │   │   ├── index.astro    # P-02 Katalog
    │   │   └── [slug].astro   # P-03 Detail Produk
    │   └── kategori/
    │       └── [kategori].astro # P-04 Kategori
    └── styles/global.css
```

### 9.3 Model Konfigurasi (`astro.config.mjs`)

| Setting | Nilai | Alasan |
| --- | --- | --- |
| `output` | `static` | Hosting statis, tanpa server |
| `site` | `process.env.SITE_URL \|\| default` | Canonical & sitemap; default = contoh |
| `trailingSlash` | `never` | URL bersih tanpa slash akhir |
| `build.format` | `directory` | `/produk/bayam/` → file `dist/produk/bayam/index.html` |
| `integrations` | `sitemap()` | Sitemap otomatis |
| `vite.plugins` | `tailwindcss()` | Tailwind v4 via plugin Vite |

### 9.4 Alur Render (SSG)

1. Astro membaca `src/content.config.ts` → memuat & memvalidasi seluruh JSON.
2. Zod menolak data invalid → build gagal (feedback cepat untuk data salah).
3. `getStaticPaths()` pada halaman dinamis memetakan id → params (produk, kategori).
4. Astro membangun HTML statis untuk setiap rute dan memproses `src/assets` → `.webp` via optimizing.
5. `@astrojs/sitemap` menulis `sitemap-index.xml` ke `dist/`.

### 9.5 Strategi Aset Gambar

- **Aset statis** (`src/assets/`): logo, hero, farm, foto produk. Diproses Astro (hash filename, konversi `.webp`).
- **Aset passthrough** (`public/`): favicon, robots.txt, admin (harus tetap bisa diakses lewat path tetap, tidak di-hash).
- Foto produk: JPG beresolusi ~1200px sisi panjang, dipotong `object-cover` ke rasio 1:1 pada kartu.

### 9.6 Optimasi Ikon (best practice yang dianut)

`WaIcon.astro` menerima prop `class` dan menerapkannya via `class:list` (Astro meneruskan `class` sebagai prop bernama `class`). Ukuran ikon lewat `em` (`1.15em`) sehingga otomatis mengikuti `text-*` tombol. Ini mencegah bug klasik: ikon `<svg>` tanpa dimensi yang membesar tak terukur. Semua tombol WA memakai `WAButton` (kecuali link langsung minimal di header, yang tetap menyertakan ikon).
