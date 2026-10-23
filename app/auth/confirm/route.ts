import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/auth";

// Lien de confirmation envoyé par Supabase à l'inscription.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = searchParams.get("next") ?? "";
  const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/compte";

  const supabase = await getSupabase();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("Lien incomplet") };

  const url = request.nextUrl.clone();
  url.search = "";
  if (error) {
    url.pathname = "/connexion";
    url.searchParams.set("erreur", "lien");
  } else {
    url.pathname = destination;
  }
  return NextResponse.redirect(url);
}
