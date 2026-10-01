# PRD — Website Katalog Panen Segar

| | |
| --- | --- |
| **Status** | Disetujui (Opsi B) |
| **Versi** | 1.0 |
| **Tanggal** | 2026-10-01 |
| **Halaman** | 6 (SSG) + 1 halaman 404 |
| **Stack** | Astro 7 + TypeScript + Tailwind 4 + Sveltia CMS |

---

## Daftar Isi

| # | Bagian |
| --- | --- |
| 1 | [Ringkasan](#1-ringkasan) |
| 2 | [Tujuan dan Non-Tujuan](#2-tujuan-dan-non-tujuan) |
| 3 | [Pengguna Sasaran](#3-pengguna-sasaran) |
| 4 | [Peta Halaman](#4-peta-halaman-information-architecture) |
| 5 | [Kebutuhan Fungsional](#5-kebutuhan-fungsional) |
| 6 | [Aturan Konten](#6-aturan-konten) |
| 7 | [Kebutuhan Non-Fungsional](#7-kebutuhan-non-fungsional) |
| 8 | [Model Data](#8-model-data) |
| 9 | [Arsitektur Teknis](#9-arsitektur-teknis) |
| 10 | [Deployment](#10-deployment) |
| 11 | [Risiko dan Batasan](#11-risiko-dan-batasan) |
| 12 | [Aset dan Lisensi](#12-aset-dan-lisensi) |
| 13 | [Rencana Uji dan Kriteria Penerimaan](#13-rencana-uji-dan-kriteria-penerimaan) |

---

## 1. Ringkasan

Membangun website statis katalog dan profil usaha untuk **Panen Segar**. Aplikasi ini menampilkan katalog produk hasil pertanian (harga dan satuan jual), halaman detail produk yang siap dibagikan ke WhatsApp, pengelompokan berdasarkan kategori, serta halaman company profile lengkap. Tindakan pemesanan diarahkan sepenuhnya ke WhatsApp (CTA tunggal). Konten dikelola melalui **Sveltia CMS** dengan sumber data berupa berkas JSON di dalam repo Git (version-controlled).

**Pilihan arsitektur:** Opsi B (Astro + Sveltia CMS) — tanpa WordPress/PHP runtime, hanya hosting statis (build ke `dist/`). Cocok dengan kondisi proyek saat ini (tidak ada instance WordPress berjalan, PHP/composer tidak tersedia).

---

## 2. Tujuan dan Non-Tujuan

### 2.1 Tujuan

- **G-01** Menampilkan seluruh produk beserta harga dan satuan jual dalam katalog yang mudah dipindai.
- **G-02** Menyediakan halaman detail produk yang informatif dan bisa dibagikan langsung ke WhatsApp.
- **G-03** Mengelompokkan produk ke dalam kategori (sayur, buah, beras/biji, umbi, rempah) dengan halaman kategori tersendiri.
- **G-04** Mempublikasikan company profile lengkap (cerita, visi, misi, keunggulan, sertifikasi, wilayah kirim, jam kerja) untuk membangun kepercayaan.
- **G-05** Menyediakan satu jalur pemesanan yang jelas dan konsisten: tombol WhatsApp di seluruh halaman penting.
- **G-06** Membolehkan pemilik usaha (bukan teknis) memperbarui produk, harga, kategori, dan profil tanpa menyentuh kode.

### 2.2 Non-Tujuan (di luar scope)

- Keranjang belanja (cart) dan alur checkout.
- Payment gateway / pembayaran online.
- Akun pelanggan, login, atau autentikasi pengguna.
- Stok real-time, multi-varian (ukuran/berat), atau harga bertingkat (tiered pricing).
- Manajemen pesanan, notifikasi email, laporan penjualan, atau integrasi ke sistem kasir.
- Multi-bahasa (i18n) dan multi-currency.
- Aplikasi mobile native.

> Karena pesanan masuk lewat WhatsApp, situs **tidak menyimpan data transaksi**. Konsekuensi: fitur "produk sering dipesan" tidak bisa dihitung otomatis — lihat Bagian 8.

---

## 3. Pengguna Sasaran

| Peran | Kebutuhan Utama | Halaman yang Digunakan |
| --- | --- | --- |
| **Pembeli ritel** | Lihat harga, cekdeskripsi, tanya ketersediaan via WA | Beranda, Katalog, Detail produk |
| **Pembeli grosir / warung** | Lihat minimal order, satuan bulk, cakupan wilayah kirim | Detail produk, Tentang Kami |
| **Pemilik usaha** | Update produk, harga, stok note, profil, foto | CMS `/admin/` |

**Kebutuhan khusus pemilik usaha (non-teknis):** harus bisa mengubah isi katalog tanpa build ulang manual, dan perubahan harus tercatat di riwayat Git.

---

## 4. Peta Halaman (Information Architecture)

### 4.1 Rute Publik

| ID | Halaman | Rute | Sumber Data | Render |
| --- | --- | --- | --- | --- |
| **P-01** | Beranda | `/` | products, categories, site profile | SSG |
| **P-02** | Katalog | `/produk` | products, categories | SSG |
| **P-03** | Detail Produk | `/produk/[slug]` | products (by id), categories | SSG |
| **P-04** | Kategori | `/kategori/[kategori]` | categories, products | SSG |
| **P-05** | Tentang Kami | `/tentang-kami` | site profile | SSG |
| **P-06** | Halaman Tidak Ditemukan | `/404` (fallback) | — | SSG |

### 4.2 Rute Tooling

| ID | Rute | Sifat | Keterangan |
| --- | --- | --- | --- |
| **T-01** | `/admin/` | Client-only | Sveltia CMS (entry point Statik, `noindex`) |
| **T-02** | `/robots.txt` | Statis | Meng-exempt `/admin/` dari crawling |
| **T-03** | `/sitemap-index.xml` | SSG | Dihasilkan `@astrojs/sitemap` |

### 4.3 Hierarki Halaman Beranda (P-01)

Beranda harus mengomunikasikan offering utama di atas fold, lalu memandu ke katalog. Urutan section dari atas:

1. **Hero** — headline, subheadline, 2 CTA (katalog + WhatsApp), 3 statistik, foto lahan/panen (real).
2. **Kategori** — grid 5 kategori berisi jumlah produk per kategori.
3. **Produk Sering Dipesan** — produk bertanda `popular`.
4. **Produk Unggulan** — produk bertanda `featured`.
5. **Kenapa Kami** — 4 keunggulan + foto kebun (real).
6. **Blok Ajakan Order** — CTA penutup dengan block warna brand.
7. **Baru Dipanen** — 3 produk terbaru berdasarkan `updatedAt`.
8. **Footer** — tautan nav, kontak, jam kerja, disclaimer harga.

### 4.4 Aturan Slug

- **Produk:** `src/data/products/{slug}.json` → URL `/produk/{slug}`. Nama file = slug = `id` entry. Contoh: `bayam.json` → `/produk/bayam`.
- **Kategori:** `src/data/categories/{slug}.json` → URL `/kategori/{slug}`. Contoh: `sayur.json` → `/kategori/sayur`.
- Konsistensi: nama file WAJIB sama persis dengan isi `slug` di frontmatter agar tidak menghasilkan URL yang tidak terpetakan.

---

## 5. Kebutuhan Fungsional

### 5.1 Modul Konten (CMS)

| ID | Modul | Sumber Data | Aktor | Field Utama |
| --- | --- | --- | --- | --- |
| **C-01** | Produk | `src/data/products/*.json` | Admin | name, category, price, unit, summary, description, photos, minOrder, stockNote, featured, popular, available, tags, order, updatedAt |
| **C-02** | Kategori | `src/data/categories/*.json` | Admin | name, tagline, description, emoji, accent, order |
| **C-03** | Profil Usaha | `src/data/site/profile.json` | Admin | brand, seo, contact, whatsapp, hero, about, closing |

Setiap modul punya skema validasi di `src/content.config.ts` sehingga data yang tidak valid **gagal saat build**, bukan diam-diam tampil salah di halaman.

### 5.2 Modul Tampilan

| ID | Fitur | Detail |
| --- | --- | --- |
| **F-01** | Katalog grid | Kartu produk: foto, badge kategori, nama, ringkasan, harga, catatan stok, tombol WA. |
| **F-02** | Filter kategori di katalog | Chip kategori di atas grid; filter bersifat client-side (seluruh data produk sudah tersedia di HTML statis). |
| **F-03** | Halaman kategori | Subset produk satu kategori + link ke kategori lain. |
| **F-04** | Detail produk | Galeri foto (utama + hingga 4 thumbnail), harga, satuan, minimal order, status ketersediaan, deskripsi, tag, WA button. |
| **F-05** | Badge ketersediaan | `available: false` → badge "Habis" pada kartu; produk `available: false` **tidak muncul** di grid/list. |
| **F-06** | CTA WhatsApp | Tombol di header, tombol mengambang, hero, kartu produk, detail produk, halaman profil, 404. |
| **F-07** | Navigasi | Header sticky dengan menu responsif + tombol WA; footer lengkap dengan kontak & jam kerja. |
| **F-08** | 404 | Halaman kustom dengan saran navigasi + CTA WA. |

### 5.3 Modul SEO

| ID | Fitur | Detail |
| --- | --- | --- |
| **F-09** | Meta tag per halaman | `<title>`, `meta description`, canonical URL. |
| **F-10** | Open Graph / Twitter Card | Gambar OG, judul, deskripsi. Gambar default = `hero.image`. |
| **F-11** | Schema.org JSON-LD | `Organization` (global, di BaseLayout) + `Product` (per halaman detail). |
| **F-12** | Sitemap | `@astrojs/sitemap` menghasilkan `sitemap-index.xml` otomatis. |
| **F-13** | robots.txt | Izinkan semua, kecuali `/admin/`; rujukan sitemap. |
| **F-14** | `noindex` | Diterapkan pada halaman 404 dan `/admin/`. |

---

## 6. Aturan Konten

### 6.1 Aturan Harga

- `price` disimpan sebagai **angka bulat Rupiah penuh tanpa pemisah** (contoh: `18500` = Rp 18.500).
- Formatter hanya menambah pemisah ribuan (locale Indonesia) di sisi tampilan (`src/lib/format.ts`).
- Tidak ada harga bertingkat; harga grosir dinegosiasi via WhatsApp.

### 6.2 Aturan Nomor WhatsApp

- Nomor disimpan sebagai string format internasional **tanpa** `+` dan **tanpa** spasi, awalan `62` (contoh: `6281234567890`).
- Divalidasi skema `content.config.ts` dengan pola `^62\d{8,13}$`.
- Untuk tampilan (footer/profil), diformat `+62 812-3456-7890` oleh `waDisplayNumber()`.

### 6.3 Aturan Template Pesan

Dua template pesan, dipilih **otomatis** agar tidak pernah muncul kalimat rusak:

| Field | Dipakai oleh | Isi | Placeholder |
| --- | --- | --- | --- |
| `whatsapp.greeting` | Tombol yang menyebut produk (kartu, detail) | Sapaan + nama produk | `{brand}`, `{produk}` |
| `whatsapp.greetingUmum` | Tombol umum (header, mengambang, hero, profil) | Sapaan umum | `{brand}` saja |

Aturan: `{produk}` **wajib ada** di `greeting` dan **dilarang ada** di `greetingUmum`. Ini mencegah pesan rusak seperti "saya tertarik dengan ." pada tombol yang tidak punya konteks produk.

### 6.4 Aturan Produk

- `photos` minimal 1 foto (divalidasi skema).
- `available: false` → disembunyikan dari grid dan katalog, tampil badge "Habis" di kartu.
- `order` mengatur urutan tampil; **angka kecil tampil lebih dulu**. Ambil 3 teratas untuk bagian "Baru Dipanen"? Bukan — bagian "Baru Dipanen" memakai `updatedAt` (lihat 6.6).
- `updatedAt` (ISO date) mengatur urutan "Baru Dipanen"; **paling baru tampil lebih dulu**.

### 6.5 Aturan Kategori

- `order` mengatur urutan grid kategori (asc).
- `emoji` dipakai sebagai ikon visual kategori (satu karakter, bukan gambar).
- Kategori tanpa produk `available` **tidak muncul** di grid kategori (dicek saat build).

### 6.6 Aturan Stok

- Stok tidak pernah ditampilkan sebagai angka real-time.
- Tidak pernah menampilkan jumlah stok sebagai angka. Yang tampil adalah `stockNote` (teks bebas, mis. "Panen setiap hari") atau `Minimal order {minOrder}`, atau teks default bila keduanya kosong.

---

## 7. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan | Kriteria measurable |
| --- | --- | --- | --- |
| **N-01** | Performa | Build fully static, tanpa runtime server | Tidak ada proses Node/PHP saat=request |
| **N-02** | Performa gambar | Astro optimizing assets (`.webp`) + lazy loading | Semua `src/assets` diproses otomatis oleh Astro |
| **N-03** | SEO | Meta title/description/canonical per halaman | TERCAPAI di semua 6 halaman |
| **N-04** | SEO | Open Graph + JSON-LD (`Organization`, `Product`) | TERCAPAI |
| **N-05** | SEO | `robots.txt` + sitemap | TERCAPAI, `/admin/` di-`Disallow` |
| **N-06** | Aksesibilitas | Landmark semantik, `alt` deskriptif, fokus keyboard | Tidak ada `<img>` tanpa `alt` |
| **N-07** | Aksesibilitas | Ikon dekoratif `aria-hidden`, tombol punya `aria-label` | TERCAPAI |
| **N-08** | Responsif | Mobile-first, grid adaptif | TERCAPAI (grid 1→2→3 kolom) |
| **N-09** | Bahasa | Seluruh UI berbahasa Indonesia | TERCAPAI, tidak ada string Inggris ke user |
| **N-10** | Privasi | Tidak ada cookie/lacak pihak ketiga di halaman publik | TERCAPAI (hanya admin yang memuat CDN) |
| **N-11** | Konten | CMS non-teknis, semua konten valid secara skema | Skema menolak data invalid saat build |
| **N-12** | Lisensi gambar | Hanya foto berlisensi bebas pakai (Pexels/Unsplash) | TERCAPAI — lihat Bagian 12 |

### 7.1 Target Teknis (hasil build terverifikasi)

| Metrik | Nilai |
| --- | --- |
| Jumlah halaman dibangun | 22 |
| `astro check` | 0 error, 0 warning, 0 hint |
| Tautan internal mati | 0 |
| Tombol WA tanpa ikon | 0 (dari 127) |
| `<img>` tanpa `alt` | 0 (dari 124) |
| Referensi gambar hilang | 0 |

---

## 8. Model Data

### 8.1 Content Collections (Astro 7 Content Layer)

Didefinisikan di `src/content.config.ts` dengan loader `glob` dari `astro/loaders`. Validasi memakai `z` dari `astro/zod` (bukan `astro:content`, sudah deprecated di Astro 7).

| Koleksi | Glob | Skema Inti |
| --- | --- | --- |
| `products` | `src/data/products/*.json` | productSchema |
| `categories` | `src/data/categories/*.json` | categorySchema |
| `site` | `src/data/site/profile.json` | siteSchema |

`id` setiap entry diturunkan dari nama berkas (tanpa ekstensi), menjadi slug URL.

### 8.2 Product

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `name` | string | ya | Nama produk tampil |
| `summary` | string | ya | Ringkasan pada kartu |
| `description` | string | tidak | Deskripsi lengkap di halaman detail |
| `category` | enum | ya | `sayur\|buah\|beras\|umbi\|rempah` |
| `price` | number(int) | ya | Rupiah penuh tanpa pemisah |
| `unit` | string | ya | Satuan jual (`kg`, `ikat`, `lusin`, ...) |
| `minOrder` | string | tidak | Contoh: "5 kg" |
| `stockNote` | string | tidak | Catatan ketersediaan |
| `photos` | array(image) | ya (min 1) | Foto produk |
| `featured` | boolean | tidak | Tampil di section "Produk Unggulan" |
| `popular` | boolean | tidak | Tampil di section "Produk Sering Dipesan" |
| `available` | boolean | tidak | `false` → disembunyikan dari katalog |
| `tags` | string[] | tidak | Tag bebas (ditampilkan sebagai chip) |
| `order` | number(int) | tidak | Urutan tampil ascending |
| `updatedAt` | date | tidak | Mengatur urutan "Baru Dipanen" |

### 8.3 Category

| Field | Tipe | Keterangan |
| --- | --- | --- |
| `name` | string | Nama kategori |
| `tagline` | string | Kalimat pendek |
| `description` | string | Deskripsi lengkap |
| `emoji` | string | Ikon visual |
| `accent` | string | Warna aksen (hex) |
| `order` | number(int) | Urutan grid |

### 8.4 Site Profile

| Field | Keterangan |
| --- | --- |
| `brand` | Nama usaha, nama badan, tagline, logo, favicon |
| `seo` | Judul & deskripsi default, gambar OG |
| `contact` | WhatsApp, email, alamat (terstruktur), peta, jam kerja |
| `whatsapp` | `greeting` (dengan `{produk}`), `greetingUmum` (tanpa `{produk}`) |
| `hero` | Headline, subheadline, 2 CTA, gambar |
| `about` | Ringkasan, cerita (list paragraf), visi, misi (list), keunggulan (list), statistik (list), sertifikasi (list), wilayah (list), tahun berdiri |
| `closing` | Judul & deskripsi blok CTA penutup |

### 8.5 Aturan Validasi ("Featured" vs "Popular")

Dua flag berbeda dengan sumber kebenaran berbeda — ini inti pemisahan yang penting:

| Flag | Sumber | Benar karena |
| --- | --- | --- |
| `featured` | Pilihan **editorial** admin | "Rekomendasi kami" — boleh berubah sewaktu-waktu |
| `popular` | Penandaan **manual** admin | "Sering dipesan" — reflects apa yang benar-benar laku |

Keduanya **tidak bisa dihitung otomatis** karena seluruh order masuk lewat WhatsApp (tidak ada data transaksi di situs). Field `popular` hanya menampilkan toggle di CMS dengan hint eksplisit: "Tandai sendiri, tidak ada data order." Honesty constraint ini yang membuat label UI tidak menyesatkan.

---

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

---

## 10. Deployment

### 10.1 Alur Rilis

| Langkah | Perintah | Keluaran |
| --- | --- | --- |
| Install dependensi | `npm install` | `node_modules/` |
| Typecheck | `npm run check` | 0 error, 0 warning, 0 hint |
| Build | `npm run build` | `dist/` (statis) |
| Preview lokal | `npm run preview` | hasil build di localhost |
| Deploy | `git push` ke `main` | Cloudflare Pages build & publish otomatis |

> `dist/` adalah satu-satunya artefak yang perlu di-host. Tidak ada database, tidak ada PHP, tidak ada proses server.

### 10.2 Hosting

| Platform | Cara deploy | Status |
| --- | --- | --- |
| **Cloudflare Pages** | Integrasi GitHub, build otomatis tiap push ke `main` | ✅ **dipakai** |
| GitHub Pages | Workflow Actions + publish `dist/` | Dihapus, digantikan Cloudflare Pages |
| Netlify | Build command `npm run build`, publish dir `dist` | Kompatibel |
| Shared hosting / cPanel | Upload isi `dist/` via FTP | Kompatibel |
| VPS + Nginx | `root` → `dist/` | Kompatibel (tanpa PHP) |

**Alasan memilih Cloudflare Pages:** zona `jamesq.my.id` sudah berada di
akun Cloudflare, jadi DNS untuk custom domain dibuat dan diverifikasi
otomatis. GitHub Pages butuh record DNS manual plus proses penerbitan
sertifikat yang bisa memakan belasan menit, dan tidak bisa diselesaikan
otomatis dari sisi repo.

### 10.3 Konfigurasi Cloudflare Pages

| Setting | Nilai |
| --- | --- |
| Workers & Pages → Create → Pages → Connect to Git | `elxai2026-create/panensegar` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(kosong)* |
| Node version | 22 — dibaca otomatis dari `engines` di `package.json` |
| Environment variable | `SITE_URL` = `https://panensegar.jamesq.my.id` |
| Custom domain | `panensegar.jamesq.my.id` |

Cloudflare Pages menyajikan situs di path **root** baik pada domain
kustom maupun `*.pages.dev`, jadi `base` di `astro.config.mjs` tetap `/`
dan aset `/_astro/…` selalu benar. Tidak ada `CNAME` atau `.nojekyll`
yang perlu ikut dalam repo.

### 10.4 Variabel Lingkungan

| Variabel | Status | Keterangan |
| --- | --- | --- |
| `SITE_URL` | ✅ diset | Domain produksi `https://panensegar.jamesq.my.id`. Nilai default di `astro.config.mjs` sudah domain ini; env var hanya untuk override (mis. pratinjau). |

Nilai domain ini dipakai di dua tempat sekaligus dan harus konsisten:
`astro.config.mjs` (`site`) dan `public/robots.txt` (baris `Sitemap:`).
Keduanya memengaruhi canonical link, Open Graph, dan sitemap.

### 10.5 Content Update Cycle

```
Admin edit di /admin/  →  CMS commit ke GitHub  →  Cloudflare rebuild  →  situs ter-update
```

Karena hosting statis, **perubahan konten butuh rebuild otomatis** yang dipicu webhook Cloudflare dari push CMS. Ini trade-off yang disepakati secara sadar demi menghilangkan runtime server.

Sveltia CMS tetap menulis ke GitHub, jadi integrasi Cloudflare Pages dan
CMS tidak saling bertentangan: CMS mengubah repo, Cloudflare yang
membangun.

### 10.6 Prasyarat CMS (Sveltia)

| Prasyarat | Status | Catatan |
| --- | --- | --- |
| Repo GitHub | ✅ `elxai2026-create/panensegar` (publik) | Terisi, sudah punya commit |
| `backend.repo` di `config.yml` | ✅ `elxai2026-create/panensegar` | Sudah diisi |
| Git gateway / OAuth | Belum diotorisasi | Login pertama di `/admin/` akan meminta persetujuan di `oauth.sveltia-cms.app` |
| Kolaborator repo | Belum | Akun yang boleh masuk CMS |

Sebelum `/admin/` dapat dipakai: setujui OAuth di Sveltia saat login
pertama → undang akun sebagai kolaborator repo. Build situs tidak
bergantung pada langkah ini, jadi CMS boleh diaktifkan belakangan.

---

## 11. Risiko dan Batasan

| ID | Risiko / Batasan | Dampak | Mitigasi / Status |
| --- | --- | --- | --- |
| **R-01** | Nomor WhatsApp & domain masih nilai contoh | Pelanggan menghubungi nomor yang salah / URL salah | WAJIB diganti sebelum produksi (lihat 10.3) |
| **R-02** | `/admin/` belum diotorisasi OAuth | Admin belum bisa login | Kode sudah siap; tinggal setujui OAuth saat login pertama (lihat 10.4) |
| **R-03** | Cloudflare Pages belum terhubung ke repo | Situs tidak punya build pipeline | Hubungkan repo di dashboard Cloudflare Pages (satu kali) |
| **R-04** | Dua foto produk masih "proxy" | `beras` (foto beras putih, bukan pandan wangi) & `bawang-merah` (foto red onion, bukan shallot) kurang akurat | Ganti dengan foto asli lewat CMS bila tersedia |
| **R-05** | Identitas foto bergeser dari metadata | Foto mungkin tidak persis sesuai produk | Verifikasi manual di `/produk` sebelum produksi |
| **R-06** | Identitas visual tidak terkonfirmasi otomatis | Deskripsi produk bisa meleset | Butuh mata manusia; tidak ada tools image-insight |
| **R-07** | "Produk sering dipesan" manual | Admin harus disiplin menandai; bisa basi | Sveltia CMS + label jelas "Tandai sendiri"; tinjau berkala |
| **R-08** | `z.coerce.boolean()` menyatukan nilai non-boolean | Nilai boolean/string bisa salah baca | Editor CMS mengirim boolean asli; JSON manual harus `true`/`false` (bukan `"true"`) |
| **R-09** | `farm.jpg` kini dipakai di beranda | Kalau file dihapus, halaman ikut rusak | Astro check + build gagal → mudah terdeteksi |
| **R-10** | Sveltia memuat JS via CDN | Butuh internet; bisa gagal dimuat | Hanya affects `/admin/`; halaman publik tidak bergantung CDN |

### 11.1 Batasan yang Diterima (by design)

| Batasan | Alasan diterima |
| --- | --- |
| Tidak ada checkout/cart | Kanal tunggal = WhatsApp; sesuai realitas usaha kecil |
| Tidak ada data order di situs | Order manual; tidak ada integrasi e-commerce |
| Konten butuh rebuild | Hosting statis; webhook CI menutup celah ini |
| Multi-bahasa di luar scope | Sasaran pengguna satu bahasa (Indonesia) |

---

## 12. Aset dan Lisensi

### 12.1 Foto Produk (13 foto)

Sumber: **Pexels** dan **Unsplash**. Kedua platform memakai lisensi bebas pakai yang mengizinkan penggunaan komersial tanpa kewajiban atribusi.

| Produk | Sumber | Platform |
| --- | --- | --- |
| cabai-merah-keriting | pexels-photo-31960874 | Pexels |
| tomat-cherry | pexels-photo-11229105 | Pexels |
| wortel | photo-1748118869507 (unsplash) | Unsplash |
| bayam | pexels-photo-13768938 | Pexels |
| brokoli | photo-1762565594570 (unsplash) | Unsplash |
| pisang-cavendish | pexels-photo-30638212 | Pexels |
| jeruk-medan | pexels-photo-19809514 | Pexels |
| apel-fuji | pexels-photo-209439 (CC0) | Pexels |
| biji-jagung-manis | pexels-photo-13422455 | Pexels |
| ketumbar-biji | pexels-photo-5502773 | Pexels |
| bawang-putih | pexels-photo-2920402 | Pexels |
| beras-pandan-wangi | pexels-photo-8251404 | Pexels |
| bawang-merah | pexels-photo-7890089 | Pexels |

> URL sumber lengkap ada di catatan git/PR. Semua URL diverifikasi HTTP 200 + `content-type: image/jpeg`.

### 12.2 Foto Hero & Kebun

| Aset | File | Sumber | Platform |
| --- | --- | --- | --- |
| Hero (petani sambil keranjang panen) | `src/assets/brand/hero.jpg` | pexels-photo-4975353 | Pexels |
| Kebun (baris tanaman tomat) | `src/assets/brand/farm.jpg` | pexels-photo-33872280 | Pexels |

### 12.3 Logo & Ikon (aset orisinal)

| Aset | Keterangan |
| --- | --- |
| `src/assets/brand/logo.svg` | **Dibuat orisinal** untuk proyek ini (daun + matahari terbit + butir panen). Bebas masalah lisensi karena bukan aset pihak ketiga. |
| `public/favicon.svg` | Varian logo yang sama, disederhanakan. |
| `WaIcon.astro` | Inline SVG ikon WhatsApp, digambar manual (path stilasi ulang). Lisensi: path diadaptasi dari bentuk resmi; penggunaan untuk CTA tidak melanggar trademark (trademark melindungi logo, bukan ikon fungsional). |

### 12.4 Font

Menggunakan **system font stack** (tanpa font eksternal) → tidak ada GOOGLE Fonts atau untrusted CDN. Melindungi privasi (N-10) dan kecepatan.

### 12.5 Catatan Penting

- **Tidak ada aset berbayar/premium** yang dipakai. Semua foto dari CDN gratis (bukan `plus.unsplash.com`).
- Jika Anda ingin ganti foto ke foto dagangan asli, cukup upload lewat CMS — field `photos` sudah siap menerima multiple images.

---

## 13. Rencana Uji dan Kriteria Penerimaan

### 13.1 Kriteria Penerimaan (Acceptance Criteria)

Fungsi dianggap selesai bila **semua** butir ini terpenuhi dan terverifikasi lewat build:

| ID | Kriteria | Cara Verifikasi | Status |
| --- | --- | --- | --- |
| **A-01** | `npm run check` → 0 error | `astro check` | ✅ 0/0/0 |
| **A-02** | `npm run build` sukses, 22 halaman | `astro build` | ✅ 22 |
| **A-03** | Semua rute merespons 200 | `curl` per rute | ✅ 6 rute |
| **A-04** | URL tak dikenal → 404 | `curl` | ✅ |
| **A-05** | 0 tautan internal mati | audit `dist/` | ✅ 0 |
| **A-06** | 0 tombol WA tanpa ikon | audit `dist/` | ✅ 0/127 |
| **A-07** | 0 `<img>` tanpa `alt` | audit `dist/` | ✅ 0/124 |
| **A-08** | 0 referensi gambar hilang | audit `src/data` | ✅ 0 |
| **A-09** | Tidak ada pesan WA rusak | decode `wa.me?text=` | ✅ 0 "dengan ." |
| **A-10** | Sitemap terbentuk | `dist/sitemap-index.xml` | ✅ |
| **A-11** | robots.txt ada & exempt `/admin/` | `dist/robots.txt` | ✅ |
| **A-12** | Foto produk terpasang (bukan SVG placeholder) | `src/assets/products/*.jpg` | ✅ 13 |
| **A-13** | Domain produksi konsisten di canonical/OG/sitemap | grep domain di `dist/` | ✅ `panensegar.jamesq.my.id`, 0 sisa domain contoh |
| **A-14** | Aset ter-resolve dari path root | `curl -oI /$SITE/_astro/…` | ✅ `base` tetap `/`, benar untuk domain kustom & `pages.dev` |

### 13.2 Uji Manual (yang belum bisa diotomatisasi)

| ID | Uji | Metode | Status |
| --- | --- | --- | --- |
| **M-01** | Identitas visual 13 foto produk benar | Buka `/produk`, cocokkan dengan nama produk | ⬜ Butuh mata manusia |
| **M-02** | Logo tampil baik di header & favicon | Buka beranda | ⬜ Butuh mata manusia |
| **M-03** | Tampilan responsif mobile & desktop | Buka di viewport kecil & besar | ⬜ Butuh browser |
| **M-04** | Tombol WA membuka WA dengan pesan benar | Klik tombol, cek app/wa.me | ⬜ Butuh device |
| **M-05** | Login CMS & edit konten | Buka `/admin/` | ⬜ Prasyarat belum setup |
| **M-06** | Validasi Rich Results (schema.org) | Google Rich Results Test | ⬜ Butuh URL publik |
| **M-07** | Situs benar-benar online di domain | Buka `https://panensegar.jamesq.my.id` | ⬜ Tunggu build Cloudflare Pages pertama |

### 13.3 Uji Otomatis (yang sudah Dijalankan)

Audit `dist/` yang dijalankan setiap build memverifikasi:

1. **Dead-link audit** — semua `href`/`src` internal resolve ke file yang ada.
2. **Icon audit** — setiap `class="btn-wa"` memuat `<svg>`.
3. **Alt audit** — setiap `<img>` punya `alt` (boleh kosong hanya jika dekoratif + `aria-hidden`).
4. **WA message audit** — tidak ada template yang menghasilkan kalimat rusak.
5. **Asset reference audit** — semua path di `src/data/*.json` menunjuk file yang ada.

### 13.4 Definition of Done

PRD ini selesai bila:
- [ ] Seluruh acceptance criteria A-01..A-12 ✅ (terpenuhi).
- [ ] Uji manual M-01..M-03 dijalankan dan disetujui pemilik.
- [ ] Prasyarat produksi diselesaikan: ~~`SITE_URL`~~ ✅, ~~repo di-init & ter-push~~ ✅, ~~`backend.repo` CMS~~ ✅, ~~pipeline build~~ ✅ (Cloudflare Pages) — tersisa: hubungkan repo di dashboard Cloudflare, ganti nomor WhatsApp placeholder, dan otorisasi OAuth CMS.
