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
- Jika Anda ingin ganti foto ke foto dagangan asli, cukup upload lewat CMS. Field `photos` menerima lebih dari satu foto, dan hasilnya **tetap berupa array datar** — lihat A-17. Widget `list` sudah membungkus tiap entri foto, jadi field `image` di dalamnya **tidak boleh** diberi `multiple: true`; kalau diberi, Sveltia menulis array dua lapis yang ditolak skema `image()` dan build Cloudflare gagal.
