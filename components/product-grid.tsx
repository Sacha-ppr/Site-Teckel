"use client";

import { useState } from "react";
import { CATEGORIES, type Category, type Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const visible = category === "all" ? products : products.filter((p) => p.category === category);
  const tabs: [Category | "all", string][] = [["all", "Tout"], ...(Object.entries(CATEGORIES) as [Category, string][])];

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par rayon">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            aria-pressed={category === id}
            className={`btn px-5 py-2.5 text-[0.85rem] ${
              category === id ? "bg-encre text-jeton" : "border-2 border-encre hover:bg-tirage"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
