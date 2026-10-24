import type { Metadata } from "next";
import { MODELS } from "@/lib/dress-up";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = { title: "Crédits photo" };

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <h1 className="enseigne text-[clamp(2.6rem,6vw,4.5rem)]">Crédits photo</h1>
      <p className="mt-5 max-w-2xl text-lg text-encre-douce">
        Les photos de teckels viennent de Wikimedia Commons et de Flickr, sous licence libre. Elles sont affichées en noir et blanc et recadrées,
        celles de la cabine d&apos;essayage sont détourées. Ce ne sont pas des portraits de nos résidents : le bar et ses teckels sont fictifs.
        Les photos des articles de la boutique ont été générées par intelligence artificielle (Google Gemini) pour ce projet, puis retouchées.
      </p>
      <ul className="mt-10 border-t-2 border-encre">
        {[...Object.entries(PHOTOS), ...MODELS.map((m) => [`cabine-${m.id}`, m.credit] as const)].map(([id, p]) => (
          <li key={id} className="grid gap-1 border-b-2 border-encre py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
            <div>
              <a href={p.source} className="font-bold underline hover:text-rouge" rel="noreferrer">
                {p.title}
              </a>
              <p className="text-encre-douce">{p.author}</p>
            </div>
            <p className="legende self-center">{p.license}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
