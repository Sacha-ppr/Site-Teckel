import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser, getSupabase } from "@/lib/auth";
import { LOYALTY_REWARD, LOYALTY_STAMPS } from "@/lib/extras";

export const metadata: Metadata = { title: "Carte de fidélité" };

export default function Page() {
  return (
    <>
      <section className="bg-rouge text-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h1 className="enseigne text-[clamp(3rem,8vw,6rem)]">Carte de fidélité</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rose">
            Une visite = un tampon. {LOYALTY_STAMPS} tampons, et {LOYALTY_REWARD.charAt(0).toLowerCase() + LOYALTY_REWARD.slice(1)} Gratuit, sans abonnement.
          </p>
        </div>
      </section>
      <div className="bg-tirage">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <Suspense fallback={<div className="h-64 animate-pulse bg-tirage-2" />}>
            <Card />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function Card() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="max-w-2xl border-y-2 border-encre py-10">
        <p className="enseigne text-[2rem]">Connectez-vous pour voir vos tampons</p>
        <Link href="/connexion?next=/fidelite" className="btn btn-encre mt-7">Se connecter</Link>
      </div>
    );
  }
  const supabase = await getSupabase();
  const { count } = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "arrivee");
  const visits = count ?? 0;
  const stamps = visits % LOYALTY_STAMPS;
  const rewards = Math.floor(visits / LOYALTY_STAMPS);

  return (
    <div className="max-w-2xl">
      <div className="panneau p-6">
        <ol className="grid grid-cols-4 gap-3" aria-label={`${stamps} tampons sur ${LOYALTY_STAMPS}`}>
          {Array.from({ length: LOYALTY_STAMPS }, (_, i) => (
            <li
              key={i}
              className={`grid aspect-square place-items-center rounded-full border-2 text-xl font-extrabold ${i < stamps ? "border-jeton bg-jeton text-encre" : "border-chrome text-chrome"}`}
            >
              {i < stamps ? "✓" : i + 1}
            </li>
          ))}
        </ol>
        <p className="mt-5 text-chrome-clair">
          {stamps === 0 && visits > 0 ? "Carte complète : récompense à réclamer." : `${LOYALTY_STAMPS - stamps} visite${LOYALTY_STAMPS - stamps > 1 ? "s" : ""} avant la prochaine récompense.`}
        </p>
        {rewards > 0 ? <p className="mt-2 font-bold text-jeton">{rewards} récompense{rewards > 1 ? "s" : ""} gagnée{rewards > 1 ? "s" : ""} : {LOYALTY_REWARD}</p> : null}
      </div>
      <p className="mt-4 text-sm text-encre-douce">Le tampon est ajouté quand le bar vous marque « Arrivée ».</p>
      <Link href="/reserver" className="btn btn-jeton mt-6">Réserver un créneau</Link>
    </div>
  );
}
