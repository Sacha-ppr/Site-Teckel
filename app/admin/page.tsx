import Link from "next/link";
import { Suspense } from "react";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { getDemoOrders, getDemoReservations } from "@/lib/demo-data";
import {
  ORDER_STATUS,
  SLOTS,
  SLOT_CAPACITY,
  addDays,
  formatDate,
  formatPrice,
  formulaName,
  formulaPriceCents,
  isOpenOn,
  parisToday,
  type Order,
  type Product,
  type Reservation,
} from "@/lib/catalog";

export default function Page() {
  return (
    <>
      <PageTitle title="Tableau de bord" subtitle="Activité du bar et de la boutique" />
      <Suspense fallback={<Skeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  await requireAdmin();
  const supabase = await getSupabase();
  const today = parisToday();
  const in7 = addDays(today, 6);
  const since30 = addDays(today, -29);

  const [{ data: resData }, { data: orderData }, { data: productData }] = await Promise.all([
    supabase
      .from("reservations")
      .select("*")
      .gte("date", today)
      .lte("date", in7)
      .neq("status", "annulee")
      .order("date")
      .order("slot"),
    supabase
      .from("orders")
      .select("*, order_items(product_name, quantity, unit_price_cents)")
      .gte("created_at", `${since30}T00:00:00`)
      .order("created_at", { ascending: false }),
    supabase.from("products").select("*").lte("stock", 5).order("stock"),
  ]);
  const reservations = resData && resData.length > 0 ? (resData as Reservation[]) : getDemoReservations();
  const orders = orderData && orderData.length > 0 ? (orderData as Order[]) : getDemoOrders();
  const lowStock = (productData ?? []) as Product[];

  const todays = reservations.filter((r) => r.date === today);
  const todayGuests = todays.reduce((n, r) => n + r.guests, 0);
  const openToday = isOpenOn(today);
  const todayFill = openToday ? todayGuests / (SLOTS.length * SLOT_CAPACITY) : 0;

  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const openDays = week.filter(isOpenOn);
  const weekGuests = reservations.reduce((n, r) => n + r.guests, 0);
  const weekFill = openDays.length ? weekGuests / (openDays.length * SLOTS.length * SLOT_CAPACITY) : 0;
  const weekBarRevenue = reservations.reduce((n, r) => n + r.guests * formulaPriceCents(r.formula), 0);

  const paidOrders = orders.filter((o) => o.status !== "annulee");
  const shopRevenue = paidOrders.reduce((n, o) => n + o.total_cents, 0);
  const toPrepare = orders.filter((o) => o.status === "payee" || o.status === "preparation");

  const pct = (x: number) => `${Math.round(x * 100)} %`;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          label="Couverts aujourd'hui"
          value={openToday ? String(todayGuests) : "Fermé"}
          hint={openToday ? `${todays.length} réservations · ${pct(todayFill)} de remplissage` : "Lundi et mardi"}
        />
        <Kpi label="Remplissage 7 jours" value={pct(weekFill)} hint={`${weekGuests} couverts réservés`} />
        <Kpi label="CA bar prévu (7 j)" value={formatPrice(weekBarRevenue)} hint="Selon les formules réservées" />
        <Kpi
          label="CA boutique (30 j)"
          value={formatPrice(shopRevenue)}
          hint={`${paidOrders.length} commandes · panier moyen ${formatPrice(paidOrders.length ? shopRevenue / paidOrders.length : 0)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title={`Planning du jour — ${formatDate(today)}`}
          actions={<Link href={`/admin/reservations?date=${today}`} className="text-xs font-medium text-slate-600 hover:text-slate-900">Détail →</Link>}
        >
          {openToday ? (
            <ul className="divide-y divide-slate-100">
              {SLOTS.map((slot) => {
                const booked = todays.filter((r) => r.slot === slot).reduce((n, r) => n + r.guests, 0);
                return (
                  <li key={slot} className="flex items-center gap-4 px-4 py-3 text-sm">
                    <span className="w-12 font-medium tabular-nums">{slot}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${booked >= SLOT_CAPACITY ? "bg-red-500" : booked >= SLOT_CAPACITY * 0.75 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(100, (booked / SLOT_CAPACITY) * 100)}%` }}
                      />
                    </div>
                    <span className="w-14 text-right tabular-nums text-slate-600">{booked}/{SLOT_CAPACITY}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-slate-500">Le bar est fermé aujourd&apos;hui.</p>
          )}
        </Panel>

        <Panel title="Remplissage des 7 prochains jours">
          <div className="flex h-48 items-end gap-2 px-4 pb-3 pt-6">
            {week.map((d) => {
              const guests = reservations.filter((r) => r.date === d).reduce((n, r) => n + r.guests, 0);
              const ratio = guests / (SLOTS.length * SLOT_CAPACITY);
              const open = isOpenOn(d);
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] tabular-nums text-slate-500">{open ? pct(ratio) : "—"}</span>
                  <div className="flex h-28 w-full items-end rounded bg-slate-100">
                    <div className="w-full rounded bg-slate-800" style={{ height: `${open ? Math.max(2, ratio * 100) : 0}%` }} />
                  </div>
                  <span className="text-[10px] uppercase text-slate-500">
                    {new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`))}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel
        title="Prochaines réservations"
        actions={<Link href="/admin/reservations" className="text-xs font-medium text-slate-600 hover:text-slate-900">Toutes →</Link>}
      >
        <Table head={["Date", "Créneau", "Nom", "Pers.", "Formule", "Chien", "Notes"]} empty={reservations.length === 0}>
          {reservations.slice(0, 10).map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap px-4 py-2 capitalize">{formatDate(r.date)}</td>
              <td className="px-4 py-2 tabular-nums">{r.slot}</td>
              <td className="px-4 py-2 font-medium text-slate-900">{r.contact_name}</td>
              <td className="px-4 py-2 tabular-nums">{r.guests}</td>
              <td className="px-4 py-2">{formulaName(r.formula)}</td>
              <td className="px-4 py-2">{r.with_own_dog ? "Oui" : "—"}</td>
              <td className="max-w-56 truncate px-4 py-2 text-slate-500">{r.notes ?? ""}</td>
            </tr>
          ))}
        </Table>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title={`Commandes à traiter (${toPrepare.length})`}
          actions={<Link href="/admin/commandes" className="text-xs font-medium text-slate-600 hover:text-slate-900">Toutes →</Link>}
        >
          <Table head={["N°", "Client", "Total", "Statut"]} empty={toPrepare.length === 0}>
            {toPrepare.slice(0, 6).map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 tabular-nums">#{o.id}</td>
                <td className="px-4 py-2">{o.shipping_name}</td>
                <td className="px-4 py-2 tabular-nums">{formatPrice(o.total_cents)}</td>
                <td className="px-4 py-2">{ORDER_STATUS[o.status]}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel
          title={`Alertes stock (${lowStock.length})`}
          actions={<Link href="/admin/produits" className="text-xs font-medium text-slate-600 hover:text-slate-900">Gérer →</Link>}
        >
          <Table head={["Produit", "Stock"]} empty={lowStock.length === 0}>
            {lowStock.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.name}</td>
                <td className={`px-4 py-2 font-semibold tabular-nums ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}>{p.stock}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}
