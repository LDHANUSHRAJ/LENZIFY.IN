/**
 * JSON-LD Structured Data Components for SEO
 * Use these in product pages, homepage, and organization-wide
 */

export function ProductJsonLd({
  product,
  url,
}: {
  product: {
    name: string;
    description?: string;
    price: number;
    offer_price?: number;
    brand?: string;
    sku?: string;
    stock?: number;
    product_images?: { image_url: string }[];
  };
  url: string;
}) {
  const images = (product.product_images || []).map((img) => img.image_url);
  const price = product.offer_price || product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Shop ${product.name} at LENZIFY`,
    image: images.length > 0 ? images : undefined,
    sku: product.sku || undefined,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "INR",
      price: price,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0],
      availability:
        product.stock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "LENZIFY",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lenzify.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LENZIFY",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description:
      "Premium eyewear store — spectacles, sunglasses, contact lenses & accessories online in India.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "lenzify.in@gmail.com",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: ["https://www.instagram.com/lenzify.in"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
