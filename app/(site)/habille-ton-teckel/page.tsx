import type { Metadata } from "next";
import { Suspense } from "react";
import { DressUp } from "@/components/dress-up/dress-up";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Habille ton teckel",
  description: "Le mini-jeu du Bar à Teckels : choisissez une robe, habillez votre teckel et retrouvez son look en boutique.",
};

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-16">
          <h1 className="enseigne text-[clamp(2.8rem,7vw,5.5rem)]">Habille ton teckel</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-rose">
            Entrez dans la cabine d&apos;essayage : choisissez la robe de votre teckel, enfilez-lui béret, marinière ou
            harnais, puis repartez avec la photo. Chaque pièce existe vraiment dans notre boutique.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <Suspense fallback={<div className="h-[36rem] animate-pulse bg-tirage-2" />}>
          <Game />
        </Suspense>
      </div>
    </>
  );
}

async function Game() {
  const products = await getProducts();
  return <DressUp products={products} />;
}
