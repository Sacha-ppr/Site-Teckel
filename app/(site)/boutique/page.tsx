import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Boutique" };

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(3rem,8vw,6rem)]">La boutique</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Des produits sélectionnés et testés par nos résidents, pensés pour la morphologie si particulière du
            teckel. Livraison offerte dès 60 €, retrait gratuit au bar.
          </p>
        </div>
      </section>
      <div className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <Suspense fallback={<div className="h-96 animate-pulse bg-tirage-2" />}>
            <Catalog />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function Catalog() {
  const products = await getProducts();
  if (products.length === 0) {
    return <p className="text-lg text-encre-douce">Le catalogue est vide pour le moment.</p>;
  }
  return <ProductGrid products={products} />;
}
