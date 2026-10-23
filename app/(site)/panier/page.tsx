import type { Metadata } from "next";
import { Checkout } from "./checkout";

export const metadata: Metadata = { title: "Panier" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold">Votre panier</h1>
      <div className="mt-10">
        <Checkout />
      </div>
    </div>
  );
}
