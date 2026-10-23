import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Boutique" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold">La boutique</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        Des produits sélectionnés et testés par nos résidents, pensés pour la morphologie si particulière
        du teckel. Livraison offerte dès 60 €, retrait gratuit au bar.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-paper" />}>
          <Catalog />
        </Suspense>
      </div>
    </div>
  );
}

async function Catalog() {
  const products = await getProducts();
  if (products.length === 0) {
    return <p className="text-ink-soft">Le catalogue est vide pour le moment.</p>;
  }
  return <ProductGrid products={products} />;
}
