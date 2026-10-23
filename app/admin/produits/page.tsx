import type { Metadata } from "next";
import { Suspense } from "react";
import { updateProduct } from "@/app/actions/admin";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { CATEGORIES, formatPrice, type Product } from "@/lib/catalog";

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
  const { data } = await supabase.from("products").select("*").order("category").order("name");
  const products = (data ?? []) as Product[];

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
    </div>
  );
}
