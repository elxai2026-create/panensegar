# Panen Segar

Website katalog produk hasil pertanian. Pemesanan diarahkan ke WhatsApp.

Situs statis (**Astro 7** + TypeScript + Tailwind 4) yang di-host di
**Cloudflare Pages** dan dikelola lewat **Sveltia CMS**. Tidak ada
database, tidak ada PHP, tidak ada proses server.

- Produksi: <https://panensegar.jamesq.my.id>
- Panel CMS: `/admin/`
- Repo: `elxai2026-create/panensegar` (branch `main`)

## Menjalankan secara lokal

```sh
npm install
npm run dev -- --background   # dev server managed, bukan foreground
npm run dev status
npm run dev logs
npm run dev stop
```

| Command | Fungsi |
| :-- | :-- |
| `npm run dev -- --background` | Dev server di `localhost:4321` |
| `npm run check` | Typecheck — harus 0 error sebelum push |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Cek hasil build di lokal |

## Struktur

```text
src/
├── assets/            gambar yang di-import Astro (di-hash ke /_astro/)
├── components/        komponen UI
├── content.config.ts  skema Zod untuk konten (produk, kategori, profil)
├── data/
│   ├── products/      13 produk (JSON)
│   ├── categories/    5 kategori (JSON)
│   └── site/profile.json
├── layouts/
└── pages/             routing file-based
public/
├── admin/             Sveltia CMS (config.yml + index.html)
├── favicon.svg
└── robots.txt
```

Produk, kategori, dan profil dimuat lewat **Astro Content Layer**, bukan
`import` langsung, sehingga bisa diedit lewat CMS.

## Deployment

Deploy terjadi otomatis setiap kali ada push ke `main`; Cloudflare Pages
menjalankan build dan publish. **Tidak ada workflow GitHub Actions.**

Pengaturan project di dashboard Cloudflare Pages:

| Setting | Nilai |
| :-- | :-- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (dibaca dari `engines`) |
| Environment variable | `SITE_URL` = `https://panensegar.jamesq.my.id` |
| Custom domain | `panensegar.jamesq.my.id` |

Domain kustom dan HTTPS dikelola Cloudflare otomatis karena zona
`jamesq.my.id` berada di akun Cloudflare. Karena situs disajikan di path
root, `base` di `astro.config.mjs` tetap `/` — jangan diubah.

## Konten lewat CMS

1. Buka `/admin/`.
2. Setujui permintaan OAuth di `oauth.sveltia-cms.app` saat login pertama.
3. Akun yang diundang sebagai **collaborator** repo inilah yang bisa
   melakukan commit.

Perubahan konten butuh beberapa menit untuk online karena harus build
ulang. Sveltia melakukan commit ke GitHub, Cloudflare Pages yang membangun.

## Catatan

- Nomor WhatsApp masih placeholder `6281234567890` — ganti di
  `src/data/site/profile.json` sebelum produksi.
- `public/uploads/` dipakai Sveltia untuk media dan ikut ter-commit.
- Foto produk berasal dari Pexels/Unsplash. Rincian lisensi ada di
  `prd.md` bagian 12.

Spesifikasi lengkap ada di [`prd.md`](./prd.md).
