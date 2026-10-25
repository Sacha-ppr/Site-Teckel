import type { Metadata } from "next";
import { DonForm } from "./don-form";

export const metadata: Metadata = { title: "Soutenir une association" };

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(3rem,8vw,6rem)]">Un coup de patte</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Si le cœur vous en dit, soutenez une association qui s&apos;occupe d&apos;animaux sans foyer. C&apos;est
            facultatif, et ça ne change rien à votre visite.
          </p>
        </div>
      </section>
      <div className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <DonForm />
        </div>
      </div>
    </>
  );
}
