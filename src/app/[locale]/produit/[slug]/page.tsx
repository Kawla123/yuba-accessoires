import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductDetailBySlug } from "@/lib/queries/products";
import { getApprovedReviewsForProduct, getReviewFormState } from "@/lib/queries/reviews";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { ProductReviewsSection } from "@/components/shop/ProductReviewsSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuba-bijoux.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    return { title: "Produit introuvable" };
  }

  const description =
    product.descriptionFr ??
    `${product.name} — façonné à Djerba, disponible chez Yuba Accessoires.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductDetailBySlug(slug);
  if (!product) {
    notFound();
  }

  const [reviews, reviewFormState] = await Promise.all([
    getApprovedReviewsForProduct(product.id),
    getReviewFormState(product.id),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.descriptionFr ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "TND",
      price: (product.priceTnd / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/${locale}/produit/${slug}`,
    },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2 sm:px-10">
        <div className="relative aspect-[4/5] w-full bg-cream-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <ProductPurchasePanel product={product} />
      </div>

      <ProductReviewsSection
        locale={locale}
        slug={slug}
        productId={product.id}
        reviews={reviews}
        formState={reviewFormState}
      />
    </main>
  );
}
