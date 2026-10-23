import Link from "next/link";
import { CATEGORIES, formatPrice, type Product } from "@/lib/catalog";
import { AddToCart } from "./add-to-cart";
import { Teckel } from "./teckel";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-paper p-4">
      <Link
        href={`/boutique/${product.slug}`}
        className="block rounded-xl p-6 transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: `${product.color}22` }}
      >
        <Teckel color={product.color} className="w-full" />
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {CATEGORIES[product.category]}
      </p>
      <Link href={`/boutique/${product.slug}`} className="mt-1 font-semibold hover:text-caramel">
        {product.name}
      </Link>
      <p className="mt-1 text-ink-soft">{formatPrice(product.price_cents)}</p>
      <div className="mt-auto pt-4">
        <AddToCart product={product} compact />
      </div>
    </div>
  );
}
