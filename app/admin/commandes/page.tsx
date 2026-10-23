"use client";

import { useEffect, useMemo, useState } from "react";
import { dateFrFull, euros, loadDb, type OrderStatus, type AdminDb } from "@/lib/admin";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "À traiter",
  shipped: "Expédiée",
  delivered: "Livrée / retirée",
  cancelled: "Annulée",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-stone-100 text-stone-700",
  cancelled: "bg-stone-200 text-stone-500 line-through decoration-1",
};

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["shipped", "delivered", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const ACTION_LABEL: Record<OrderStatus, string> = {
  pending: "Traiter",
  shipped: "Expédier",
  delivered: "Marquer livrée",
  cancelled: "Annuler",
};

export default function AdminOrders() {
  const [db, setDb] = useState<AdminDb | null>(null);
  const [tab, setTab] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    setDb(loadDb());
    const on = () => setDb(loadDb());
    window.addEventListener("bar-a-teckel:db-change", on);
    return () => window.removeEventListener("bar-a-teckel:db-change", on);
  }, []);

  const rows = useMemo(() => {
    if (!db) return [];
    const list = [...db.orders].sort((a, b) => (a.date < b.date ? 1 : -1));
    return tab === "all" ? list : list.filter((o) => o.status === tab);
  }, [db, tab]);

  const counts = useMemo(() => {
    if (!db) return null;
    const c: Record<string, number> = { all: db.orders.length };
    for (const s of ["pending", "shipped", "delivered", "cancelled"] as OrderStatus[]) {
      c[s] = db.orders.filter((o) => o.status === s).length;
    }
    return c;
  }, [db]);

  const setStatus = (id: string, status: OrderStatus) => {
    const clone: AdminDb = JSON.parse(JSON.stringify(loadDb()));
    const order = clone.orders.find((o) => o.id === id);
    if (order) order.status = status;
    localStorage.setItem("bar-a-teckel-db-v1", JSON.stringify(clone));
    window.dispatchEvent(new CustomEvent("bar-a-teckel:db-change"));
  };

  if (!db || !counts) return <p className="p-8 text-stone-400">La pile de colis se tasse uniformément…</p>;

  const tabs: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "À traiter" },
    { key: "shipped", label: "Expédiées" },
    { key: "delivered", label: "Livrées" },
    { key: "cancelled", label: "Annulées" },
  ];

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>
        <p className="mt-1 text-sm text-stone-500">
          {counts.pending} commande{counts.pending > 1 ? "s" : ""} à traiter — le scotch d&apos;emballage est déjà en travers.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-60 tabular-nums">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-[11px] uppercase tracking-wider text-stone-400">
              <th className="px-4 py-3 font-semibold">Réf.</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Articles</th>
              <th className="px-4 py-3 font-semibold">Mode</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 60).map((o) => (
              <tr key={o.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/70">
                <td className="px-4 py-3 font-mono text-xs text-stone-400">{o.id}</td>
                <td className="px-4 py-3">{dateFrFull(o.date)}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="max-w-64 px-4 py-3">
                  <div className="truncate text-stone-600" title={o.items.join(" · ")}>
                    {o.items.join(" · ")}
                  </div>
                  <div className="text-[11px] text-stone-400">{o.items.length} article{o.items.length > 1 ? "s" : ""}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs">{o.mode}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{euros(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    {NEXT[o.status].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatus(o.id, s);
                          setDb(loadDb());
                        }}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          s === "cancelled"
                            ? "text-stone-400 hover:bg-stone-100 hover:text-rose-700"
                            : s === "shipped"
                              ? "text-sky-800 hover:bg-sky-50"
                              : "text-teal-800 hover:bg-teal-50"
                        }`}
                      >
                        {ACTION_LABEL[s]}
                      </button>
                    ))}
                    {NEXT[o.status].length === 0 && <span className="text-xs text-stone-300">—</span>}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-stone-400">
                  Aucune commande ici. Le carton à monter reste vide et il n&apos;en est pas fâché.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 60 && (
        <p className="mt-3 text-xs text-stone-400">60 premières lignes affichées sur {rows.length}.</p>
      )}
    </div>
  );
}
