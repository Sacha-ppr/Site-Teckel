"use client";

import { useState } from "react";
import { ASSOCIATIONS, DONATION_AMOUNTS } from "@/lib/extras";

export function DonForm() {
  const [asso, setAsso] = useState<string>(ASSOCIATIONS[0].id);
  const [amount, setAmount] = useState<number>(DONATION_AMOUNTS[1]);
  const [done, setDone] = useState(false);
  const name = ASSOCIATIONS.find((a) => a.id === asso)?.name;

  if (done) {
    return (
      <div className="panneau max-w-2xl p-8">
        <p className="compteur text-[4rem]">{amount} €</p>
        <h2 className="enseigne mt-2 text-[2rem]">Merci pour {name}</h2>
        <p className="mt-3 text-chrome-clair">Ce don est une simulation : aucun argent n&apos;a été prélevé ni transmis.</p>
        <button type="button" onClick={() => setDone(false)} className="btn btn-jeton mt-6">Recommencer</button>
      </div>
    );
  }

  return (
    <form
      className="grid max-w-3xl gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <fieldset>
        <legend className="legende">Association</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Association">
          {ASSOCIATIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={asso === a.id}
              onClick={() => setAsso(a.id)}
              className={`tirage p-4 text-left ${asso === a.id ? "outline-3 outline-offset-2 outline-jeton" : ""}`}
            >
              <span className="enseigne text-[1.4rem]">{a.name}</span>
              <span className="mt-1 block text-encre-douce">{a.text}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="legende">Montant</legend>
        <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Montant">
          {DONATION_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={amount === a}
              onClick={() => setAmount(a)}
              className={`rounded-full border-2 border-encre px-6 py-3 text-lg font-extrabold tabular-nums ${amount === a ? "bg-jeton" : "hover:bg-jeton/40"}`}
            >
              {a} €
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <button className="btn btn-jeton py-4">Donner {amount} € à {name}</button>
        <p className="mt-3 text-sm text-encre-douce">Don simulé pour la démo : aucun paiement réel n&apos;est effectué.</p>
      </div>
    </form>
  );
}
