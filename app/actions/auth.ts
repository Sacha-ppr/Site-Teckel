"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/auth";
import { safeNext, trustedOrigin } from "@/lib/safe-redirect";

export type FormState = { error?: string; message?: string } | undefined;

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
  if (password.length > 72) return { error: "Le mot de passe est trop long (72 caractères maximum)." };

  // Le lien de confirmation revient sur le site, jamais sur un hôte fourni par la requête.
  const origin = trustedOrigin((await headers()).get("host"));
  const next = safeNext(formData.get("next"));

  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? ""),
    password,
    options: {
      data: { full_name: String(formData.get("full_name") ?? "").trim().slice(0, 100) },
      emailRedirectTo: `${origin}/auth/confirm${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  });
  if (error) return { error: "Inscription impossible. Vérifiez l'adresse email et le mot de passe, ou connectez-vous si vous avez déjà un compte." };

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
