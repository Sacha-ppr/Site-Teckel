"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.price_cents,
          color: product.color,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      aria-live="polite"
      className={`btn ${compact ? "px-4 py-2 text-[0.8rem]" : "w-full py-4 sm:w-auto"} ${
        added ? "bg-jeton text-encre" : "btn-encre"
      }`}
    >
      {soldOut ? "Épuisé" : added ? "Dans le panier" : compact ? "Ajouter" : "Ajouter au panier"}
    </button>
  );
}
