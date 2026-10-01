/** Format angka menjadi Rupiah, contoh 18500 -> "Rp 18.500". */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, ' ');
}

/**
 * Format harga + satuan dalam satu potong teks, contoh "Rp 6.000 / ikat".
 */
export function formatPrice(value: number, unit: string): string {
  return `${formatRupiah(value)} / ${unit}`;
}

/** Tanggal "1 Oktober 2026" dalam lokal Indonesia. */
export function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(value);
}