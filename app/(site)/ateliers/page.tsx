import type { Metadata } from "next";
import { Pose } from "@/components/pose";
import { WORKSHOPS } from "@/lib/events";

export const metadata: Metadata = { title: "Ateliers & événements" };

export default function Page() {
  return (
    <div className="curseur-patte">
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(2.8rem,7vw,6rem)]">Ateliers & événements</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Le bar vit aussi en dehors des créneaux : éducation, santé, sorties et fêtes. Inscriptions au comptoir ou
            par email à{" "}
            <a href="mailto:ateliers@bar-a-teckels.fr" className="font-bold text-tirage underline hover:text-jeton">
              ateliers@bar-a-teckels.fr
            </a>
            .
          </p>
        </div>
      </section>

      <ul className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16">
        {WORKSHOPS.map((w, i) => (
          <li
            key={w.title}
            className="grid gap-x-10 gap-y-5 border-b-2 border-encre py-10 last:border-b-0 sm:grid-cols-[10rem_1fr] md:grid-cols-[13rem_1fr_auto] md:items-start"
          >
            <div className={`tirage w-40 sm:w-full ${i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"}`}>
              <Pose photo={w.photo} alt="" sizes="(min-width: 768px) 208px, 160px" className="aspect-[4/5]" />
              <p className="legende px-0.5 pt-2.5 text-rouge">{w.tag}</p>
            </div>
            <div className="md:pt-2">
              <h2 className="enseigne text-[clamp(1.8rem,3.4vw,2.8rem)]">{w.title}</h2>
              <p className="mt-2 font-bold">{w.when}</p>
              <p className="mt-2 max-w-[42rem] text-lg text-encre-douce">{w.description}</p>
            </div>
            <p className="justify-self-start rounded-full bg-encre px-4 py-2 text-[0.95rem] font-extrabold whitespace-nowrap text-jeton sm:col-start-2 md:col-start-auto md:mt-3 md:justify-self-end">
              {w.priceLabel}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
