import type { Metadata } from "next";
import Link from "next/link";
import { Teckel } from "@/components/teckel";
import { FORMULAS, formatPrice } from "@/lib/catalog";

export const metadata: Metadata = { title: "Le bar" };

const RULES = [
  { title: "On laisse venir", text: "Les teckels choisissent leurs humains. Asseyez-vous, ils viendront." },
  { title: "Pas de nourriture humaine", text: "Même devant le regard de Knacki. Surtout devant le regard de Knacki." },
  { title: "On les porte correctement", text: "Une main sous le poitrail, une sous l'arrière-train : leur dos vous remercie." },
  { title: "Les siestes sont sacrées", text: "Un teckel qui dort dans son panier ne se dérange pas." },
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Le concept</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight">
            Un café où les clients ont quatre pattes courtes.
          </h1>
          <p className="mt-6 text-lg text-ink-soft">
            Inspiré des cafés à chats de Tokyo, le Bar à Teckels réunit six teckels résidents dans un salon
            chaleureux du 11e arrondissement. On y vient pour un café, un goûter ou un apéro, et on repart
            avec des poils sur le pantalon et le sourire.
          </p>
          <Link href="/reserver" className="btn mt-8 bg-caramel text-white hover:bg-caramel-dark">
            Réserver un créneau
          </Link>
        </div>
        <div className="rounded-[2rem] bg-moss p-10">
          <Teckel color="#f6efe4" className="w-full" />
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-semibold">Formules & tarifs</h2>
          <div className="mt-6 divide-y divide-line">
            {FORMULAS.map((f) => (
              <div key={f.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                <h3 className="font-display text-xl font-semibold">{f.name}</h3>
                <span className="text-sm text-ink-soft">{f.duration}</span>
                <p className="w-full text-ink-soft md:order-last">{f.description}</p>
                <span className="ml-auto font-semibold text-caramel">{formatPrice(f.priceCents)} / pers.</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">La charte du bar</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r, i) => (
            <div key={r.title} className="rounded-2xl border border-line bg-paper p-6">
              <span className="font-display text-3xl font-semibold text-caramel">{i + 1}</span>
              <h3 className="mt-2 font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="font-display text-3xl font-semibold">Questions fréquentes</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
          {FAQ.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="mr-2 inline-block text-caramel transition-transform group-open:rotate-45">+</span>
                {item.q}
              </summary>
              <p className="mt-2 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
