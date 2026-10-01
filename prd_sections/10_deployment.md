## 10. Deployment

### 10.1 Alur Rilis

| Langkah | Perintah | Keluaran |
| --- | --- | --- |
| Install dependensi | `npm install` | `node_modules/` |
| Typecheck | `npm run check` | 0 error, 0 warning, 0 hint |
| Build | `npm run build` | `dist/` (statis) |
| Preview lokal | `npm run preview` | hasil build di localhost |
| Deploy | `git push` ke `main` | Cloudflare Pages build & publish otomatis |

> `dist/` adalah satu-satunya artefak yang perlu di-host. Tidak ada database, tidak ada PHP, tidak ada proses server.

### 10.2 Hosting

| Platform | Cara deploy | Status |
| --- | --- | --- |
| **Cloudflare Pages** | Integrasi GitHub, build otomatis tiap push ke `main` | ✅ **dipakai** |
| GitHub Pages | Workflow Actions + publish `dist/` | Dihapus, digantikan Cloudflare Pages |
| Netlify | Build command `npm run build`, publish dir `dist` | Kompatibel |
| Shared hosting / cPanel | Upload isi `dist/` via FTP | Kompatibel |
| VPS + Nginx | `root` → `dist/` | Kompatibel (tanpa PHP) |

**Alasan memilih Cloudflare Pages:** zona `jamesq.my.id` sudah berada di
akun Cloudflare, jadi DNS untuk custom domain dibuat dan diverifikasi
otomatis. GitHub Pages butuh record DNS manual plus proses penerbitan
sertifikat yang bisa memakan belasan menit, dan tidak bisa diselesaikan
otomatis dari sisi repo.

### 10.3 Konfigurasi Cloudflare Pages

| Setting | Nilai |
| --- | --- |
| Workers & Pages → Create → Pages → Connect to Git | `elxai2026-create/panensegar` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(kosong)* |
| Node version | 22 — dibaca otomatis dari `engines` di `package.json` |
| Environment variable | `SITE_URL` = `https://panensegar.jamesq.my.id` |
| Custom domain | `panensegar.jamesq.my.id` |

Cloudflare Pages menyajikan situs di path **root** baik pada domain
kustom maupun `*.pages.dev`, jadi `base` di `astro.config.mjs` tetap `/`
dan aset `/_astro/…` selalu benar. Tidak ada `CNAME` atau `.nojekyll`
yang perlu ikut dalam repo.

#### Trailing slash

Cloudflare Pages menyajikan `dist/path/index.html` sebagai `/path/` dan
me-redirect `/path` ke `/path/` dengan 307. Agar canonical, sitemap, dan
tautan internal tidak kena redirect, `trailingSlash: 'always'` dipakai
dan semua URL internal dibuat lewat helper:

| Helper | Keluaran |
| --- | --- |
| `pagePath('')` | `/` |
| `pagePath('produk')` | `/produk/` |
| `productPath(id)` | `/produk/<id>/` |
| `categoryPath(id)` | `/kategori/<id>/` |

Helper ini dipakai di header, footer, breadcrumb, kartu produk, dan CTA.
Menulis path secara manual berisiko besar karena trailing slash mudah
terlewat dan gejalanya (307) tidak terlihat di build.

### 10.4 Variabel Lingkungan

| Variabel | Status | Keterangan |
| --- | --- | --- |
| `SITE_URL` | ✅ diset | Domain produksi `https://panensegar.jamesq.my.id`. Nilai default di `astro.config.mjs` sudah domain ini; env var hanya untuk override (mis. pratinjau). |

Nilai domain ini dipakai di dua tempat sekaligus dan harus konsisten:
`astro.config.mjs` (`site`) dan `public/robots.txt` (baris `Sitemap:`).
Keduanya memengaruhi canonical link, Open Graph, dan sitemap.

### 10.5 Content Update Cycle

```
Admin edit di /admin/  →  CMS commit ke GitHub  →  Cloudflare rebuild  →  situs ter-update
```

Karena hosting statis, **perubahan konten butuh rebuild otomatis** yang dipicu webhook Cloudflare dari push CMS. Ini trade-off yang disepakati secara sadar demi menghilangkan runtime server.

Sveltia CMS tetap menulis ke GitHub, jadi integrasi Cloudflare Pages dan
CMS tidak saling bertentangan: CMS mengubah repo, Cloudflare yang
membangun.

### 10.6 Prasyarat CMS (Sveltia)

| Prasyarat | Status | Catatan |
| --- | --- | --- |
| Repo GitHub | ✅ `elxai2026-create/panensegar` (publik) | Terisi, sudah punya commit |
| `config.yml` valid YAML | ✅ | `yaml.safe_load` lolos. Dulu gagal parse: 5 baris `hint`/`help` memakai `:` di dalam nilai polos tanpa kutip, dan satu di antaranya kutip tunggalnya tidak ditutup |
| `backend.repo` di `config.yml` | ✅ `elxai2026-create/panensegar` | Sudah diisi |
| Login | ⬜ | Gunakan personal access token — lihat di bawah |
| Kolaborator repo | Belum | Hanya perlu bila orang lain besides Anda yang akan mengedit |

#### Metode login: personal access token

Ada dua cara. Untuk satu pengguna, token jauh lebih sederhana:

| | Access token | OAuth (Authorization Code Flow) |
| --- | --- | --- |
| Yang perlu disiapkan | Fine-grained PAT di GitHub | OAuth app di GitHub + OAuth client server (Cloudflare Worker) |
| Perubahan di repo | Tidak ada | `backend.base_url` diisi URL OAuth client |
|-Friendly untuk non-teknis | Tidak — harus paham PAT | Ya |
| Token tersimpan di | localStorage browser | Tidak ada |

Config memakai `auth_methods: [token]`. Tanpa itu, Sveltia menampilkan tombol
"Sign in with GitHub" yang diam-diam memakai Netlify sebagai OAuth client —
dan Netlify membalas 404 karena repo ini tidak terhubung ke Netlify. Tombol
itu tidak akan pernah bekerja, jadi lebih baik disembunyikan daripada
membingungkan.

Fine-grained PAT yang dibutuhkan karena `publish_mode: editorial_workflow`
membuka pull request untuk setiap entri:

| Permission | Akses | Untuk apa |
| --- | --- | --- |
| Contents | Read and write | Commit entri dan aset |
| Pull requests | Read and write | Membuka, me-label, merge, menutup PR tiap entri |

Tanpa permission Pull requests, CMS akan commit ke branch workflow lalu
gagal membuka PR dengan "Resource not accessible by personal access token".

`backend.base_url` sengaja tidak diisi. Nilai yang pernah ada di sana
(`oauth.sveltia-cms.app`) tidak/domain yang tidak ada, sehingga tombol OAuth
pasti gagal. Kalau nanti butuh OAuth, deploy
[Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) di
Cloudflare Worker lalu isi `base_url` dengan URL Worker tersebut.
