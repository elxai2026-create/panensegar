/** Nomor WhatsApp dalam format internasional tanpa tanda "+", contoh 6281234567890. */
export type WhatsAppNumber = string;

const WA_NUMBER_PATTERN = /^62\d{8,13}$/;

/**
 * Menyusun tautan "click to chat" WhatsApp.
 *
 * @param number      Nomor tujuan, format 62xxx (divalidasi schema di profile.json)
 * @param message     Pesan yang akan terisi otomatis di kolom chat penerima
 */
export function waLink(number: WhatsAppNumber, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Mengganti placeholder pada template sapaan.
 * Placeholder yang didukung: {brand} dan {produk}.
 */
export function fillGreeting(
  template: string,
  vars: { brand?: string; produk?: string },
): string {
  return template
    .replaceAll('{brand}', vars.brand ?? '')
    .replaceAll('{produk}', vars.produk ?? '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Nomor sebagai format tampilan lokal, contoh 6281234567890 -> "+62 812-3456-7890". */
export function waDisplayNumber(number: WhatsAppNumber): string {
  if (!WA_NUMBER_PATTERN.test(number)) return number;
  const local = number.slice(2);
  const groups = [local.slice(0, 3), local.slice(3, 7), local.slice(7, 11), local.slice(11)];
  return `+62 ${groups.filter(Boolean).join('-')}`;
}