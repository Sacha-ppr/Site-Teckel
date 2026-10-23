"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/auth";

export type FormState = { error?: string; message?: string } | undefined;

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  // N'accepte que des chemins internes pour éviter les redirections ouvertes.
  return next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error?.code === "email_not_confirmed") {
    return { error: "Adresse email pas encore confirmée : ouvrez le lien reçu par email avant de vous connecter." };
  }
  if (error) return { error: "Email ou mot de passe incorrect." };

  const next = safeNext(formData.get("next"));
  if (next) redirect(next);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  redirect(profile?.role === "admin" ? "/admin" : "/compte");
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };

  // Le lien de confirmation doit revenir sur le domaine courant (localhost, preview ou production).
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const next = safeNext(formData.get("next"));

  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? ""),
    password,
    options: {
      data: { full_name: String(formData.get("full_name") ?? "").trim() },
      emailRedirectTo: `${origin}/auth/confirm${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  });
  if (error) return { error: error.message };

  // Si la confirmation par email est activée dans Supabase, pas de session tout de suite.
  if (!data.session) {
    return { message: "Compte créé ! Confirmez votre adresse via l'email reçu, puis connectez-vous." };
  }
  redirect(next ?? "/compte");
}

export async function signOut() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
