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
| **A-15** | Tidak ada tautan internal tanpa trailing slash | grep `href="/…"` di `dist/`, abaikan yang berekstensi | ✅ 0 dari 21 URL |
| **A-16** | Tidak ada URL sitemap yang kena redirect | `curl -o /dev/null -w %{http_code}` tiap `<loc>` | ✅ 21/21 `200` tanpa redirect |
| **A-17** | `photos` setiap produk berupa array datar berisi string | audit `src/data/products/*.json` | ✅ 13/13 |
| **A-18** | Build tetap sukses saat field gambar diisi path `public/` | build dengan `photos: ["/uploads/x.jpg"]` | ✅ 22 halaman, `og:image` & ld+json benar |
| **A-19** | Tidak ada regresi optimasi aset bawaan | jumlah `.webp` di `dist/_astro/` | ✅ 28 webp, 13/13 foto katalog teroptimasi |

### 13.2 Uji Manual (yang belum bisa diotomatisasi)

| ID | Uji | Metode | Status |
| --- | --- | --- | --- |
| **M-01** | Identitas visual 13 foto produk benar | Buka `/produk`, cocokkan dengan nama produk | ⬜ Butuh mata manusia |
| **M-02** | Logo tampil baik di header & favicon | Buka beranda | ⬜ Butuh mata manusia |
| **M-03** | Tampilan responsif mobile & desktop | Buka di viewport kecil & besar | ⬜ Butuh browser |
| **M-04** | Tombol WA membuka WA dengan pesan benar | Klik tombol, cek app/wa.me | ⬜ Butuh device |
| **M-05** | Login CMS & edit konten | Buka `/admin/` | ⬜ Butuh persetujuan OAuth Sveltia + akun sebagai collaborator |
| **M-06** | Validasi Rich Results (schema.org) | Google Rich Results Test | ⬜ URL publik sudah ada, tinggal diuji |
| **M-07** | Situs online di domain | Buka `https://panensegar.jamesq.my.id` | ✅ 200, 21 URL 200 tanpa redirect, aset 200 |

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
- [x] Prasyarat produksi diselesaikan: ~~`SITE_URL`~~ ✅, ~~repo di-init & ter-push~~ ✅, ~~`backend.repo` CMS~~ ✅, ~~pipeline build~~ ✅ (Cloudflare Pages) — tersisa: hubungkan repo di dashboard Cloudflare, ganti nomor WhatsApp placeholder, dan otorisasi OAuth CMS.
