import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Teckel } from "@/components/teckel";
import { FORMULAS, formatPrice } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { RESIDENTS } from "@/lib/residents";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Paris 11e · Café & boutique</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Des câlins
              <br />
              au ras du sol.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Six teckels résidents, un bon café et une boutique pensée pour les chiens au long dos.
              Réservez votre créneau, on prépare les coussins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reserver" className="btn bg-caramel text-white hover:bg-caramel-dark">
                Réserver un créneau
              </Link>
              <Link href="/boutique" className="btn border border-ink/20 hover:bg-paper">
                Visiter la boutique
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2rem] bg-paper p-8 shadow-[0_30px_60px_-30px_rgba(42,29,20,0.35)]">
              <div className="flex h-full flex-col justify-end gap-2">
                <Teckel color="#5a3420" className="w-3/5 self-end" />
                <Teckel color="#d9b47a" className="-mt-4 w-2/3" />
                <Teckel color="#b5652b" className="-mt-4 w-3/4 self-center" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-moss px-4 py-3 text-sm text-white shadow-lg">
              <span className="font-display text-2xl font-semibold">16</span> places par créneau
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-px bg-line md:grid-cols-3">
          {[
            { title: "Le bar", text: "Café, pâtisseries et apéro en compagnie de nos résidents.", href: "/bar" },
            { title: "La boutique", text: "Manteaux, harnais en H, rampes : tout pour les dos longs.", href: "/boutique" },
            { title: "Les ateliers", text: "Éducation, santé du dos, balades collectives et anniversaires.", href: "/ateliers" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group bg-paper p-8 hover:bg-cream">
              <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-ink-soft">{item.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-caramel group-hover:translate-x-1 transition-transform">
                Découvrir →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-semibold">Nos formules</h2>
          <Link href="/reserver" className="text-sm font-semibold text-caramel">Voir les disponibilités →</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {FORMULAS.map((f) => (
            <div key={f.id} className="rounded-2xl border border-line bg-paper p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">{f.name}</h3>
                <span className="font-semibold text-caramel">{formatPrice(f.priceCents)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{f.duration} · par personne</p>
              <p className="mt-4 text-ink-soft">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-4xl font-semibold">Ils vous attendent</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-6">
            {RESIDENTS.map((r) => (
              <div key={r.name} className="text-center">
                <div className="rounded-2xl bg-cream/10 p-4">
                  <Teckel color={r.color} className="w-full" />
                </div>
                <p className="mt-3 font-display text-lg font-semibold">{r.name}</p>
                <p className="text-xs text-cream/60">{r.age}</p>
              </div>
            ))}
          </div>
          <Link href="/residents" className="btn mt-10 bg-cream text-ink hover:bg-white">
            Faire connaissance
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-semibold">Coups de cœur de la boutique</h2>
          <Link href="/boutique" className="text-sm font-semibold text-caramel">Tout voir →</Link>
        </div>
        <Suspense fallback={<div className="mt-8 h-72 animate-pulse rounded-2xl bg-paper" />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </>
  );
}

async function FeaturedProducts() {
  const products = (await getProducts()).slice(0, 4);
  if (products.length === 0) {
    return <p className="mt-8 text-ink-soft">Le catalogue arrive bientôt.</p>;
  }
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
