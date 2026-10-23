"use client";

import { useEffect, useMemo, useState } from "react";
import { dateFr, dateFrFull, euros, loadDb, bookedCount, type BookingStatus, type AdminDb } from "@/lib/admin";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  honored: "Honorée",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-teal-100 text-teal-800",
  cancelled: "bg-stone-200 text-stone-500 line-through decoration-1",
  honored: "bg-stone-100 text-stone-700",
};

/** transition autorisée : statut courant → liste de statuts acessibles */
const NEXT: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["honored", "cancelled"],
  honored: [],
  cancelled: [],
};

export default function AdminReservations() {
  const [db, setDb] = useState<AdminDb | null>(null);
  const [tab, setTab] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    setDb(loadDb());
    const on = () => setDb(loadDb());
    window.addEventListener("bar-a-teckel:db-change", on);
    return () => window.removeEventListener("bar-a-teckel:db-change", on);
  }, []);

  const rows = useMemo(() => {
    if (!db) return [];
    const list = [...db.bookings].sort((a, b) => (a.date < b.date ? 1 : -1));
    return tab === "all" ? list : list.filter((b) => b.status === tab);
  }, [db, tab]);

  const counts = useMemo(() => {
    if (!db) return null;
    const c: Record<string, number> = { all: db.bookings.length };
    for (const s of ["pending", "confirmed", "cancelled", "honored"] as BookingStatus[]) {
      c[s] = db.bookings.filter((b) => b.status === s).length;
    }
    return c;
  }, [db]);

  const setStatus = (id: string, status: BookingStatus) => {
    const fresh = loadDb();
    const clone: AdminDb = JSON.parse(JSON.stringify(fresh));
    const booking = clone.bookings.find((b) => b.id === id);
    if (booking) booking.status = status;
    localStorage.setItem("bar-a-teckel-db-v1", JSON.stringify(clone));
    window.dispatchEvent(new CustomEvent("bar-a-teckel:db-change"));
  };

  if (!db || !counts) return <p className="p-8 text-stone-400">Le planning se déroule sans griffer…</p>;

  const tabs: { key: BookingStatus | "all"; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "En attente" },
    { key: "confirmed", label: "Confirmées" },
    { key: "honored", label: "Honorées" },
    { key: "cancelled", label: "Annulées" },
  ];

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
          <p className="mt-1 text-sm text-stone-500">
            {counts.pending} en attente de confirmation — un chien n&apos;attend pas éternellement devant la gamelle.
          </p>
        </div>
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
              <th className="px-4 py-3 font-semibold">Quand</th>
              <th className="px-4 py-3 font-semibold">Teckel</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Créneau</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 60).map((b) => {
              const dog = db.teckels.find((t) => t.id === b.teckelId);
              const full = dog && b.date ? `${bookedCount(db, b.teckelId, b.date)}/${dog.maxPerDay}` : "";
              return (
                <tr key={b.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/70">
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{b.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{dateFrFull(b.date)}</div>
                    <div className="text-xs text-stone-400">{dateFr(b.date)} · {b.time}</div>
                  </td>
                  <td className="px-4 py-3">{dog?.name ?? "?"}<div className="text-[11px] text-stone-400">{full} rempli ce jour</div></td>
                  <td className="px-4 py-3">{b.customer}</td>
                  <td className="px-4 py-3">
                    {b.duration} min · {b.people} pers.
                    {b.extras.length > 0 && (
                      <div className="text-[11px] text-stone-400">+ {b.extras.join(", ")}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{euros(b.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      {NEXT[b.status].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatus(b.id, s);
                            setDb(loadDb());
                          }}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            s === "cancelled"
                              ? "text-stone-400 hover:bg-stone-100 hover:text-rose-700"
                              : "text-amber-800 hover:bg-amber-50"
                          }`}
                        >
                          {s === "cancelled" ? "Annuler" : s === "confirmed" ? "Confirmer" : "Marquer honorée"}
                        </button>
                      ))}
                      {NEXT[b.status].length === 0 && <span className="text-xs text-stone-300">—</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-stone-400">
                  Rien dans cette pile. Les teckels font la sieste.
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
