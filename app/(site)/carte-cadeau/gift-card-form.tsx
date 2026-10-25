"use client";

import { useState } from "react";
import { GIFT_AMOUNTS } from "@/lib/extras";

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `TECKEL-${pick()}-${pick()}`;
}

export function GiftCardForm() {
  const [amount, setAmount] = useState<number>(GIFT_AMOUNTS[1]);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState<string | null>(null);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <form
        className="panneau flex flex-col gap-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setCode(makeCode());
        }}
      >
        <fieldset>
          <legend className="legende">Montant</legend>
          <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Montant">
            {GIFT_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={amount === a}
                onClick={() => setAmount(a)}
                className={`rounded-xl border-2 py-3 text-xl font-extrabold tabular-nums ${amount === a ? "border-jeton bg-jeton text-encre" : "border-chrome text-tirage hover:border-jeton"}`}
              >
                {a} €
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Pour
          <input value={to} onChange={(e) => setTo(e.target.value)} className="field" maxLength={40} placeholder="Prénom" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Votre message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="field" rows={3} maxLength={140} />
        </label>
        <button className="btn btn-jeton py-4">Créer la carte · {amount} €</button>
        <p className="text-sm text-chrome-clair">Paiement simulé pour la démo : aucun débit réel, le code n&apos;est pas utilisable.</p>
      </form>

      <div>
        <div className="tirage rotate-[-1.5deg] bg-encre p-6 text-tirage" aria-live="polite">
          <p className="legende text-chrome">Le Bar à Teckels</p>
          <p className="compteur mt-4 text-[5rem] leading-none">{amount} €</p>
          <p className="enseigne mt-4 text-[1.5rem]">{to ? `Pour ${to}` : "Pour vous"}</p>
          <p className="mt-2 min-h-12 text-chrome-clair">{message || "Une heure avec les teckels, c'est pour vous."}</p>
          <p className="mt-6 border-t border-[#444] pt-4 font-mono tracking-widest text-jeton">{code ?? "TECKEL-••••-••••"}</p>
        </div>
        {code ? (
          <p role="status" className="mt-5 font-bold">Carte créée. Elle s&apos;imprime depuis votre navigateur (Ctrl+P).</p>
        ) : null}
      </div>
    </div>
  );
}
