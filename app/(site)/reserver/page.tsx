import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = { title: "Réserver un créneau" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold">Réserver au bar</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        Seize places par créneau, pour que nos teckels gardent leur calme (et vous, vos genoux).
        Ouvert du mercredi au dimanche.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-paper" />}>
          <Booking />
        </Suspense>
      </div>
    </div>
  );
}

async function Booking() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-10 text-center">
        <p className="text-lg">Connectez-vous pour choisir votre créneau.</p>
        <p className="mt-1 text-ink-soft">Cela nous permet de vous envoyer un rappel et de gérer vos annulations.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/connexion?next=/reserver" className="btn bg-caramel text-white hover:bg-caramel-dark">Se connecter</Link>
          <Link href="/inscription?next=/reserver" className="btn border border-ink/20 hover:bg-cream">Créer un compte</Link>
        </div>
      </div>
    );
  }
  return <ReservationForm defaultName={user.fullName ?? ""} />;
}
