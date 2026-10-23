import type { Metadata } from "next";
import Link from "next/link";
import { Pose } from "@/components/pose";
import { RESIDENTS } from "@/lib/residents";

export const metadata: Metadata = { title: "Nos résidents" };

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(3rem,8vw,6rem)]">Nos résidents</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Six caractères bien trempés, tous adoptés auprès d&apos;éleveurs et d&apos;associations partenaires.
            Regardez leurs jours de présence avant de réserver si vous avez un chouchou.
          </p>
        </div>
      </section>

      <ul className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16">
        {RESIDENTS.map((r, i) => (
          <li
            key={r.name}
            className="grid items-center gap-8 border-b-2 border-encre py-12 last:border-b-0 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-14"
          >
            <div className={`tirage w-full max-w-[300px] ${i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"}`}>
              <Pose photo={r.photo} sizes="300px" className="aspect-[7/9]" />
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <h2 className="enseigne text-[clamp(3rem,7vw,5.5rem)]">{r.name}</h2>
                <p className="legende text-encre-douce">
                  {r.age} · {r.coat}
                </p>
              </div>
              <p className="mt-5 max-w-[40rem] text-[1.2rem] leading-relaxed">{r.personality}</p>
              <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <dt className="legende text-encre-douce">Adore</dt>
                  <dd className="mt-1 text-lg font-bold">{r.loves}</dd>
                </div>
                <div>
                  <dt className="legende text-encre-douce">Au bar le</dt>
                  <dd className="mt-1 text-lg font-bold">{r.schedule}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>

      <section className="bg-encre text-tirage">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 px-4 py-14 md:px-8">
          <p className="enseigne text-[clamp(2rem,4vw,3.2rem)]">Venez les rencontrer</p>
          <Link href="/reserver" className="btn btn-jeton">
            Choisir un créneau
          </Link>
        </div>
      </section>
    </>
  );
}
