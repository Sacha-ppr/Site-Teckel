import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { Teckel } from "@/components/teckel";
import { CATEGORIES, formatPrice } from "@/lib/catalog";
import { getProduct } from "@/lib/products";

export default function Page({ params }: PageProps<"/boutique/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <Link href="/boutique" className="text-sm font-semibold text-caramel">← Retour à la boutique</Link>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-2xl bg-paper" />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/boutique/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-2">
      <div className="rounded-[2rem] p-12" style={{ backgroundColor: `${product.color}22` }}>
        <Teckel color={product.color} className="w-full" title={product.name} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
          {CATEGORIES[product.category]}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold text-caramel">{formatPrice(product.price_cents)}</p>
        <p className="mt-6 text-lg text-ink-soft">{product.description}</p>
        <p className="mt-4 text-sm text-ink-soft">
          {product.stock > 5
            ? "En stock — expédié sous 48 h"
            : product.stock > 0
              ? `Plus que ${product.stock} en stock`
              : "Épuisé pour le moment"}
        </p>
        <div className="mt-8">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
