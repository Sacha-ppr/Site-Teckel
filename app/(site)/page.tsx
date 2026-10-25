import Link from "next/link";
import { Suspense } from "react";
import { Pose } from "@/components/pose";
import { ProductCard } from "@/components/product-card";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { Reveal } from "@/components/reveal";
import { SlotBoard } from "@/components/slot-board";
import { FORMULAS, formatPrice } from "@/lib/catalog";
import type { PhotoId } from "@/lib/photos";
import { getProducts } from "@/lib/products";
import { RESIDENTS } from "@/lib/residents";

const HERO_STRIP: PhotoId[] = ["merguez", "chorizo", "knacki", "praline"];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-rouge text-tirage">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-8 pb-14 md:px-8 lg:min-h-[calc(100svh-68px)] lg:grid-cols-[minmax(250px,320px)_1fr] lg:gap-16 lg:py-0">
          {/* La bande de quatre poses : horizontale sur mobile, verticale et débordante sur grand écran. */}
          <Reveal className="bande-flash -mx-1 rotate-[-2deg] lg:mx-0 lg:mt-10 lg:-mb-24">
            <div className="tirage grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-3 lg:p-4 lg:pb-16">
              {HERO_STRIP.map((photo, i) => (
                <Pose
                  key={photo}
                  photo={photo}
                  index={i}
                  priority={i < 2}
                  sizes="(min-width: 1024px) 290px, 24vw"
                  className="aspect-[4/5] lg:aspect-[5/4]"
                />
              ))}
            </div>
          </Reveal>

          <div className="flex flex-col justify-center lg:py-10">
            <h1 className="enseigne text-[clamp(3rem,6.6vw,5.5rem)]">
              4 poses,
              <br />
              6 teckels,
              <br />
              1 café.
            </h1>
            <p className="mt-6 max-w-[38rem] text-[1.15rem] leading-relaxed text-rose">
              Le bar à teckels du 11e : un créneau, une boisson, et une heure en compagnie de Chorizo, Brioche et
              leur bande. Choisissez votre heure, on prépare les coussins.
            </p>
            <div className="mt-8 max-w-[52rem]">
              <SlotBoard />
            </div>
            <p className="mt-4 text-sm text-rose">
              Seize places par créneau, de une à six personnes. Réglé sur place, annulation gratuite.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-[6px] border-rouge-fonce bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
          <Reveal className="reveal-rise flex flex-wrap items-end justify-between gap-6">
            <h2 className="enseigne text-[clamp(2.4rem,5vw,4.5rem)]">Ils vous attendent</h2>
            <Link href="/residents" className="btn btn-ligne">
              Faire connaissance
            </Link>
          </Reveal>
          <Reveal as="ul" className="bande-flash leger mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {RESIDENTS.map((r, i) => (
              <li key={r.name} className={i % 2 ? "lg:translate-y-8" : ""}>
                <div
                  className={`tirage tirage-vive text-encre ${i % 3 === 0 ? "rotate-[-1.5deg]" : i % 3 === 1 ? "rotate-[1deg]" : "rotate-[-0.5deg]"}`}
                >
                  <Pose photo={r.photo} index={i} alt="" sizes="(min-width: 1024px) 200px, 45vw" className="aspect-[7/9]" />
                  <p className="enseigne mt-3 text-[1.35rem]">{r.name}</p>
                  <p className="legende mt-1 text-encre-douce">
                    {r.age} · {r.schedule}
                  </p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-encre text-tirage">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_1.6fr]">
          <Reveal className="reveal-rise">
            <h2 className="enseigne text-[clamp(2.4rem,5vw,4.5rem)]">Trois formules</h2>
            <p className="mt-5 max-w-md text-lg text-chrome-clair">
              Prix par personne, boisson comprise. Le temps passé avec les teckels, lui, n&apos;a pas de prix.
            </p>
          </Reveal>
          <Reveal as="ul" className="reveal-group divide-y divide-[#333] border-y border-[#333]">
            {FORMULAS.map((f, i) => (
              <li
                key={f.id}
                className="reveal-rise grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-7 sm:gap-x-10"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="compteur row-span-2 text-[clamp(3.4rem,7vw,6rem)]">
                  {formatPrice(f.priceCents).replace(",00", "")}
                </span>
                <h3 className="enseigne text-[1.6rem] sm:text-[2rem]">{f.name}</h3>
                <p className="text-chrome-clair">
                  <span className="legende mr-2 text-tirage">{f.duration}</span>
                  {f.description}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-tirage">
        <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-14 md:px-8 md:grid-cols-3">
          {[
            { href: "/carte-cadeau", title: "Carte cadeau", text: "Offrez une heure avec les teckels." },
            { href: "/fidelite", title: "Carte de fidélité", text: "8 visites, un Café câlin offert." },
            { href: "/don", title: "Un coup de patte", text: "Soutenez une association, si le cœur vous en dit." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="tirage block p-5 hover:bg-jeton">
              <span className="enseigne text-[1.6rem]">{c.title}</span>
              <span className="mt-2 block text-encre-douce">{c.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <ReviewsMarquee />

      <section className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
          <Reveal className="reveal-rise flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="enseigne text-[clamp(2.4rem,5vw,4.5rem)]">La boutique des dos longs</h2>
              <p className="mt-4 max-w-xl text-lg text-encre-douce">
                Harnais en H, rampes de canapé, gamelles surélevées : chaque article est choisi pour la morphologie du
                teckel. Livraison offerte dès 60 €.
              </p>
            </div>
            <Link href="/boutique" className="btn btn-ligne">
              Tout le catalogue
            </Link>
          </Reveal>
          <Suspense fallback={<div className="mt-12 h-96 animate-pulse bg-tirage-2" />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function FeaturedProducts() {
  const products = await getProducts();
  // Un article par rayon, pour montrer l'étendue du catalogue.
  const featured = ["harnais-h", "rampe-canape", "manteau-saucisse", "tapis-fouille"]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);
  const list = featured.length === 4 ? featured : products.slice(0, 4);
  if (list.length === 0) {
    return <p className="mt-12 text-encre-douce">Le catalogue arrive bientôt.</p>;
  }
  return (
    <Reveal className="reveal-group mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((p, i) => (
        <div key={p.id} className="tirage-settle" style={{ "--i": i } as React.CSSProperties}>
          <ProductCard product={p} />
        </div>
      ))}
    </Reveal>
  );
}
