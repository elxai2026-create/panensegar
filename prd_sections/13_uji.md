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

### 13.2 Uji Manual (yang belum bisa diotomatisasi)

| ID | Uji | Metode | Status |
| --- | --- | --- | --- |
| **M-01** | Identitas visual 13 foto produk benar | Buka `/produk`, cocokkan dengan nama produk | ⬜ Butuh mata manusia |
| **M-02** | Logo tampil baik di header & favicon | Buka beranda | ⬜ Butuh mata manusia |
| **M-03** | Tampilan responsif mobile & desktop | Buka di viewport kecil & besar | ⬜ Butuh browser |
| **M-04** | Tombol WA membuka WA dengan pesan benar | Klik tombol, cek app/wa.me | ⬜ Butuh device |
| **M-05** | Login CMS & edit konten | Buka `/admin/` | ⬜ Prasyarat belum setup |
| **M-06** | Validasi Rich Results (schema.org) | Google Rich Results Test | ⬜ Butuh URL publik |

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
- [ ] Prasyarat produksi (R-01, R-02, R-03) diselesaikan: `SITE_URL` diganti, repo di-init, `backend.repo` CMS dikonfigurasi.
