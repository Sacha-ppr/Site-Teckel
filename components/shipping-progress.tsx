import { FREE_SHIPPING_CENTS, formatPrice } from "@/lib/catalog";

// Jauge de livraison offerte : montre le chemin restant, sans pression.
export function ShippingProgress({ totalCents }: { totalCents: number }) {
  const missing = Math.max(0, FREE_SHIPPING_CENTS - totalCents);
  const pct = Math.min(100, Math.round((totalCents / FREE_SHIPPING_CENTS) * 100));

  return (
    <div role="status">
      <p className="font-bold">
        {missing === 0 ? (
          "Livraison offerte sur cette commande"
        ) : (
          <>
            Plus que <span className="tabular-nums">{formatPrice(missing)}</span> pour la livraison offerte
          </>
        )}
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-encre bg-tirage" aria-hidden>
        <div className="h-full bg-jeton transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
