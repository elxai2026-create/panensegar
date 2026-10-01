import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type Category = CollectionEntry<'categories'>;
export type SiteProfile = CollectionEntry<'site'>['data'];

type CategoryMap = Map<string, Category>;

/**
 * Mengambil seluruh produk yang tersedia, sudah terurut sesuai kolom `order`
 * (nilai kecil tampil lebih dulu). Produk dengan `available: false` tidak
 * ikut dikembalikan supaya tidak muncul di katalog.
 */
export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getCollection('products', ({ data }) => data.available);
  return products.sort((a, b) => a.data.order - b.data.order);
}

/** Produk yang ditandai `featured`, dipakai di beranda. */
export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const products = await getAvailableProducts();
  const featured = products.filter(({ data }) => data.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

/** Produk yang ditandai `popular` oleh pemilik usaha, untuk section "sering dipesan". */
export async function getPopularProducts(limit?: number): Promise<Product[]> {
  const products = (await getAvailableProducts()).filter(({ data }) => data.popular);
  return typeof limit === 'number' ? products.slice(0, limit) : products;
}

/** Kategori terurut berdasarkan kolom `order`,tanpa kategori yang kosong dipakai. */
export async function getCategories(): Promise<Category[]> {
  const categories = await getCollection('categories');
  const sorted = categories.sort((a, b) => a.data.order - b.data.order);
  const used = new Set((await getAvailableProducts()).map(({ data }) => data.category));
  return sorted.filter((category) => used.has(category.id));
}

/** Peta id -> entri kategori, supaya produk bisa menoleransi kategori yang hilang. */
export async function getCategoryMap(): Promise<CategoryMap> {
  const categories = await getCollection('categories');
  return new Map(categories.map((category) => [category.id, category]));
}

/** Jumlah produk tersedia pada satu kategori. */
export function countByCategory(products: Product[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { data } of products) {
    counts.set(data.category, (counts.get(data.category) ?? 0) + 1);
  }
  return counts;
}

/** Satu-satunya entri profil usaha. */
export async function getSiteProfile(): Promise<SiteProfile> {
  const entry = await getEntry('site', 'profile');
  if (!entry) {
    throw new Error('src/data/site/profile.json tidak ditemukan. Wajib ada satu berkas profil.');
  }
  return entry.data;
}

/**
 * Satu foto produk bisa berbentuk dua hal, bergantung dari asalnya
 * (lihat helper `gambar` di src/content.config.ts):
 * - objek gambar dari `image()`, punya `.src` seperti `/_astro/x.hash.webp`
 * - string untuk aset di `public/`, misal `/uploads/apel-kg.jpg`
 *
 * Keduanya perlu diratakan jadi URL untuk schema.org dan attribute HTML.
 * Tanpa ini, `photo.src` menghasilkan `undefined` untuk foto unggahan CMS.
 */
export function photoUrl(photo: unknown, site: URL | undefined): string {
  const raw = typeof photo === 'string' ? photo : (photo as { src?: string })?.src;
  if (!raw) {
    throw new Error('Foto produk tidak punya sumber. Periksa isi field `photos` di JSON produk.');
  }
  return new URL(raw, site ?? 'https://example.invalid').toString();
}

/**
 * URL kanonis untuk sebuah produk.
 * Mengembalikan undefined bila produk tidak ditemukan agar pemanggil bisa
 * memakai getStaticPaths untuk membangkitkan 404 yang benar.
 */
export function productPath(id: string): string {
  return `/produk/${id}/`;
}

export function categoryPath(id: string): string {
  return `/kategori/${id}/`;
}

/**
 * Halaman statis yang dirujuk langsung dari markup. Trailing slash wajib
 * karena Cloudflare Pages menyajikan folder sebagai /path/ dan me-redirect
 * /path ke /path/. Tanpa ini tiap klik/internal link kena satu redirect.
 */
export function pagePath(slug: '' | 'produk' | 'tentang-kami'): string {
  return slug === '' ? '/' : `/${slug}/`;
}