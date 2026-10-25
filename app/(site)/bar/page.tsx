import type { Metadata } from "next";
import Link from "next/link";
import { Pose } from "@/components/pose";
import { FORMULAS, formatPrice } from "@/lib/catalog";
import { DOG_MENU, HUMAN_MENU } from "@/lib/extras";
import type { PhotoId } from "@/lib/photos";

export const metadata: Metadata = { title: "Le bar" };

const RULES: { title: string; text: string; photo: PhotoId }[] = [
  { title: "On laisse venir", text: "Les teckels choisissent leurs humains. Asseyez-vous, ils viendront.", photo: "attente" },
  { title: "Pas de nourriture humaine", text: "Même devant le regard de Knacki. Surtout devant le regard de Knacki.", photo: "regard" },
  { title: "On les porte correctement", text: "Une main sous le poitrail, une sous l'arrière-train : leur dos vous remercie.", photo: "enfant" },
  { title: "Les siestes sont sacrées", text: "Un teckel qui dort dans son panier ne se dérange pas.", photo: "sieste" },
];

const FAQ = [
  { q: "Puis-je venir avec mon chien ?", a: "Oui, s'il est sociable et à jour de ses vaccins. Cochez la case lors de la réservation pour que nous préparions son accueil." },
  { q: "Les enfants sont-ils acceptés ?", a: "Dès 6 ans, accompagnés d'un adulte. Nous organisons aussi des goûters d'anniversaire." },
  { q: "Et si je suis allergique ?", a: "Brioche et Saucisson ont le poil long ; les autres sont à poil ras. Le bar est aéré et nettoyé entre chaque créneau." },
  { q: "Vos teckels sont-ils bien traités ?", a: "Ils vivent avec notre équipe, travaillent quatre heures maximum par jour et disposent d'un espace de repos fermé au public." },
];

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="enseigne text-[clamp(2.8rem,6.4vw,5.5rem)]">Un café où les clients ont des pattes courtes</h1>
            <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-rose">
              Inspiré des cafés à chats de Tokyo, le Bar à Teckels réunit sept teckels résidents (oui, comme les sept nains) dans un salon du 11e
              arrondissement. On y vient pour un café, un goûter ou un apéro, et on repart avec des poils sur le
              pantalon et le sourire.
            </p>
            <Link href="/reserver" className="btn btn-jeton mt-8">
              Réserver un créneau
            </Link>
          </div>
          <div className="tirage mx-auto w-full max-w-[460px] rotate-[2deg]">
            <Pose photo="guinguette" priority sizes="(min-width: 1024px) 440px, 90vw" className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <section className="bg-encre text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">Formules & tarifs</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 border-t border-[#333] pt-10 md:grid-cols-3">
            {FORMULAS.map((f) => (
              <li key={f.id}>
                <span className="compteur text-[4.5rem]">{formatPrice(f.priceCents).replace(",00", "")}</span>
                <h3 className="enseigne mt-3 text-[1.7rem]">{f.name}</h3>
                <p className="legende mt-2 text-chrome-clair">{f.duration} · par personne</p>
                <p className="mt-3 text-chrome-clair">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-jeton text-encre">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-2">
          <div>
            <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">La carte des chiens</h2>
            <ul className="mt-8 divide-y-2 divide-encre border-y-2 border-encre">
              {DOG_MENU.map((m) => (
                <li key={m.name} className="py-4">
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="enseigne text-[1.4rem]">{m.name}</span>
                    <span className="text-xl font-extrabold tabular-nums">{m.price}</span>
                  </p>
                  <p className="mt-1">{m.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">La carte des humains</h2>
            <ul className="mt-8 divide-y-2 divide-encre border-y-2 border-encre">
              {HUMAN_MENU.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="text-lg font-bold">{m.name}</span>
                  <span className="text-xl font-extrabold tabular-nums">{m.price}</span>
                </li>
              ))}
            </ul>
            <p className="legende mt-4">Réglé sur place. Prix d&apos;exemple pour la démo.</p>
          </div>
        </div>
      </section>

      <section className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
          <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">La charte du bar</h2>
          <p className="mt-4 max-w-xl text-lg text-encre-douce">Quatre règles, quatre poses. Nos teckels comptent sur vous.</p>
          <ol className="tirage mt-12 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r, i) => (
              <li key={r.title} className="flex flex-col">
                <Pose photo={r.photo} sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" className="aspect-[4/5]" index={i} />
                <h3 className="enseigne mt-4 text-[1.35rem]">{r.title}</h3>
                <p className="mt-2 pb-2 text-encre-douce">{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[56rem] px-4 py-16 md:py-24">
        <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">Questions fréquentes</h2>
        <div className="mt-10 border-t-2 border-encre">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b-2 border-encre">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.2rem] font-bold marker:hidden hover:text-rouge [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-jeton text-encre transition-transform group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[44rem] pb-6 text-lg text-encre-douce">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
