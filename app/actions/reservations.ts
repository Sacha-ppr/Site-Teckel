"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, getSupabase } from "@/lib/auth";
import { FORMULAS, SLOTS, isOpenOn } from "@/lib/catalog";

export type ReservationState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success"; date: string; slot: string };

export async function createReservation(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", error: "Connectez-vous pour réserver." };

  const date = String(formData.get("date") ?? "");
  const slot = String(formData.get("slot") ?? "");
  const formula = String(formData.get("formula") ?? "");
  const guests = Number(formData.get("guests"));
  const contactName = String(formData.get("contact_name") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isOpenOn(date)) {
    return { status: "error", error: "Le bar est ouvert du mercredi au dimanche." };
  }
  if (!SLOTS.includes(slot as (typeof SLOTS)[number])) {
    return { status: "error", error: "Choisissez un créneau." };
  }
  if (!FORMULAS.some((f) => f.id === formula)) {
    return { status: "error", error: "Choisissez une formule." };
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
    return { status: "error", error: "Entre 1 et 6 personnes par réservation." };
  }
  if (!contactName) return { status: "error", error: "Indiquez un nom pour la réservation." };
  if (contactName.length > 80) return { status: "error", error: "Le nom est trop long (80 caractères maximum)." };

  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (phone && !/^\+?[\d\s().-]{6,30}$/.test(phone)) {
    return { status: "error", error: "Numéro de téléphone invalide." };
  }
  if (notes.length > 500) return { status: "error", error: "La note est trop longue (500 caractères maximum)." };

  const supabase = await getSupabase();
  const { error } = await supabase.from("reservations").insert({
    user_id: user.id,
    contact_name: contactName,
    phone: phone || null,
    date,
    slot,
    guests,
    formula,
    with_own_dog: formData.get("with_own_dog") === "on",
    notes: notes || null,
  });
  if (error) {
    // Seuls les messages que nous levons nous-mêmes en base sont montrés ; le reste reste dans les logs.
    const known = /complet|fermé|passé|trop de réservations|trop loin/i.test(error.message);
    if (!known) console.error("Réservation refusée :", error.message);
    return { status: "error", error: known ? error.message : "La réservation n'a pas pu être enregistrée. Réessayez dans un instant." };
  }

  return { status: "success", date, slot };
}

export async function cancelMyReservation(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await getSupabase();
  // La politique RLS limite l'annulation aux réservations du client.
  await supabase
    .from("reservations")
    .update({ status: "annulee" })
    .eq("id", Number(formData.get("id")))
    .eq("user_id", user.id);
  revalidatePath("/compte");
}
