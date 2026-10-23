import type { Metadata } from "next";
import { WORKSHOPS } from "@/lib/events";

export const metadata: Metadata = { title: "Ateliers & événements" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold">Ateliers & événements</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        Le bar vit aussi en dehors des créneaux : éducation, santé, sorties et fêtes. Inscriptions au
        comptoir ou par email à <a href="mailto:ateliers@bar-a-teckels.fr" className="font-semibold text-caramel">ateliers@bar-a-teckels.fr</a>.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {WORKSHOPS.map((w) => (
          <article key={w.title} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-semibold text-moss">{w.tag}</span>
              <span className="text-sm font-semibold text-caramel">{w.priceLabel}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold">{w.title}</h2>
            <p className="mt-1 text-sm font-medium text-ink-soft">{w.when}</p>
            <p className="mt-3 text-ink-soft">{w.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
