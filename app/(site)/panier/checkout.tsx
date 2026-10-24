"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { placeOrder, type CheckoutState } from "@/app/actions/orders";
import { cartKey, useCart } from "@/components/cart-provider";
import { ProductPhoto } from "@/components/product-photo";
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
      <div className="panneau max-w-2xl p-8 sm:p-10">
        <p className="compteur text-[4rem]">N° {state.orderId}</p>
        <h2 className="enseigne mt-2 text-[2.4rem]">Merci pour votre commande</h2>
        <p className="mt-3 text-lg text-chrome-clair">Vous pouvez la suivre depuis votre compte.</p>
        <Link href="/compte" className="btn btn-jeton mt-7">Voir mes commandes</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl border-y-2 border-encre py-10">
        <p className="enseigne text-[2rem]">Rien dans la boîte pour l&apos;instant</p>
        <p className="mt-3 text-lg text-encre-douce">Harnais, rampes, manteaux : tout est pensé pour les dos longs.</p>
        <Link href="/boutique" className="btn btn-encre mt-7">Découvrir la boutique</Link>
      </div>
    );
  }

  const shipping = totalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
      <ul className="tirage divide-y-2 divide-tirage-2 p-2 sm:p-3">
        {items.map((item) => (
          <li key={cartKey(item)} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-2 sm:flex-nowrap">
            <ProductPhoto slug={item.slug} alt="" sizes="80px" className="aspect-square w-16 shrink-0 sm:w-20" />
            <div className="min-w-0 flex-1">
              <Link href={`/boutique/${item.slug}`} className="font-bold hover:text-rouge">{item.name}</Link>
              <p className="text-sm text-encre-douce tabular-nums">
                {item.variant ? `Taille ${item.variant} · ` : ""}
                {formatPrice(item.priceCents)}
              </p>
            </div>
            <div className="flex items-center rounded-full border-2 border-encre">
              <button type="button" className="grid size-9 place-items-center rounded-full hover:bg-jeton" onClick={() => setQuantity(cartKey(item), item.quantity - 1)} aria-label={`Retirer un ${item.name}`}>
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8h10" strokeLinecap="round" /></svg>
              </button>
              <span className="w-7 text-center font-bold tabular-nums">{item.quantity}</span>
              <button type="button" className="grid size-9 place-items-center rounded-full hover:bg-jeton" onClick={() => setQuantity(cartKey(item), item.quantity + 1)} aria-label={`Ajouter un ${item.name}`}>
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v10M3 8h10" strokeLinecap="round" /></svg>
              </button>
            </div>
            <p className="w-24 text-right text-lg font-extrabold tabular-nums">{formatPrice(item.priceCents * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <form action={action} className="panneau flex h-fit flex-col gap-4 p-6">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ product_id: i.productId, quantity: i.quantity, variant: i.variant ?? null })))}
        />
        <h2 className="enseigne text-[1.8rem]">Livraison</h2>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Nom complet
          <input name="shipping_name" required className="field" autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Adresse
          <textarea name="shipping_address" required rows={3} className="field" autoComplete="street-address" />
        </label>
        <dl className="mt-2 space-y-1.5 text-chrome-clair">
          <div className="flex justify-between"><dt>Sous-total</dt><dd className="tabular-nums">{formatPrice(totalCents)}</dd></div>
          <div className="flex justify-between"><dt>Livraison</dt><dd className="tabular-nums">{shipping ? formatPrice(shipping) : "Offerte"}</dd></div>
          <div className="flex items-baseline justify-between border-t border-[#444] pt-3 text-tirage">
            <dt className="legende">Total</dt><dd className="compteur text-[2.6rem]">{formatPrice(totalCents + shipping)}</dd>
          </div>
        </dl>
        {state.status === "error" ? (
          <p role="alert" className="rounded-lg bg-rose p-3 text-sm font-bold text-rouge-fonce">
            {state.error}{" "}
            {state.needsLogin ? <Link href="/connexion?next=/panier" className="font-semibold underline">Se connecter</Link> : null}
          </p>
        ) : null}
        <button disabled={pending} className="btn btn-jeton py-4">
          {pending ? "Validation…" : "Valider et payer"}
        </button>
        <p className="text-sm text-chrome-clair">Paiement simulé pour la démo : aucun débit réel.</p>
      </form>
    </div>
  );
}
