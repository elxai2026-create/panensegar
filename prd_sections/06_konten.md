## 6. Aturan Konten

### 6.1 Aturan Harga

- `price` disimpan sebagai **angka bulat Rupiah penuh tanpa pemisah** (contoh: `18500` = Rp 18.500).
- Formatter hanya menambah pemisah ribuan (locale Indonesia) di sisi tampilan (`src/lib/format.ts`).
- Tidak ada harga bertingkat; harga grosir dinegosiasi via WhatsApp.

### 6.2 Aturan Nomor WhatsApp

- Nomor disimpan sebagai string format internasional **tanpa** `+` dan **tanpa** spasi, awalan `62` (contoh: `6281234567890`).
- Divalidasi skema `content.config.ts` dengan pola `^62\d{8,13}$`.
- Untuk tampilan (footer/profil), diformat `+62 812-3456-7890` oleh `waDisplayNumber()`.

### 6.3 Aturan Template Pesan

Dua template pesan, dipilih **otomatis** agar tidak pernah muncul kalimat rusak:

| Field | Dipakai oleh | Isi | Placeholder |
| --- | --- | --- | --- |
| `whatsapp.greeting` | Tombol yang menyebut produk (kartu, detail) | Sapaan + nama produk | `{brand}`, `{produk}` |
| `whatsapp.greetingUmum` | Tombol umum (header, mengambang, hero, profil) | Sapaan umum | `{brand}` saja |

Aturan: `{produk}` **wajib ada** di `greeting` dan **dilarang ada** di `greetingUmum`. Ini mencegah pesan rusak seperti "saya tertarik dengan ." pada tombol yang tidak punya konteks produk.

### 6.4 Aturan Produk

- `photos` minimal 1 foto (divalidasi skema).
- `available: false` → disembunyikan dari grid dan katalog, tampil badge "Habis" di kartu.
- `order` mengatur urutan tampil; **angka kecil tampil lebih dulu**. Ambil 3 teratas untuk bagian "Baru Dipanen"? Bukan — bagian "Baru Dipanen" memakai `updatedAt` (lihat 6.6).
- `updatedAt` (ISO date) mengatur urutan "Baru Dipanen"; **paling baru tampil lebih dulu**.

### 6.5 Aturan Kategori

- `order` mengatur urutan grid kategori (asc).
- `emoji` dipakai sebagai ikon visual kategori (satu karakter, bukan gambar).
- Kategori tanpa produk `available` **tidak muncul** di grid kategori (dicek saat build).

### 6.6 Aturan Stok

- Stok tidak pernah ditampilkan sebagai angka real-time.
- Tidak pernah menampilkan jumlah stok sebagai angka. Yang tampil adalah `stockNote` (teks bebas, mis. "Panen setiap hari") atau `Minimal order {minOrder}`, atau teks default bila keduanya kosong.
