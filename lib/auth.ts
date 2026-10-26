import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: "client" | "admin";
};

export async function getSupabase() {
  return createClient(await cookies());
}

// Data Access Layer : toutes les lectures de session passent par ici.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await getSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    fullName: profile?.full_name ?? null,
    // Le rôle admin n'est valable que pour une adresse confirmée : sinon n'importe qui pourrait
    // s'inscrire avec l'email d'un administrateur sans en posséder la boîte.
    role: profile?.role === "admin" && data.user.email_confirmed_at ? "admin" : "client",
  };
}

export async function requireUser(next = "/compte") {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/");
  return user;
}
