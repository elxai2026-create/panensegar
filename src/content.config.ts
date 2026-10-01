import type { ImageMetadata } from 'astro';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Bentuk yang boleh dipakai sebuah field gambar: aset teroptimasi atau path `public/`. */
export type GambarSrc = ImageMetadata | string;

/**
 * Field gambar menerima dua bentuk, karena ada dua sumber aset di repo ini:
 * - path relatif ke `src/assets` (mis. `../../assets/products/wortel.jpg`)
 *   -> dioptimasi Astro (WebP + ukuran sesuai permintaan)
 * - path absolut ke `public/` (mis. `/uploads/apel-kg.jpg`)
 *   -> hasil unggahan lewat CMS. Astro tidak bisa mengoptimasi isi `public/`,
 *      jadi `<Image>` melayaninya apa adanya
 *
 * Skema `image()` dipanggil hanya untuk bentuk pertama. Kalau dipanggil
 * untuk path absolut, build gagal dengan `ImageNotFound`. Karena `media_folder`
 * CMS menunjuk ke `public/uploads`, bentuk kedua inilah yang muncul begitu
 * pemilik usaha mengunggah foto lewat CMS.
 */
function gambar({ image }: { image: () => z.ZodType }): z.ZodType<GambarSrc> {
  return z.string().transform((value, ctx): GambarSrc => {
    if (value.startsWith('/')) return value;
    const hasil = image().safeParse(value);
    if (!hasil.success) {
      ctx.addIssue({ code: 'custom', message: `Gambar tidak ditemukan: ${value}` });
      return z.NEVER;
    }
    return hasil.data as GambarSrc;
  });
}

/**
 * Kategori produk. Satu berkas JSON per kategori supaya mudah dikelola
 * lewat Sveltia CMS (satu entri = satu kategori).
 */
const categories = defineCollection({
  loader: glob({ base: './src/data/categories', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string().min(2, 'Nama kategori wajib diisi'),
    tagline: z.string().default(''),
    description: z.string().default(''),
    emoji: z.string().default('🌱'),
    accent: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Warna harus format hex, contoh #3A9A40')
      .default('#3A9A40'),
    order: z.coerce.number().int().default(100),
  }),
});

/**
 * Produk hasil pertanian.
 *
 * `price` disimpan sebagai angka bulat Rupiah penuh (tanpa titik/koma),
 * contoh 18500 = Rp 18.500.konversi ke tampilan dilakukan di `src/lib/format.ts`.
 */
const products = defineCollection({
  loader: glob({ base: './src/data/products', pattern: '**/*.json' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(2, 'Nama produk wajib diisi'),
      summary: z.string().min(10, 'Ringkasan minimal 10 karakter'),
      description: z.string().default(''),
      category: z.string().min(2, 'Kategori wajib dipilih'),
      price: z.coerce
        .number()
        .int('Harga harus angka bulat, tanpa titik atau koma')
        .nonnegative('Harga tidak boleh negatif'),
      unit: z.string().min(1, 'Satuan jual wajib diisi, contoh: kg'),
      minOrder: z.string().default(''),
      stockNote: z.string().default(''),
      photos: z.array(gambar({ image })).min(1, 'Minimal 1 foto produk'),
      featured: z.coerce.boolean().default(false),
      /** Ditandai manual oleh pemilik usaha; tidak ada data order di situs. */
      popular: z.coerce.boolean().default(false),
      available: z.coerce.boolean().default(true),
      tags: z.array(z.string()).default([]),
      updatedAt: z.coerce.date().default(() => new Date()),
      order: z.coerce.number().int().default(100),
    }),
});

/**
 * Company profile + konfigurasi global usaha (kontak, WhatsApp, SEO).
 * Hanya ada satu entri: `src/data/site/profile.json`.
 */
const site = defineCollection({
  loader: glob({ base: './src/data/site', pattern: '**/*.json' }),
  schema: ({ image }) =>
    z.object({
      brand: z.object({
        name: z.string().min(2),
        legalName: z.string().default(''),
        tagline: z.string().default(''),
        logo: gambar({ image }).optional(),
        favicon: z.string().default('/favicon.svg'),
      }),
      seo: z.object({
        title: z.string().default(''),
        description: z.string().default(''),
        ogImage: gambar({ image }).optional(),
      }),
      contact: z.object({
        /** Format internasional tanpa tanda plus/spasi, contoh: 6281234567890 */
        whatsapp: z
          .string()
          .regex(/^62\d{8,13}$/, 'Nomor WhatsApp harus format 62xxx (tanpa + dan spasi)'),
        email: z.string().default(''),
        address: z.object({
          line1: z.string().default(''),
          line2: z.string().default(''),
          village: z.string().default(''),
          district: z.string().default(''),
          city: z.string().default(''),
          province: z.string().default(''),
          postcode: z.string().default(''),
        }),
        mapsUrl: z.string().default(''),
        businessHours: z.array(
          z.object({ label: z.string(), hours: z.string() }),
        ),
      }),
      whatsapp: z.object({
        /** Pesan pembuka untuk tombol yang menyebut produk tertentu. {produk} diganti nama produk. */
        greeting: z.string().default('Halo, saya ingin menanyakan produk Anda.'),
        /** Pesan pembuka untuk tombol umum (header, tombol mengambang, CTA beranda). Tanpa {produk}. */
        greetingUmum: z.string().default('Halo, saya ingin menanyakan produk yang tersedia.'),
      }),
      hero: z.object({
        headline: z.string().default(''),
        subheadline: z.string().default(''),
        primaryCta: z.string().default('Lihat Katalog'),
        secondaryCta: z.string().default('Tentang Kami'),
        image: gambar({ image }).optional(),
      }),
      about: z.object({
        summary: z.string().default(''),
        story: z.array(z.string()).default([]),
        vision: z.string().default(''),
        mission: z.array(z.string()).default([]),
        highlights: z
          .array(
            z.object({
              title: z.string(),
              description: z.string().default(''),
              emoji: z.string().default('🌿'),
            }),
          )
          .default([]),
        stats: z
          .array(z.object({ value: z.string(), label: z.string() }))
          .default([]),
        certifications: z.array(z.string()).default([]),
        markets: z.array(z.string()).default([]),
        foundedYear: z.coerce.number().int().default(2015),
      }),
      closing: z.object({
        title: z.string().default(''),
        description: z.string().default(''),
      }),
    }),
});

export const collections = { categories, products, site };