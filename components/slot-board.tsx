"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SLOTS, SLOT_CAPACITY, nextOpenDays, shortDate, slotLabel } from "@/lib/catalog";
import { useAvailability } from "@/lib/use-availability";

// Le monnayeur de la cabine : places restantes par créneau, en direct.
export function SlotBoard() {
  // Les jours dépendent de la date du visiteur : calculés seulement côté navigateur.
  const today = useSyncExternalStore(noop, () => new Date().toDateString(), () => null);
  const days = useMemo(() => (today ? nextOpenDays(7) : []), [today]);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<string>("");
  const date: string | undefined = days[dayIndex];
  const remaining = useAvailability(date);

  const changeDay = (delta: number) => {
    setDayIndex((i) => Math.min(days.length - 1, Math.max(0, i + delta)));
    setSlot("");
  };

  const href = date ? `/reserver?date=${date}${slot ? `&slot=${slot}` : ""}` : "/reserver";

  return (
    <div className="panneau p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => changeDay(-1)}
          disabled={dayIndex === 0}
          className="grid size-10 place-items-center rounded-full border-2 border-chrome text-chrome hover:bg-case disabled:opacity-30"
          aria-label="Jour précédent"
        >
          <Chevron dir="left" />
        </button>
        <p className="legende text-center text-[0.85rem] text-chrome-clair" aria-live="polite">
          <span className="hidden sm:inline">Places libres · </span><span className="text-tirage">{date ? shortDate(date) : "…"}</span>
        </p>
        <button
          type="button"
          onClick={() => changeDay(1)}
          disabled={dayIndex >= days.length - 1}
          className="grid size-10 place-items-center rounded-full border-2 border-chrome text-chrome hover:bg-case disabled:opacity-30"
          aria-label="Jour suivant"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
        {SLOTS.map((s) => {
          const left = remaining?.[s] ?? SLOT_CAPACITY;
          const full = remaining !== null && left <= 0;
          const selected = slot === s;
          return (
            <button
              key={s}
              type="button"
              disabled={full || remaining === null}
              onClick={() => setSlot(selected ? "" : s)}
              aria-pressed={selected}
              aria-label={`${slotLabel(s)} : ${remaining === null ? "chargement" : full ? "complet" : `${left} places`}`}
              className={`flex flex-col items-center rounded-xl px-1 pt-2.5 pb-2 transition-colors ${
                selected ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
              } disabled:cursor-not-allowed`}
            >
              <span className="legende text-[0.72rem] sm:text-[0.8rem]">{slotLabel(s)}</span>
              <span
                className={`compteur my-1 text-[clamp(2rem,4.2vw,3.6rem)] ${selected ? "text-encre" : full ? "text-[#6b6b6b]" : ""}`}
              >
                {remaining === null ? "––" : String(Math.max(0, left)).padStart(2, "0")}
              </span>
              <span className="legende text-[0.62rem] tracking-[0.1em] sm:text-[0.7rem]">
                {full ? "Complet" : "Places"}
              </span>
            </button>
          );
        })}
      </div>

      <Link href={href} className="btn btn-jeton mt-4 w-full py-4 text-[1rem] sm:text-[1.1rem]">
        {!date ? "Réserver" : slot ? `Réserver ${shortDate(date)} à ${slotLabel(slot)}` : `Réserver ${shortDate(date)}`}
        <Chevron dir="right" />
      </Link>
    </div>
  );
}

const noop = () => () => {};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
