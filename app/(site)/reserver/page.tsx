import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { SLOTS, formatDate, isOpenOn, slotLabel } from "@/lib/catalog";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = { title: "Réserver un créneau" };

export default function Page({ searchParams }: PageProps<"/reserver">) {
  return (
    <div className="bg-rouge text-tirage">
      <div className="mx-auto max-w-[1400px] px-4 pt-14 pb-20 md:px-8">
        <h1 className="enseigne text-[clamp(2.8rem,7vw,6rem)]">Réserver au bar</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-rose">
          Quatre poses et c&apos;est réservé. Seize places par créneau, pour que nos teckels gardent leur calme (et
          vous, vos genoux). Ouvert du mercredi au dimanche.
        </p>
        <div className="mt-10">
          <Suspense fallback={<div className="tirage h-[30rem] animate-pulse" />}>
            <Booking searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function Booking({ searchParams }: Pick<PageProps<"/reserver">, "searchParams">) {
  const [user, query] = await Promise.all([getCurrentUser(), searchParams]);
  const rawDate = typeof query.date === "string" ? query.date : "";
  const rawSlot = typeof query.slot === "string" ? query.slot : "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && isOpenOn(rawDate) ? rawDate : undefined;
  const slot = date && (SLOTS as readonly string[]).includes(rawSlot) ? rawSlot : undefined;

  if (!user) {
    const next = encodeURIComponent(`/reserver${date ? `?date=${date}${slot ? `&slot=${slot}` : ""}` : ""}`);
    return (
      <div className="panneau max-w-2xl p-8 sm:p-10">
        {date ? (
          <p className="mb-6 border-b border-[#444] pb-5">
            <span className="compteur block text-[2.4rem] first-letter:uppercase">
              {formatDate(date)}
              {slot ? ` · ${slotLabel(slot)}` : ""}
            </span>
            <span className="mt-2 block text-chrome-clair">Vous le retrouverez juste après la connexion.</span>
          </p>
        ) : null}
        <p className="enseigne text-[2rem]">Un compte, et c&apos;est parti</p>
        <p className="mt-3 text-lg text-chrome-clair">
          Il nous sert à vous envoyer un rappel et à vous laisser annuler en un clic.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/connexion?next=${next}`} className="btn btn-jeton">
            Se connecter
          </Link>
          <Link href={`/inscription?next=${next}`} className="btn btn-ligne text-tirage">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }
  return <ReservationForm defaultName={user.fullName ?? ""} initialDate={date} initialSlot={slot} />;
}
