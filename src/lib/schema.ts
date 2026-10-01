import type { SiteProfile } from './catalog';

type Address = SiteProfile['contact']['address'];

/** Alamat dalam satu baris, dilewati bagian yang kosong. */
export function formatAddress(address: Address): string {
  return [address.line1, address.line2, address.village, address.district, address.city, address.province, address.postcode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
}

type OrganizationSchema = Record<string, unknown>;

/**
 * schema.org Organization + LocalBusiness, dipakai di seluruh halaman lewat
 * BaseLayout. Sengaja dibuat statis dari profile.json supaya tidak perlu
 * fetch ke API apa pun saat build.
 */
export function buildOrganizationSchema(
  profile: SiteProfile,
  canonical: URL,
): OrganizationSchema {
  const { brand, contact } = profile;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${canonical.origin}/#organization`,
    name: brand.name,
    legalName: brand.legalName || undefined,
    description: profile.seo.description,
    url: canonical.origin,
    image: profile.seo.ogImage ? new URL(profile.seo.ogImage.src, canonical).toString() : undefined,
    telephone: `+${contact.whatsapp}`,
    email: contact.email || undefined,
    slogan: brand.tagline || undefined,
    foundingDate: String(profile.about.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.line1,
      addressLocality: contact.address.city,
      addressRegion: contact.address.province,
      postalCode: contact.address.postcode,
      addressCountry: 'ID',
    },
    geo: contact.mapsUrl ? { '@type': 'GeoCoordinates', url: contact.mapsUrl } : undefined,
    sameAs: [],
    areaServed: profile.about.markets.map((market) => ({ '@type': 'Place', name: market })),
    contactPoint: contact.whatsapp
      ? [
          {
            '@type': 'ContactPoint',
            telephone: `+${contact.whatsapp}`,
            contactType: 'sales',
            areaServed: 'ID',
            availableLanguage: ['id'],
          },
        ]
      : undefined,
  };
}

/**
 * schema.org Product untuk halaman detail produk.
 * AggregateRating sengaja tidak dicantumkan karena belum ada sumber data
 * rating yang sahih untuk situs ini.
 */
export function buildProductSchema(
  profile: SiteProfile,
  product: {
    name: string;
    description: string;
    sku: string;
    image: string;
    price: number;
    available: boolean;
    updatedAt: Date;
  },
  url: URL,
): OrganizationSchema {
  const { brand } = profile;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    url: url.toString(),
    brand: { '@type': 'Brand', name: brand.name },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: profile.brand.name },
      url: url.toString(),
    },
  };
}