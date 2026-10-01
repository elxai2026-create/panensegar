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
