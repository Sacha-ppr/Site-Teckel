"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { placeOrder, type CheckoutState } from "@/app/actions/orders";
import { useCart } from "@/components/cart-provider";
import { Teckel } from "@/components/teckel";
import { formatPrice } from "@/lib/catalog";

const FREE_SHIPPING_CENTS = 6000;
const SHIPPING_CENTS = 590;

export function Checkout() {
  const { items, totalCents, setQuantity, clear } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") clear();
  }, [state, clear]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-10 text-center">
        <Teckel className="mx-auto h-16 w-auto" />
        <h2 className="mt-4 font-display text-3xl font-semibold">Merci pour votre commande !</h2>
        <p className="mt-2 text-ink-soft">Commande n° {state.orderId} — vous pouvez la suivre depuis votre compte.</p>
        <Link href="/compte" className="btn mt-6 bg-caramel text-white hover:bg-caramel-dark">Voir mes commandes</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-10 text-center">
        <p className="text-ink-soft">Votre panier est vide.</p>
        <Link href="/boutique" className="btn mt-6 bg-caramel text-white hover:bg-caramel-dark">Découvrir la boutique</Link>
      </div>
    );
  }

  const shipping = totalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <ul className="divide-y divide-line rounded-2xl border border-line bg-paper">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-4">
            <div className="w-20 shrink-0 rounded-lg p-2" style={{ backgroundColor: `${item.color}22` }}>
              <Teckel color={item.color} className="w-full" />
            </div>
            <div className="flex-1">
              <Link href={`/boutique/${item.slug}`} className="font-semibold hover:text-caramel">{item.name}</Link>
              <p className="text-sm text-ink-soft">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center rounded-full border border-line">
              <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Retirer un">−</button>
              <span className="w-6 text-center tabular-nums">{item.quantity}</span>
              <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="Ajouter un">+</button>
            </div>
            <p className="w-20 text-right font-semibold tabular-nums">{formatPrice(item.priceCents * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <form action={action} className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 h-fit">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ product_id: i.productId, quantity: i.quantity })))}
        />
        <h2 className="font-display text-2xl font-semibold">Livraison</h2>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nom complet
          <input name="shipping_name" required className="field" autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Adresse
          <textarea name="shipping_address" required rows={3} className="field" autoComplete="street-address" />
        </label>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Sous-total</dt><dd className="tabular-nums">{formatPrice(totalCents)}</dd></div>
          <div className="flex justify-between"><dt>Livraison</dt><dd className="tabular-nums">{shipping ? formatPrice(shipping) : "Offerte"}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt>Total</dt><dd className="tabular-nums">{formatPrice(totalCents + shipping)}</dd>
          </div>
        </dl>
        {state.status === "error" ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {state.error}{" "}
            {state.needsLogin ? <Link href="/connexion?next=/panier" className="font-semibold underline">Se connecter</Link> : null}
          </p>
        ) : null}
        <button disabled={pending} className="btn bg-caramel text-white hover:bg-caramel-dark">
          {pending ? "Validation…" : "Valider et payer"}
        </button>
        <p className="text-xs text-ink-soft">Paiement simulé pour la démo — aucun débit réel.</p>
      </form>
    </div>
  );
}
