## 10. Deployment

### 10.1 Alur Rilis

| Langkah | Perintah | Keluaban |
| --- | --- | --- |
| Install dependensi | `npm install` | `node_modules/` |
| Typecheck | `npm run check` | 0 error, 0 warning, 0 hint |
| Build | `npm run build` | `dist/` (statis) |
| Preview lokal | `npm run preview` | hasil build dilationai di localhost |
| Deploy | Manual / CI | upload `dist/` ke hosting |

> `dist/` adalah satu-satunya artefak yang perlu di-host. Tidak ada database, tidak ada PHP, tidak ada proses server.

### 10.2 Hosting Kompatibel

| Platform | Cara deploy | Dipakai |
| --- | --- | --- |
| **GitHub Pages** | Workflow `.github/workflows/deploy.yml` (build + publish otomatis tiap push ke `main`) | ✅ **dipakai** |
| Netlify / Cloudflare Pages | Build command `npm run build`, publish dir `dist` | Ya |
| Shared hosting / cPanel | Upload isi `dist/` via FTP | Ya |
| VPS + Nginx | `root` → `dist/` | Ya (tanpa PHP) |

### 10.3 Variabel Lingkungan

| Variabel | Status | Keterangan |
| --- | --- | --- |
| `SITE_URL` | ✅ diset | Domain produksi `https://panensegar.jamesq.my.id`. Nilai default di `astro.config.mjs` sudah domain ini; env var hanya untuk override (mis. pratinjau). |

Nilai domain ini dipakai di tiga tempat sekaligus dan harus konsisten:
`astro.config.mjs` (`site`), `public/robots.txt` (baris `Sitemap:`), dan
`SITE_URL` pada workflow deploy.

### 10.4 Prasyarat CMS (Sveltia)

| Prasyarat | Status | Catatan |
| --- | --- | --- |
| Repo GitHub | ✅ `elxai2026-create/panensegar` (publik) | Repo dibuat, masih kosong |
| `backend.repo` di `config.yml` | ✅ `elxai2026-create/panensegar` | Sudah diisi |
| Git gateway / OAuth | Belum diotorisasi | Login pertama di `/admin/` akan meminta persetujuan di `oauth.sveltia-cms.app` |
| Kolaborator repo | Belum | Akun yang boleh masuk CMS |

Sebelum `/admin/` dapat dipakai: push kode ke GitHub → setujui OAuth di Sveltia saat login pertama → undang akun sebagai kolaborator.

### 10.6 Alur Deploy (GitHub Pages)

```
git push ke main  →  workflow: checkout → npm ci → check → build → upload → publish
```

| Item | Nilai |
| --- | --- |
| Workflow | `.github/workflows/deploy.yml` |
| Trigger | push ke `main`, plus manual (`workflow_dispatch`) |
| Node | 22 (mengikuti `engines` di `package.json`) |
| Cache | `npm` via `actions/setup-node` |
| Gate | `npm run check` — workflow gagal bila ada typecheck error |
| Publish | `actions/upload-pages-artifact` + `actions/deploy-pages` |
| Concurrency | grup `pages`, `cancel-in-progress: true` |

Dua file pendukung yang wajib ada agar deploy benar:

| File | Isi | Alasan |
| --- | --- | --- |
| `public/CNAME` | `panensegar.jamesq.my.id` | Minta GitHub Pages memakai domain ini, bukan `elxai2026-create.github.io` |
| `public/.nojekyll` | kosong | Mencegah Jekyll mengabaikan folder `_astro/` (nama berawalan underscore) |

Karena domain kustom memakai path root (`/`), `base` di `astro.config.mjs`
tidak perlu diubah. Kalau nanti situs dipindah ke path sub-domain seperti
`user.github.io/panensegar`, `base: '/panensegar'` baru diperlukan.

### 10.5 Content Update Cycle

```
Admin edit di /admin/  →  CMS commit ke GitHub  →  hosting rebuild  →  situs ter-update
```

Karena hosting statis, **perubahan konten butuh rebuild otomatis** (triggered by webhook/ CI dari push CMS). Ini trade-off yang disepakati secara sadar demi menghilangkan runtime server.
