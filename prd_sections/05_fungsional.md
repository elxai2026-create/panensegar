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
