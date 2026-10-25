import type { Metadata } from "next";
import { GiftCardForm } from "./gift-card-form";

export const metadata: Metadata = { title: "Carte cadeau" };

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(3rem,8vw,6rem)]">Carte cadeau</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Offrez une heure avec les teckels. Valable sur les formules du bar et dans la boutique, sans date limite
            pour vous prendre la tête.
          </p>
        </div>
      </section>
      <div className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <GiftCardForm />
        </div>
      </div>
    </>
  );
}
