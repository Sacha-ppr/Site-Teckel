import type { Metadata } from "next";
import Link from "next/link";
import { Teckel } from "@/components/teckel";
import { RESIDENTS } from "@/lib/residents";

export const metadata: Metadata = { title: "Nos résidents" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold">Nos résidents</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        Six caractères bien trempés, tous adoptés auprès d&apos;éleveurs et d&apos;associations partenaires.
        Consultez leurs jours de présence avant de réserver si vous avez un chouchou.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RESIDENTS.map((r) => (
          <article key={r.name} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
            <div className="rounded-xl p-6" style={{ backgroundColor: `${r.color}26` }}>
              <Teckel color={r.color} className="w-full" title={r.name} />
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold">{r.name}</h2>
              <span className="text-sm text-ink-soft">{r.age}</span>
            </div>
            <p className="text-sm text-ink-soft">{r.coat}</p>
            <p className="mt-3">{r.personality}</p>
            <dl className="mt-auto grid grid-cols-2 gap-2 pt-5 text-sm">
              <div className="rounded-lg bg-cream p-2">
                <dt className="text-xs text-ink-soft">Adore</dt>
                <dd className="font-medium">{r.loves}</dd>
              </div>
              <div className="rounded-lg bg-cream p-2">
                <dt className="text-xs text-ink-soft">Présent</dt>
                <dd className="font-medium">{r.schedule}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link href="/reserver" className="btn bg-caramel text-white hover:bg-caramel-dark">Venir les rencontrer</Link>
      </div>
    </div>
  );
}
