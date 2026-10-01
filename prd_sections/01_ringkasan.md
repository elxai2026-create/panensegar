## 1. Ringkasan

Membangun website statis katalog dan profil usaha untuk **Panen Segar**. Aplikasi ini menampilkan katalog produk hasil pertanian (harga dan satuan jual), halaman detail produk yang siap dibagikan ke WhatsApp, pengelompokan berdasarkan kategori, serta halaman company profile lengkap. Tindakan pemesanan diarahkan sepenuhnya ke WhatsApp (CTA tunggal). Konten dikelola melalui **Sveltia CMS** dengan sumber data berupa berkas JSON di dalam repo Git (version-controlled).

**Pilihan arsitektur:** Opsi B (Astro + Sveltia CMS) — tanpa WordPress/PHP runtime, hanya hosting statis (build ke `dist/`). Cocok dengan kondisi proyek saat ini (tidak ada instance WordPress berjalan, PHP/composer tidak tersedia).
