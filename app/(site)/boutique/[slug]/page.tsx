import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { Pose } from "@/components/pose";
import { CATEGORIES, formatPrice } from "@/lib/catalog";
import { productPhoto } from "@/lib/product-photos";
import { getProduct } from "@/lib/products";

export default function Page({ params }: PageProps<"/boutique/[slug]">) {
  return (
    <div className="bg-tirage">
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <Link href="/boutique" className="legende inline-flex items-center gap-2 hover:text-rouge">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour à la boutique
        </Link>
        <Suspense fallback={<div className="mt-8 h-[32rem] animate-pulse bg-tirage-2" />}>
          <ProductDetail params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/boutique/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mt-8 grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
      <figure className="tirage rotate-[-1.5deg]">
        <Pose photo={productPhoto(product.slug)} priority sizes="(min-width: 768px) 45vw, 92vw" className="aspect-square" />
        <figcaption className="legende px-1 pt-3 text-encre-douce">Photo d&apos;ambiance</figcaption>
      </figure>
      <div>
        <h1 className="enseigne text-[clamp(2.4rem,5vw,4.2rem)]">{product.name}</h1>
        <p className="mt-6 max-w-[36rem] text-[1.2rem] leading-relaxed">{product.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-y-2 border-encre py-6">
          <span className="text-[3rem] leading-none font-extrabold tabular-nums [font-stretch:80%]">
            {formatPrice(product.price_cents)}
          </span>
          <p className="legende text-encre-douce">
            {CATEGORIES[product.category]} ·{" "}
            {product.stock > 5
              ? "En stock · expédié sous 48 h"
              : product.stock > 0
                ? `Plus que ${product.stock} en stock`
                : "Épuisé pour le moment"}
          </p>
        </div>
        <div className="mt-8">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
