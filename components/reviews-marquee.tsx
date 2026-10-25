import { SAMPLE_REVIEWS } from "@/lib/extras";

// Bandeau d'avis qui défile. Contenu d'exemple, signalé comme tel.
export function ReviewsMarquee() {
  const loop = [...SAMPLE_REVIEWS, ...SAMPLE_REVIEWS];
  return (
    <section className="overflow-hidden bg-jeton text-encre" aria-labelledby="avis-titre">
      <div className="mx-auto max-w-[1400px] px-4 pt-14 md:px-8">
        <h2 id="avis-titre" className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">Ils reviennent avec leurs chiens</h2>
        <p className="legende mt-2">Avis d&apos;exemple fictifs, projet scolaire</p>
      </div>
      <div className="defile-zone mt-8 overflow-x-auto pb-14 [scrollbar-width:none]" tabIndex={0} aria-label="Avis de clients, défilement automatique">
        <ul className="defile flex w-max gap-5 px-4 md:px-8">
          {loop.map((r, i) => (
            <li key={i} aria-hidden={i >= SAMPLE_REVIEWS.length} className="tirage w-[19rem] shrink-0 bg-tirage p-5">
              <p className="text-lg leading-snug font-bold">« {r.text} »</p>
              <p className="legende mt-4 text-encre-douce">{r.name} · {r.dog}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
