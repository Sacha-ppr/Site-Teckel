"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createReservation, type ReservationState } from "@/app/actions/reservations";
import { FORMULAS, SLOTS, SLOT_CAPACITY, formatDate, formatPrice, isOpenOn } from "@/lib/catalog";
import { createClient } from "@/utils/supabase/client";

function nextOpenDays(count: number) {
  const days: string[] = [];
  const cursor = new Date();
  while (days.length < count) {
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (isOpenOn(iso)) days.push(iso);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function ReservationForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState<ReservationState, FormData>(createReservation, {
    status: "idle",
  });
  const [days] = useState(() => nextOpenDays(14));
  const [date, setDate] = useState(days[0]);
  const [slot, setSlot] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [formula, setFormula] = useState<string>(FORMULAS[0].id);
  const [remaining, setRemaining] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .rpc("slot_availability", { p_date: date })
      .then(({ data }) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const row of (data ?? []) as { slot: string; remaining: number }[]) map[row.slot] = row.remaining;
        setRemaining(map);
      });
    return () => {
      cancelled = true;
    };
  }, [date, state]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-10 text-center">
        <h2 className="font-display text-3xl font-semibold">C&apos;est réservé !</h2>
        <p className="mt-3 text-ink-soft">
          On vous attend {formatDate(state.date)} à {state.slot.replace(":", " h ")}. Chorizo est prévenu.
        </p>
        <Link href="/compte" className="btn mt-6 bg-caramel text-white hover:bg-caramel-dark">
          Voir mes réservations
        </Link>
      </div>
    );
  }

  const selectedFormula = FORMULAS.find((f) => f.id === formula)!;

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="font-display text-xl font-semibold">1. Le jour</legend>
          <input type="hidden" name="date" value={date} />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const label = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
                .formatToParts(new Date(`${d}T00:00:00Z`));
              const get = (type: string) => label.find((p) => p.type === type)?.value;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDate(d);
                    setSlot("");
                    setRemaining(null);
                  }}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-xl border px-2 py-2 text-sm ${
                    date === d ? "border-caramel bg-caramel text-white" : "border-line bg-paper hover:border-caramel"
                  }`}
                >
                  <span className="text-xs uppercase">{get("weekday")}</span>
                  <span className="font-display text-xl font-semibold">{get("day")}</span>
                  <span className="text-xs">{get("month")}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold">2. Le créneau</legend>
          <input type="hidden" name="slot" value={slot} />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {SLOTS.map((s) => {
              const left = remaining?.[s] ?? SLOT_CAPACITY;
              const full = remaining !== null && left < guests;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={full || remaining === null}
                  onClick={() => setSlot(s)}
                  className={`rounded-xl border px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40 ${
                    slot === s ? "border-caramel bg-caramel text-white" : "border-line bg-paper hover:border-caramel"
                  }`}
                >
                  <span className="block font-semibold">{s.replace(":", " h ")}</span>
                  <span className="text-xs opacity-80">
                    {remaining === null ? "…" : left <= 0 ? "Complet" : `${left} place${left > 1 ? "s" : ""}`}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold">3. La formule</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {FORMULAS.map((f) => (
              <label
                key={f.id}
                className={`cursor-pointer rounded-xl border p-4 ${
                  formula === f.id ? "border-caramel bg-caramel/10" : "border-line bg-paper hover:border-caramel"
                }`}
              >
                <input
                  type="radio"
                  name="formula"
                  value={f.id}
                  checked={formula === f.id}
                  onChange={() => setFormula(f.id)}
                  className="sr-only"
                />
                <span className="block font-semibold">{f.name}</span>
                <span className="text-sm text-ink-soft">{formatPrice(f.priceCents)} · {f.duration}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex h-fit flex-col gap-4 rounded-2xl border border-line bg-paper p-6">
        <h2 className="font-display text-xl font-semibold">4. Vos informations</h2>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nombre de personnes
          <select
            name="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="field"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nom de la réservation
          <input name="contact_name" defaultValue={defaultName} required className="field" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Téléphone (facultatif)
          <input name="phone" type="tel" className="field" autoComplete="tel" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="with_own_dog" className="h-4 w-4 accent-caramel" />
          Je viens avec mon propre teckel
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Une précision ?
          <textarea name="notes" rows={2} className="field" placeholder="Anniversaire, allergie, chaise haute…" />
        </label>
        <div className="flex justify-between border-t border-line pt-3 font-semibold">
          <span>Total estimé</span>
          <span className="tabular-nums">{formatPrice(selectedFormula.priceCents * guests)}</span>
        </div>
        <p className="text-xs text-ink-soft">Réglé sur place. Annulation gratuite depuis votre compte.</p>
        {state.status === "error" ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>
        ) : null}
        <button disabled={pending || !slot} className="btn bg-caramel text-white hover:bg-caramel-dark">
          {pending ? "Réservation…" : slot ? `Réserver ${formatDate(date)} à ${slot}` : "Choisissez un créneau"}
        </button>
      </div>
    </form>
  );
}
