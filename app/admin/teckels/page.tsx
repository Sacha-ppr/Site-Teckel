"use client";

import { useEffect, useState } from "react";
import { euros, loadDb, toTodayISO, bookedCount, dateFr, type Teckel, type AdminDb } from "@/lib/admin";

const DAYS = ["", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function Rooster({ days }: { days: number[] }) {
  return (
    <div className="flex gap-1">
      {DAYS.slice(1).map((_, i) => {
        const d = i + 1;
        return (
          <span
            key={d}
            title={DAYS[d]}
            className={`grid h-6 w-6 place-items-center rounded text-[10px] font-semibold ${
              days.includes(d) ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-400"
            }`}
          >
            {DAYS[d][0]}
          </span>
        );
      })}
    </div>
  );
}

export default function AdminTeckels() {
  const [db, setDb] = useState<AdminDb | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Teckel | null>(null);

  useEffect(() => {
    setDb(loadDb());
    const on = () => setDb(loadDb());
    window.addEventListener("bar-a-teckel:db-change", on);
    return () => window.removeEventListener("bar-a-teckel:db-change", on);
  }, []);

  const persist = (next: Teckel) => {
    const clone: AdminDb = JSON.parse(JSON.stringify(loadDb()));
    const i = clone.teckels.findIndex((t) => t.id === next.id);
    if (i >= 0) clone.teckels[i] = next;
    localStorage.setItem("bar-a-teckel-db-v1", JSON.stringify(clone));
    window.dispatchEvent(new CustomEvent("bar-a-teckel:db-change"));
    setEditing(null);
    setDraft(null);
  };

  if (!db) return <p className="p-8 text-stone-400">Les fiches se lissent au brossage doux…</p>;

  const today = toTodayISO();
  const week = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Teckels</h1>
        <p className="mt-1 text-sm text-stone-500">
          Disponibilités, quotas et tarifs. Le repos, c&apos;est sacré — un teckel fatigué gâche l&apos;apéro.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {db.teckels.map((t) => {
          const isEditing = editing === t.id;
          const dog = isEditing ? (draft ?? t) : t;
          const todayCount = bookedCount(db, t.id, today);
          return (
            <article key={t.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    {t.name}
                    {!t.active && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-400">En congé patte</span>}
                  </h2>
                  <p className="text-sm italic text-stone-500">{t.trait} — poils {t.coat.toLowerCase()}</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => { setEditing(t.id); setDraft({ ...t }); }}
                    className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-50"
                  >
                    Modifier
                  </button>
                ) : (
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => { setEditing(null); setDraft(null); }}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => draft && persist(draft)}
                      className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                <span>
                  <span className="text-stone-400">Aujourd&apos;hui :</span>{" "}
                  <strong className="tabular-nums">{todayCount}/{t.maxPerDay}</strong> séances
                </span>
                <span>
                  <span className="text-stone-400">Créneau :</span> {t.startHour} h – {t.endHour} h
                </span>
                <span>
                  <span className="text-stone-400">Tarif :</span> {euros(t.price)} / pers.
                </span>
              </div>

              {isEditing && dog ? (
                <div className="mt-4 space-y-3 rounded-lg bg-stone-50 p-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="min-w-0">
                      <span className="mb-1 block text-xs font-medium text-stone-500">Début (h)</span>
                      <input
                        type="number" min={8} max={23}
                        value={dog.startHour}
                        onChange={(e) => setDraft({ ...dog, startHour: Number(e.target.value) })}
                        className="w-full rounded-md border border-stone-200 px-2.5 py-1.5"
                      />
                    </label>
                    <label className="min-w-0">
                      <span className="mb-1 block text-xs font-medium text-stone-500">Fin (h)</span>
                      <input
                        type="number" min={8} max={24}
                        value={dog.endHour}
                        onChange={(e) => setDraft({ ...dog, endHour: Number(e.target.value) })}
                        className="w-full rounded-md border border-stone-200 px-2.5 py-1.5"
                      />
                    </label>
                    <label className="min-w-0">
                      <span className="mb-1 block text-xs font-medium text-stone-500">Max séances / jour</span>
                      <input
                        type="number" min={1} max={10}
                        value={dog.maxPerDay}
                        onChange={(e) => setDraft({ ...dog, maxPerDay: Number(e.target.value) })}
                        className="w-full rounded-md border border-stone-200 px-2.5 py-1.5"
                      />
                    </label>
                    <label className="min-w-0">
                      <span className="mb-1 block text-xs font-medium text-stone-500">Tarif / pers. (€)</span>
                      <input
                        type="number" min={5}
                        value={dog.price}
                        onChange={(e) => setDraft({ ...dog, price: Number(e.target.value) })}
                        className="w-full rounded-md border border-stone-200 px-2.5 py-1.5"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-stone-500">Personnalité (fiche publique)</span>
                    <input
                      value={dog.trait}
                      onChange={(e) => setDraft({ ...dog, trait: e.target.value })}
                      className="w-full rounded-md border border-stone-200 px-2.5 py-1.5"
                    />
                  </label>
                  <div>
                    <span className="mb-1 block text-xs font-medium text-stone-500">Jours de service</span>
                    <div className="flex gap-1">
                      {week.map((label, i) => {
                        const d = i + 1;
                        const on = dog.workingDays.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...dog,
                                workingDays: on
                                  ? dog.workingDays.filter((x) => x !== d)
                                  : [...dog.workingDays, d].sort(),
                              })
                            }
                            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                              on ? "bg-stone-900 text-white" : "bg-white text-stone-400 ring-1 ring-stone-200"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 pt-1 text-sm">
                    <input
                      type="checkbox"
                      checked={dog.active}
                      onChange={(e) => setDraft({ ...dog, active: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span>Actif — visible et réservable sur le site</span>
                  </label>
                </div>
              ) : (
                <div className="mt-4">
                  <Rooster days={t.workingDays} />
                  <div className="mt-3 grid grid-cols-4 rounded-lg bg-stone-50 text-center text-[11px]">
                    {week.map((label, i) => {
                      const dt = new Date(Date.now() + i * 86400000);
                      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
                      const dow = dt0(iso);
                      const works = t.workingDays.includes(dow);
                      const n = bookedCount(db, t.id, iso);
                      return (
                        <div key={label} className="border-r border-stone-200/70 p-2 last:border-0">
                          <p className="font-semibold text-stone-500">{label}</p>
                          <p className="mt-0.5 font-bold tabular-nums">
                            {works ? `${n}/${t.maxPerDay}` : "—"}
                          </p>
                          <p className="text-stone-400">{dateFr(iso)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** jour (1–7) d'une date iso */
function dt0(iso: string): number {
  const d = new Date(iso + "T12:00:00").getDay();
  return d === 0 ? 7 : d;
}
