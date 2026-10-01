## 11. Risiko dan Batasan

| ID | Risiko / Batasan | Dampak | Mitigasi / Status |
| --- | --- | --- | --- |
| **R-01** | Nomor WhatsApp & domain masih nilai contoh | Pelanggan menghubungi nomor yang salah / URL salah | WAJIB diganti sebelum produksi (lihat 10.3) |
| **R-02** | `/admin/` belum diotorisasi OAuth | Admin belum bisa login | Kode sudah siap; tinggal setujui OAuth saat login pertama (lihat 10.4) |
| **R-03** | Workflow Pages belum pernah jalan | Situs belum online | ✅ Sudah ada `.github/workflows/deploy.yml`; cukup Settings > Pages > source = GitHub Actions |
| **R-04** | Dua foto produk masih "proxy" | `beras` (foto beras putih, bukan pandan wangi) & `bawang-merah` (foto red onion, bukan shallot) kurang akurat | Ganti dengan foto asli lewat CMS bila tersedia |
| **R-05** | Identitas foto bergeser dari metadata | Foto mungkin tidak persis sesuai produk | Verifikasi manual di `/produk` sebelum produksi |
| **R-06** | Identitas visual tidak terkonfirmasi otomatis | Deskripsi produk bisa meleset | Butuh mata manusia; tidak ada tools image-insight |
| **R-07** | "Produk sering dipesan" manual | Admin harus disiplin menandai; bisa basi | Sveltia CMS + label jelas "Tandai sendiri"; tinjau berkala |
| **R-08** | `z.coerce.boolean()` menyatukan nilai non-boolean | Nilai boolean/string bisa salah baca | Editor CMS mengirim boolean asli; JSON manual harus `true`/`false` (bukan `"true"`) |
| **R-09** | `farm.jpg` kini dipakai di beranda | Kalau file dihapus, halaman ikut rusak | Astro check + build gagal → mudah terdeteksi |
| **R-10** | Sveltia memuat JS via CDN | Butuh internet; bisa gagal dimuat | Hanya affects `/admin/`; halaman publik tidak bergantung CDN |

### 11.1 Batasan yang Diterima (by design)

| Batasan | Alasan diterima |
| --- | --- |
| Tidak ada checkout/cart | Kanal tunggal = WhatsApp; sesuai realitas usaha kecil |
| Tidak ada data order di situs | Order manual; tidak ada integrasi e-commerce |
| Konten butuh rebuild | Hosting statis; webhook CI menutup celah ini |
| Multi-bahasa di luar scope | Sasaran pengguna satu bahasa (Indonesia) |
