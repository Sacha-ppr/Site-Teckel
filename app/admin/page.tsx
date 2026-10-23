"use client";

import { useEffect, useState } from "react";
import { euros, eurosPrecise, dateFr, loadDb, revenueByDay, type AdminDb } from "@/lib/admin";

// Les écritures en caisse comptent : honorées et confirmées (résa) + non annulées (boutique).
// Les annulations restent visibles dans le journal du jour sur l'écran Réservations.

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{label}</p>
      <p className="mt-1.5 text-3xl font-bold tracking-tight text-stone-900">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{sub}</p>
    </div>
  );
}

function Donut({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const R = 60, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90">
        {slices.map((s) => {
          const frac = s.value / total;
          const dash = `${frac * C} ${C - frac * C}`;
          const el = (
            <circle
              key={s.label}
              cx="80" cy="80" r={R} fill="none"
              stroke={s.color} strokeWidth="16"
              strokeDasharray={dash} strokeDashoffset={-acc * C}
            />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-2 text-sm">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="truncate text-stone-600">{s.label}</span>
            </span>
            <span className="font-semibold tabular-nums">{euros(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineChart({ data }: { data: { date: string; total: number }[] }) {
  const W = 560, H = 160, PADX = 6, PADY = 12;
  const max = Math.max(...data.map((d) => d.total), 100);
  const stepX = (W - 2 * PADX) / Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => [PADX + i * stepX, H - PADY - (d.total / max) * (H - 2 * PADY)] as const);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${H - PADY} L${pts[0][0].toFixed(1)},${H - PADY} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none" role="img" aria-label="Évolution du chiffre d'affaires sur 30 jours">
      <path d={area} fill="rgb(217 119 6 / 0.08)" />
      <path d={path} fill="none" stroke="rgb(180 83 9)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="rgb(180 83 9)" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [db, setDb] = useState<AdminDb | null>(null);

  useEffect(() => {
    setDb(loadDb());
    const on = () => setDb(loadDb());
    window.addEventListener("bar-a-teckel:db-change", on);
    return () => window.removeEventListener("bar-a-teckel:db-change", on);
  }, []);

  if (!db) {
    return <p className="p-8 text-stone-400">Récupération du carnet de patouilles…</p>;
  }

  const daily = revenueByDay(db, 30);
  const today = daily[daily.length - 1];
  const week = daily.slice(-7).reduce((s, d) => s + d.total, 0);
  const month = daily.reduce((s, d) => s + d.total, 0);

  const mix = [
    { label: "Réservations", value: month && daily.reduce((s, d) => s + d.reservations, 0), color: "rgb(180 83 9)" },
    { label: "Boutique", value: month && daily.reduce((s, d) => s + d.boutique, 0), color: "rgb(13 148 136)" },
    { label: "Dons", value: month && daily.reduce((s, d) => s + d.dons, 0), color: "rgb(124 58 237)" },
  ];

  // Occupation des teckels sur les 30 derniers jours
  const cutoff = new Date(Date.now() - 29 * 86400000);
  const past = db.bookings.filter((b) => new Date(b.date) >= cutoff && b.status !== "cancelled");
  const perDog = db.teckels
    .map((t) => ({
      ...t,
      count: past.filter((b) => b.teckelId === t.id).length,
      ca: past.filter((b) => b.teckelId === t.id).reduce((s, b) => s + b.total, 0),
      capacity: t.workingDays.length * (30 / 7) * t.maxPerDay, // ~30 jours ouvrés du chien
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...perDog.map((d) => d.count), 1);

  const cancellations = db.bookings.filter((b) => b.status === "cancelled").length;
  const totalBookings = db.bookings.length || 1;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Traqué le CA</h1>
        <p className="mt-1 text-sm text-stone-500">
         Jour pour jour, patouille pour patouille. Données de démonstration.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi label="CA du jour" value={euros(today.total)} sub={`${dateFr(today.date)} — toutes sources`} />
        <Kpi label="CA 7 jours" value={euros(week)} sub="Réservations + boutique + dons" />
        <Kpi label="CA 30 jours" value={euros(month)} sub={`≈ ${euros(month / 30)} / jour`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-semibold">CA des 30 derniers jours</h2>
            <p className="text-xs text-stone-400">hors annulations, toutes sources confondues</p>
          </div>
          <LineChart data={daily} />
          <div className="mt-2 flex justify-between text-[10px] text-stone-400">
            <span>{dateFr(daily[0].date)}</span>
            <span>aujourd&apos;hui</span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Ventilation 30 j</h2>
          <Donut slices={mix} />
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Les teckels ne sont pas payés en croquettes. Elles sont incluses.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Les teckels les plus demandés</h2>
          <ul className="space-y-3.5">
            {perDog.map((d, i) => (
              <li key={d.id} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-right text-xs text-stone-400 tabular-nums">{i + 1}</span>
                <span className="w-32 shrink-0 truncate font-medium">{d.name}</span>
                <div className="min-w-0 flex-1">
                  <div className="h-2.5 rounded-full bg-stone-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-stone-500 tabular-nums">
                  {d.count} créneaux · {euros(d.ca)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Santé du planning</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-wider text-stone-400">Taux de remplissage</dt>
              <dd className="mt-1 text-2xl font-bold">{Math.round((past.length / (perDog.reduce((s, d) => s + d.capacity, 0) || 1)) * 100)} %</dd>
              <p className="mt-1 text-xs text-stone-500">30 jours, tous teckels</p>
            </div>
            <div className="rounded-lg bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-wider text-stone-400">Annulations</dt>
              <dd className="mt-1 text-2xl font-bold">
                {Math.round((cancellations / totalBookings) * 100)} %
              </dd>
              <p className="mt-1 text-xs text-stone-500">{cancellations} réservations annulées sur 30 jours</p>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-stone-50 px-4 py-3 text-xs leading-relaxed text-stone-500">
            Créneaux les plus vides : lundis 14 h avec Bernadette, et vendredis 13 h.
            Une relance des habitués inhabituels pourrait remuer la queue du CA.
          </p>
          <p className="mt-3 text-xs text-stone-400">
            Pan moyen réservation : {eurosPrecise(
              db.bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0) /
              Math.max(db.bookings.filter((b) => b.status !== "cancelled").length, 1),
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
