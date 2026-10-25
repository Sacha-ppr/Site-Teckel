"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import { createReservation, type ReservationState } from "@/app/actions/reservations";
import {
  FORMULAS,
  SLOTS,
  SLOT_CAPACITY,
  formatDate,
  formatPrice,
  nextOpenDays,
  slotLabel,
} from "@/lib/catalog";
import { useAvailability } from "@/lib/use-availability";

type Props = { defaultName: string; initialDate?: string; initialSlot?: string };

export function ReservationForm({ defaultName, initialDate, initialSlot }: Props) {
  const [state, action, pending] = useActionState<ReservationState, FormData>(createReservation, {
    status: "idle",
  });
  const [days] = useState(() => nextOpenDays(14));
  const [date, setDate] = useState(() => (initialDate && days.includes(initialDate) ? initialDate : days[0]));
  const [slot, setSlot] = useState<string>(() =>
    initialSlot && (SLOTS as readonly string[]).includes(initialSlot) && date === initialDate ? initialSlot : "",
  );
  const [guests, setGuests] = useState(2);
  const [formula, setFormula] = useState<string>(FORMULAS[0].id);
  const remaining = useAvailability(date, state);

  if (state.status === "success") {
    return (
      <div className="panneau max-w-2xl p-8 sm:p-10">
        <p className="compteur text-[4rem]">OK</p>
        <h2 className="enseigne mt-2 text-[2.4rem]">C&apos;est noté sur l&apos;ardoise</h2>
        <p className="mt-3 text-lg text-chrome-clair">
          On vous attend {formatDate(state.date)} à {slotLabel(state.slot)}. Chorizo est prévenu.
        </p>
        <Link href="/compte" className="btn btn-jeton mt-7">
          Voir mes réservations
        </Link>
      </div>
    );
  }

  const selectedFormula = FORMULAS.find((f) => f.id === formula)!;
  const slotLeft = slot ? (remaining?.[slot] ?? SLOT_CAPACITY) : null;

  return (
    <form action={action} className="tirage p-3 sm:p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Frame n={1} title="Le jour">
          <input type="hidden" name="date" value={date} />
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 md:grid-cols-4">
            {days.map((d) => {
              const parts = new Intl.DateTimeFormat("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              }).formatToParts(new Date(`${d}T00:00:00Z`));
              const get = (type: string) => parts.find((p) => p.type === type)?.value;
              const selected = date === d;
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={selected}
                  aria-label={formatDate(d)}
                  onClick={() => {
                    setDate(d);
                    setSlot("");
                  }}
                  className={`flex flex-col items-center rounded-lg py-1.5 ${
                    selected ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
                  }`}
                >
                  <span className="legende text-[0.62rem] tracking-[0.08em]">{get("weekday")?.replace(".", "")}</span>
                  <span className={`compteur text-[1.6rem] ${selected ? "text-encre" : "text-tirage"}`}>{get("day")}</span>
                  <span className="text-[0.68rem]">{get("month")?.replace(".", "")}</span>
                </button>
              );
            })}
          </div>
        </Frame>

        <Frame n={2} title="Le créneau">
          <input type="hidden" name="slot" value={slot} />
          <div className="flex flex-col gap-1.5">
            {SLOTS.map((s) => {
              const left = remaining?.[s] ?? SLOT_CAPACITY;
              const full = remaining !== null && left < guests;
              const selected = slot === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={full || remaining === null}
                  aria-pressed={selected}
                  onClick={() => setSlot(s)}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 disabled:cursor-not-allowed ${
                    selected ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
                  } ${full ? "opacity-45" : ""}`}
                >
                  <span className="legende text-[0.85rem]">{slotLabel(s)}</span>
                  <span className="flex items-baseline gap-2">
                    <span className={`compteur text-[2rem] ${selected ? "text-encre" : full ? "text-[#6b6b6b]" : ""}`}>
                      {remaining === null ? "––" : String(Math.max(0, left)).padStart(2, "0")}
                    </span>
                    <span className="legende w-14 text-left text-[0.62rem]">
                      {remaining !== null && left <= 0 ? "Complet" : full ? "Trop juste" : "Places"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Frame>

        <Frame n={3} title="La formule">
          <div className="flex flex-col gap-1.5">
            {FORMULAS.map((f) => {
              const selected = formula === f.id;
              return (
                <label
                  key={f.id}
                  className={`cursor-pointer rounded-lg px-3 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-jeton ${
                    selected ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
                  }`}
                >
                  <input
                    type="radio"
                    name="formula"
                    value={f.id}
                    checked={selected}
                    onChange={() => setFormula(f.id)}
                    className="sr-only"
                  />
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[1.05rem] font-extrabold">{f.name}</span>
                    <span className="font-extrabold tabular-nums">{formatPrice(f.priceCents)}</span>
                  </span>
                  <span className="mt-1 block text-sm opacity-85">
                    {f.duration} · {f.description}
                  </span>
                </label>
              );
            })}
          </div>
        </Frame>

        <Frame n={4} title="Vous">
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex flex-col gap-1 font-bold">
              Nombre de personnes
              <select
                name="guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="field"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} personne{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Nom de la réservation
              <input name="contact_name" defaultValue={defaultName} required className="field" autoComplete="name" />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Téléphone (facultatif)
              <input name="phone" type="tel" className="field" autoComplete="tel" />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Une précision ?
              <textarea name="notes" rows={2} className="field" placeholder="Anniversaire, allergie, chaise haute…" />
            </label>
            <label className="flex items-center gap-2.5">
              <input type="checkbox" name="with_own_dog" className="size-5 accent-jeton" />
              Je viens avec mon propre teckel
            </label>
          </div>
        </Frame>
      </div>

      {/* Le bas de la bande, là où la cabine imprime la date. */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-2 pt-5 pb-2 text-encre">
        <div>
          <p className="legende text-encre-douce">
            {formatDate(date)}
            {slot ? ` · ${slotLabel(slot)}` : ""} · {guests} pers. · {selectedFormula.name}
          </p>
          <p className="mt-1 flex items-baseline gap-3">
            <span className="text-[2.6rem] leading-none font-extrabold tabular-nums [font-stretch:80%]">
              {formatPrice(selectedFormula.priceCents * guests)}
            </span>
            <span className="text-sm text-encre-douce">réglé sur place · annulation gratuite</span>
          </p>
          {slotLeft !== null && slotLeft < guests ? (
            <p className="mt-2 text-sm font-bold text-rouge">Plus assez de places à cette heure pour {guests} personnes.</p>
          ) : null}
          {state.status === "error" ? (
            <p role="alert" className="mt-2 text-sm font-bold text-rouge">
              {state.error}
            </p>
          ) : null}
        </div>
        <button disabled={pending || !slot} className="btn btn-jeton w-full py-4 text-[1rem] sm:w-auto">
          {pending ? "Réservation…" : slot ? `Réserver à ${slotLabel(slot)}` : "Choisissez un créneau"}
        </button>
      </div>
    </form>
  );
}

function Frame({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 bg-encre p-4 text-tirage">
      <legend className="float-left mb-4 flex w-full items-baseline justify-between">
        <span className="enseigne text-[1.5rem]">{title}</span>
        <span className="legende text-chrome">Pose {n}/4</span>
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}
