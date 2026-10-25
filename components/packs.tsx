"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ProductPhoto } from "@/components/product-photo";
import { FREE_SHIPPING_CENTS, formatPrice, type Product } from "@/lib/catalog";
import { PACKS } from "@/lib/extras";

export function Packs({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [done, setDone] = useState<string | null>(null);

  const packs = PACKS.map((p) => ({ ...p, items: p.slugs.map((s) => products.find((x) => x.slug === s)).filter((x) => x !== undefined) })).filter(
    (p) => p.items.length === p.slugs.length,
  );
  if (packs.length === 0) return null;

  return (
    <section aria-labelledby="packs" className="mb-14">
      <h2 id="packs" className="enseigne text-[clamp(2rem,4vw,3rem)]">Les packs</h2>
      <p className="mt-2 max-w-xl text-encre-douce">Trois articles qui vont ensemble, ajoutés d&apos;un clic.</p>
      <ul className="mt-6 grid gap-6 lg:grid-cols-3">
        {packs.map((p) => {
          const total = p.items.reduce((n, i) => n + i.price_cents, 0);
          const out = p.items.some((i) => i.stock <= 0);
          return (
            <li key={p.id} className="tirage flex flex-col p-3">
              <div className="grid grid-cols-3 gap-2">
                {p.items.map((i) => (
                  <ProductPhoto key={i.id} slug={i.slug} alt={i.name} sizes="120px" className="aspect-square" />
                ))}
              </div>
              <h3 className="enseigne mt-4 text-[1.4rem]">{p.name}</h3>
              <p className="mt-1 text-encre-douce">{p.text}</p>
              <ul className="mt-3 text-sm text-encre-douce">
                {p.items.map((i) => (
                  <li key={i.id}>
                    <Link href={`/boutique/${i.slug}`} className="hover:text-rouge">{i.name}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                <div>
                  <span className="text-[1.6rem] leading-none font-extrabold tabular-nums">{formatPrice(total)}</span>
                  {total >= FREE_SHIPPING_CENTS ? <p className="legende text-rouge">Livraison offerte</p> : null}
                </div>
                <button
                  type="button"
                  disabled={out}
                  className={`btn ${done === p.id ? "bg-jeton text-encre" : "btn-encre"} px-5 py-2.5 text-[0.8rem]`}
                  onClick={() => {
                    p.items.forEach((i) => add({ productId: i.id, slug: i.slug, name: i.name, priceCents: i.price_cents, color: i.color }));
                    setDone(p.id);
                    setTimeout(() => setDone(null), 1800);
                  }}
                >
                  {out ? "Épuisé" : done === p.id ? "Pack ajouté" : "Ajouter le pack"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
