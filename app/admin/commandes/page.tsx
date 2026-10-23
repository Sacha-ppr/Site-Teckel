import type { Metadata } from "next";
import { Suspense } from "react";
import { setOrderStatus } from "@/app/actions/admin";
import { StatusSelect } from "@/components/admin/status-select";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { ORDER_STATUS, formatPrice, type Order } from "@/lib/catalog";

export const metadata: Metadata = { title: "Commandes" };

export default function Page() {
  return (
    <>
      <PageTitle title="Commandes" subtitle="Ventes de la boutique en ligne" />
      <Suspense fallback={<Skeleton />}>
        <Orders />
      </Suspense>
    </>
  );
}

async function Orders() {
  await requireAdmin();
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(product_name, quantity, unit_price_cents)")
    .order("created_at", { ascending: false })
    .limit(200);
  const orders = (data ?? []) as Order[];

  const valid = orders.filter((o) => o.status !== "annulee");
  const revenue = valid.reduce((n, o) => n + o.total_cents, 0);
  const units = valid.reduce((n, o) => n + o.order_items.reduce((m, i) => m + i.quantity, 0), 0);
  const pending = orders.filter((o) => o.status === "payee" || o.status === "preparation").length;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Chiffre d'affaires" value={formatPrice(revenue)} hint={`${valid.length} commandes`} />
        <Kpi label="Panier moyen" value={formatPrice(valid.length ? revenue / valid.length : 0)} />
        <Kpi label="Articles vendus" value={String(units)} />
        <Kpi label="À expédier" value={String(pending)} />
      </div>
      <Panel title="Toutes les commandes">
        <Table head={["N°", "Date", "Client", "Adresse", "Articles", "Total", "Statut"]} empty={orders.length === 0}>
          {orders.map((o) => (
            <tr key={o.id} className={o.status === "annulee" ? "text-slate-400" : undefined}>
              <td className="px-4 py-2 tabular-nums">#{o.id}</td>
              <td className="whitespace-nowrap px-4 py-2">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="px-4 py-2 font-medium">{o.shipping_name}</td>
              <td className="max-w-48 truncate px-4 py-2 text-slate-500" title={o.shipping_address}>{o.shipping_address}</td>
              <td className="px-4 py-2 text-slate-600">
                {o.order_items.map((i) => `${i.quantity}× ${i.product_name}`).join(", ")}
              </td>
              <td className="px-4 py-2 font-medium tabular-nums">{formatPrice(o.total_cents)}</td>
              <td className="px-4 py-2">
                <StatusSelect id={o.id} value={o.status} options={ORDER_STATUS} action={setOrderStatus} />
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
