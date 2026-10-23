"use client";

import { useState } from "react";
import { CATEGORIES, type Category, type Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const visible = category === "all" ? products : products.filter((p) => p.category === category);
  const tabs: [Category | "all", string][] = [["all", "Tout"], ...Object.entries(CATEGORIES) as [Category, string][]];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              category === id ? "border-ink bg-ink text-cream" : "border-line bg-paper hover:border-ink/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
