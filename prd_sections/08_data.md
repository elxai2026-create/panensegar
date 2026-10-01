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
