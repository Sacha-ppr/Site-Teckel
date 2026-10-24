import type { Metadata } from "next";
import { Checkout } from "./checkout";

export const metadata: Metadata = { title: "Panier" };

export default function Page() {
  return (
    <div className="bg-tirage">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
        <h1 className="enseigne text-[clamp(2.8rem,7vw,5rem)]">Votre panier</h1>
        <div className="mt-10">
          <Checkout />
        </div>
      </div>
    </div>
  );
}
