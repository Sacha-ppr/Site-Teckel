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
  slotLabel,
  type Order,
  type Reservation,
} from "@/lib/catalog";

export const metadata: Metadata = { title: "Mon compte" };

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <Suspense fallback={<div className="h-96 animate-pulse bg-tirage-2" />}>
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
          <h1 className="enseigne text-[clamp(2.4rem,6vw,4.2rem)]">Bonjour {user.fullName ?? ""}</h1>
          <p className="mt-2 text-encre-douce">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="btn btn-ligne px-5 py-2 text-[0.8rem]">Se déconnecter</button>
        </form>
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="enseigne text-[2rem]">Mes réservations</h2>
          <Link href="/reserver" className="btn btn-jeton px-5 py-2.5 text-[0.8rem]">Nouvelle réservation</Link>
        </div>
        {(reservations as Reservation[] | null)?.length ? (
          <ul className="mt-5 border-t-2 border-encre">
            {(reservations as Reservation[]).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 border-b-2 border-encre py-4">
                <div className="flex-1">
                  <p className="text-lg font-extrabold first-letter:uppercase">{formatDate(r.date)} · {slotLabel(r.slot)}</p>
                  <p className="text-encre-douce">
                    {formulaName(r.formula)} · {r.guests} pers.{r.with_own_dog ? " · avec mon teckel" : ""}
                  </p>
                </div>
                <span className={`legende rounded-full px-3 py-1.5 ${r.status === "confirmee" ? "bg-jeton" : r.status === "annulee" ? "bg-tirage-2 text-encre-douce" : "bg-encre text-tirage"}`}>{RESERVATION_STATUS[r.status]}</span>
                {r.status === "confirmee" && r.date >= today ? (
                  <form action={cancelMyReservation}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-sm font-bold text-rouge underline hover:no-underline">Annuler</button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 border-y-2 border-encre py-6 text-lg text-encre-douce">Aucune réservation pour l&apos;instant. Les teckels vous attendent.</p>
        )}
      </section>

      <section className="mt-14">
        <h2 className="enseigne text-[2rem]">Mes commandes</h2>
        {(orders as Order[] | null)?.length ? (
          <ul className="mt-5 border-t-2 border-encre">
            {(orders as Order[]).map((o) => (
              <li key={o.id} className="border-b-2 border-encre py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="flex-1 text-lg font-extrabold">
                    Commande n° {o.id}
                    <span className="ml-2 text-sm font-normal text-encre-douce">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                  <span className={`legende rounded-full px-3 py-1.5 ${o.status === "annulee" ? "bg-tirage-2 text-encre-douce" : "bg-encre text-tirage"}`}>{ORDER_STATUS[o.status]}</span>
                  <span className="text-lg font-extrabold tabular-nums">{formatPrice(o.total_cents)}</span>
                </div>
                <p className="mt-1 text-encre-douce">
                  {o.order_items.map((i) => `${i.quantity} × ${i.product_name}`).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 border-y-2 border-encre py-6 text-lg text-encre-douce">Aucune commande pour l&apos;instant.</p>
        )}
      </section>
    </>
  );
}
