import Link from "next/link";
import { CATEGORIES, formatPrice, type Product } from "@/lib/catalog";
import { AddToCart } from "./add-to-cart";
import { ProductPhoto } from "./product-photo";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="tirage flex flex-col">
      <Link href={`/boutique/${product.slug}`} className="group block" aria-label={product.name}>
        <ProductPhoto
          slug={product.slug}
          alt=""
          worn
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="aspect-square transition-transform duration-300 group-hover:scale-[1.015]"
        />
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <Link href={`/boutique/${product.slug}`} className="text-[1.05rem] leading-snug font-bold hover:text-rouge">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-encre-douce">{CATEGORIES[product.category]}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="text-[1.6rem] leading-none font-extrabold tabular-nums [font-stretch:80%]">
            {formatPrice(product.price_cents)}
          </span>
          <AddToCart product={product} compact />
        </div>
      </div>
    </article>
  );
}
