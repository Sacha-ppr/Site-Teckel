import type { Metadata } from "next";
import { Suspense } from "react";
import { adjustStock, updateProduct } from "@/app/actions/admin";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { CATEGORIES, STOCK_REASONS, formatPrice, type Product, type StockMovement } from "@/lib/catalog";

export const metadata: Metadata = { title: "Produits & stock" };

export default function Page() {
  return (
    <>
      <PageTitle title="Produits & stock" subtitle="Prix, quantités disponibles et visibilité en boutique" />
      <Suspense fallback={<Skeleton />}>
        <Products />
      </Suspense>
    </>
  );
}

async function Products() {
  await requireAdmin();
  const supabase = await getSupabase();
  const [{ data }, { data: movementData }] = await Promise.all([
    supabase.from("products").select("*").order("category").order("name"),
    supabase.from("stock_movements").select("*, products(name)").order("created_at", { ascending: false }).limit(20),
  ]);
  const products = (data ?? []) as Product[];
  const movements = (movementData ?? []) as StockMovement[];

  const stockValue = products.reduce((n, p) => n + p.stock * p.price_cents, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Références" value={String(products.length)} hint={`${products.filter((p) => p.active).length} en ligne`} />
        <Kpi label="Valeur du stock" value={formatPrice(stockValue)} hint="Au prix de vente" />
        <Kpi label="Ruptures" value={String(outOfStock)} />
        <Kpi label="Stock faible (≤ 5)" value={String(products.filter((p) => p.stock > 0 && p.stock <= 5).length)} />
      </div>
      <Panel title="Catalogue">
        <Table head={["Produit", "Catégorie", "Prix (€)", "Stock", "En ligne", ""]} empty={products.length === 0}>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2 font-medium">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: p.color }} />
                {p.name}
              </td>
              <td className="px-4 py-2 text-slate-600">{CATEGORIES[p.category]}</td>
              <td className="px-4 py-2" colSpan={4}>
                <form action={updateProduct} className="flex items-center gap-6">
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    name="price"
                    defaultValue={(p.price_cents / 100).toFixed(2)}
                    inputMode="decimal"
                    className="w-20 rounded-md border border-slate-300 px-2 py-1 tabular-nums"
                    aria-label="Prix"
                  />
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    defaultValue={p.stock}
                    className={`w-20 rounded-md border px-2 py-1 tabular-nums ${p.stock === 0 ? "border-red-400" : p.stock <= 5 ? "border-amber-400" : "border-slate-300"}`}
                    aria-label="Stock"
                  />
                  <input type="checkbox" name="active" defaultChecked={p.active} className="h-4 w-4" aria-label="En ligne" />
                  <button className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700">
                    Enregistrer
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Mouvement de stock">
          <form action={adjustStock} className="grid gap-3 p-4 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Produit</span>
              <select name="product_id" required className="rounded-md border border-slate-300 bg-white px-2 py-1.5">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (stock {p.stock})</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Sens</span>
                <select name="direction" defaultValue="entree" className="rounded-md border border-slate-300 bg-white px-2 py-1.5">
                  <option value="entree">Entrée</option>
                  <option value="sortie">Sortie</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Quantité</span>
                <input name="quantity" type="number" min={1} required defaultValue={1} className="rounded-md border border-slate-300 px-2 py-1.5 tabular-nums" />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Motif</span>
              <select name="reason" defaultValue="livraison" className="rounded-md border border-slate-300 bg-white px-2 py-1.5">
                {Object.entries(STOCK_REASONS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Note (facultative)</span>
              <input name="note" maxLength={200} className="rounded-md border border-slate-300 px-2 py-1.5" />
            </label>
            <button className="justify-self-start rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">
              Enregistrer le mouvement
            </button>
          </form>
        </Panel>

        <Panel title="Derniers mouvements">
          <Table head={["Date", "Produit", "Mouvement", "Motif", "Note"]} empty={movements.length === 0}>
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap px-4 py-2 tabular-nums text-slate-500">
                  {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                </td>
                <td className="px-4 py-2 font-medium">{m.products?.name ?? "Produit supprimé"}</td>
                <td className={`px-4 py-2 font-semibold tabular-nums ${m.delta > 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {m.delta > 0 ? `+${m.delta}` : m.delta}
                </td>
                <td className="px-4 py-2">{STOCK_REASONS[m.reason]}</td>
                <td className="max-w-48 truncate px-4 py-2 text-slate-500" title={m.note ?? ""}>{m.note ?? ""}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}
