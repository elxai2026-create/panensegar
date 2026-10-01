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
