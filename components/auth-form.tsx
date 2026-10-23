"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/app/actions/auth";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [state, action, pending] = useActionState(mode === "signin" ? signIn : signUp, undefined);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const linkError = searchParams.get("erreur") === "lien";
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" ? (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nom complet
          <input name="full_name" required className="field" autoComplete="name" />
        </label>
      ) : null}
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input name="email" type="email" required className="field" autoComplete="email" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          className="field"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {linkError && !state ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          Ce lien de confirmation est invalide ou expiré. Connectez-vous, ou réinscrivez-vous si besoin.
        </p>
      ) : null}
      {state?.error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p> : null}
      {state?.message ? <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{state.message}</p> : null}
      <button disabled={pending} className="btn bg-caramel text-white hover:bg-caramel-dark">
        {pending ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {mode === "signin" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href={`/inscription${nextQuery}`} className="font-semibold text-caramel">
              Inscrivez-vous
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit·e ?{" "}
            <Link href={`/connexion${nextQuery}`} className="font-semibold text-caramel">
              Connectez-vous
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
