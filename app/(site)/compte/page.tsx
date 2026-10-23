import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { cancelMyReservation } from "@/app/actions/reservations";
import { getSupabase, requireUser } from "@/lib/auth";
import {
  ORDER_STATUS,
  RESERVATION_STATUS,
  formatDate,
  formatPrice,
  formulaName,
  parisToday,
  type Order,
  type Reservation,
} from "@/lib/catalog";

export const metadata: Metadata = { title: "Mon compte" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-paper" />}>
        <Account />
      </Suspense>
    </div>
  );
}

async function Account() {
  const user = await requireUser("/compte");
  const supabase = await getSupabase();
  const [{ data: reservations }, { data: orders }] = await Promise.all([
    supabase.from("reservations").select("*").eq("user_id", user.id).order("date", { ascending: false }),
    supabase
      .from("orders")
      .select("*, order_items(product_name, quantity, unit_price_cents)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const today = parisToday();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Bonjour {user.fullName ?? ""} 👋</h1>
          <p className="mt-1 text-ink-soft">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="text-sm font-semibold text-ink-soft hover:text-caramel">Se déconnecter</button>
        </form>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Mes réservations</h2>
          <Link href="/reserver" className="text-sm font-semibold text-caramel">Nouvelle réservation →</Link>
        </div>
        {(reservations as Reservation[] | null)?.length ? (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
            {(reservations as Reservation[]).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-semibold capitalize">{formatDate(r.date)} · {r.slot}</p>
                  <p className="text-sm text-ink-soft">
                    {formulaName(r.formula)} · {r.guests} pers.{r.with_own_dog ? " · avec mon teckel" : ""}
                  </p>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold">{RESERVATION_STATUS[r.status]}</span>
                {r.status === "confirmee" && r.date >= today ? (
                  <form action={cancelMyReservation}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-sm font-semibold text-red-700 hover:underline">Annuler</button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-ink-soft">Aucune réservation pour l&apos;instant.</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Mes commandes</h2>
        {(orders as Order[] | null)?.length ? (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
            {(orders as Order[]).map((o) => (
              <li key={o.id} className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="flex-1 font-semibold">
                    Commande n° {o.id}
                    <span className="ml-2 text-sm font-normal text-ink-soft">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold">{ORDER_STATUS[o.status]}</span>
                  <span className="font-semibold tabular-nums">{formatPrice(o.total_cents)}</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {o.order_items.map((i) => `${i.quantity} × ${i.product_name}`).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-ink-soft">Aucune commande pour l&apos;instant.</p>
        )}
      </section>
    </>
  );
}
