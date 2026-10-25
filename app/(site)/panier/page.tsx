import type { Metadata } from "next";
import { Suspense } from "react";
import { PRODUCT_DETAILS } from "@/lib/product-details";
import { getProducts } from "@/lib/products";
import { Checkout } from "./checkout";

export const metadata: Metadata = { title: "Panier" };

export default function Page() {
  return (
    <div className="bg-tirage">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
        <h1 className="enseigne text-[clamp(2.8rem,7vw,5rem)]">Votre panier</h1>
        <div className="mt-10">
          <Suspense fallback={<Checkout />}>
            <CheckoutWithSuggestions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function CheckoutWithSuggestions() {
  const products = await getProducts();
  // Seuls les articles sans taille s'ajoutent en un clic depuis le panier.
  const suggestions = products.filter((p) => !PRODUCT_DETAILS[p.slug]?.sizes);
  return <Checkout suggestions={suggestions} />;
}
