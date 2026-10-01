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

| Platform | Cara deploy | Cocok |
| --- | --- | --- |
| GitHub Pages | Push ke branch, Pages dari `dist/` | Ya (repo sudah GitHub untuk Sveltia) |
| Netlify / Cloudflare Pages | Build command `npm run build`, publish dir `dist` | Ya |
| Shared hosting / cPanel | Upload isi `dist/` via FTP | Ya |
| VPS + Nginx | `root` → `dist/` | Ya (tanpa PHP) |

### 10.3 Variabel Lingkungan

| Variabel | Status | Keterangan |
| --- | --- | --- |
| `SITE_URL` | **Wajib diisi** | URL kanonik produksi, mis. `https://panensegar.example.com`. Default saat ini masih nilai contoh — WAJIB diganti sebelum produksi (mengengaruhi canonical, OG URL, dan sitemap). |

### 10.4 Prasyarat CMS (Sveltia)

| Prasyarat | Status | Catatan |
| --- | --- | --- |
| Repo GitHub | ✅ `elxai2026-create/panensegar` (publik) | Repo dibuat, masih kosong |
| `backend.repo` di `config.yml` | ✅ `elxai2026-create/panensegar` | Sudah diisi |
| Git gateway / OAuth | Belum diotorisasi | Login pertama di `/admin/` akan meminta persetujuan di `oauth.sveltia-cms.app` |
| Kolaborator repo | Belum | Akun yang boleh masuk CMS |

Sebelum `/admin/` dapat dipakai: push kode ke GitHub → setujui OAuth di Sveltia saat login pertama → undang akun sebagai kolaborator.

### 10.5 Content Update Cycle

```
Admin edit di /admin/  →  CMS commit ke GitHub  →  hosting rebuild  →  situs ter-update
```

Karena hosting statis, **perubahan konten butuh rebuild otomatis** (triggered by webhook/ CI dari push CMS). Ini trade-off yang disepakati secara sadar demi menghilangkan runtime server.
