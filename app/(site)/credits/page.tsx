import type { Metadata } from "next";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = { title: "Crédits photo" };

// Le teckel de profil du guide des tailles (fiches produit), détouré.
const GUIDE_PHOTO = {
  title: "닥스훈트(단모종) (Dachshund (Short)).jpg",
  author: "Katemil94",
  license: "CC BY-SA 4.0",
  source: "https://commons.wikimedia.org/wiki/File:%EB%8B%A5%EC%8A%A4%ED%9B%88%ED%8A%B8(%EB%8B%A8%EB%AA%A8%EC%A2%85)_(Dachshund_(Short)).jpg",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <h1 className="enseigne text-[clamp(2.6rem,6vw,4.5rem)]">Crédits photo</h1>
      <p className="mt-5 max-w-2xl text-lg text-encre-douce">
        Les photos de teckels viennent de Wikimedia Commons et de Flickr, sous licence libre. Elles sont affichées en noir et blanc et recadrées,
        sauf celle du guide des tailles, détourée. Ce ne sont pas des portraits de nos résidents : le bar et ses teckels sont fictifs.
        Les photos des articles de la boutique ont été générées par intelligence artificielle (Google Gemini) pour ce projet, puis retouchées.
      </p>
      <ul className="mt-10 border-t-2 border-encre">
        {[...Object.entries(PHOTOS), ["guide-tailles", GUIDE_PHOTO] as const].map(([id, p]) => (
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
