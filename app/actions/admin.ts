"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSupabase, requireAdmin } from "@/lib/auth";
import {
  CASH_CATEGORIES,
  CASH_KINDS,
  CASH_METHODS,
  ORDER_STATUS,
  RESERVATION_STATUS,
  STOCK_REASONS,
} from "@/lib/catalog";
import { maxMinutesFor, minutesBetween } from "@/lib/presence";
import { RESIDENTS } from "@/lib/residents";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const HOUR = /^\d{2}:\d{2}$/;

// Montant saisi en euros (virgule ou point) vers des centimes ; null si invalide.
function toCents(value: FormDataEntryValue | null) {
  const cents = Math.round(Number(String(value ?? "").replace(",", ".")) * 100);
  return Number.isInteger(cents) && cents >= 0 ? cents : null;
}

// Chaque action revérifie le rôle : l'UI ne suffit pas à protéger les données.

export async function setReservationStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!(status in RESERVATION_STATUS)) return;

  const supabase = await getSupabase();
  await supabase.from("reservations").update({ status }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin", "layout");
}

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!(status in ORDER_STATUS)) return;

  const supabase = await getSupabase();
  await supabase.from("orders").update({ status }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin", "layout");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const stock = Number(formData.get("stock"));
  const priceCents = Math.round(Number(String(formData.get("price")).replace(",", ".")) * 100);
  if (!Number.isInteger(stock) || stock < 0 || !Number.isFinite(priceCents) || priceCents < 0) return;

  const supabase = await getSupabase();
  await supabase
    .from("products")
    .update({ stock, price_cents: priceCents, active: formData.get("active") === "on" })
    .eq("id", Number(formData.get("id")));
  updateTag("products");
  revalidatePath("/admin", "layout");
}

// Caisse : une écriture par encaissement ou décaissement. Pas de modification ni de suppression :
// une erreur se corrige par une écriture inverse.
export async function addCashEntry(formData: FormData) {
  await requireAdmin();
  const kind = String(formData.get("kind"));
  const category = String(formData.get("category"));
  const method = String(formData.get("method"));
  const day = String(formData.get("business_day"));
  const label = String(formData.get("label") ?? "").trim().slice(0, 120);
  const amountCents = toCents(formData.get("amount"));
  if (!(kind in CASH_KINDS) || !(category in CASH_CATEGORIES) || !(method in CASH_METHODS)) return;
  if (!ISO_DAY.test(day) || !label || !amountCents) return;

  const supabase = await getSupabase();
  const { error } = await supabase.from("cash_entries").insert({
    business_day: day,
    kind,
    category,
    method,
    amount_cents: amountCents,
    label,
  });
  if (error) throw new Error("Écriture non enregistrée");
  revalidatePath("/admin", "layout");
}

// Clôture : fond de caisse et espèces comptées. L'écart se calcule à l'affichage.
export async function closeCashDay(formData: FormData) {
  await requireAdmin();
  const day = String(formData.get("business_day"));
  const floatCents = toCents(formData.get("opening_float"));
  const countedCents = toCents(formData.get("counted_cash"));
  if (!ISO_DAY.test(day) || floatCents === null || countedCents === null) return;

  const supabase = await getSupabase();
  const { error } = await supabase.from("cash_closings").upsert(
    {
      business_day: day,
      opening_float_cents: floatCents,
      counted_cash_cents: countedCents,
      note: String(formData.get("note") ?? "").trim().slice(0, 300) || null,
    },
    { onConflict: "business_day" },
  );
  if (error) throw new Error("Clôture non enregistrée");
  revalidatePath("/admin", "layout");
}

// Mouvement de stock : passe par la fonction adjust_stock, qui met à jour le stock et journalise.
export async function adjustStock(formData: FormData) {
  await requireAdmin();
  const productId = Number(formData.get("product_id"));
  const quantity = Number(formData.get("quantity"));
  const sign = formData.get("direction") === "sortie" ? -1 : 1;
  const reason = String(formData.get("reason"));
  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) return;
  if (!(reason in STOCK_REASONS)) return;

  const supabase = await getSupabase();
  const { error } = await supabase.rpc("adjust_stock", {
    p_product: productId,
    p_delta: sign * quantity,
    p_reason: reason,
    p_note: String(formData.get("note") ?? "").slice(0, 200),
  });
  if (error) throw new Error(error.message);
  updateTag("products");
  revalidatePath("/admin", "layout");
}

// Présence des teckels pour une journée : un formulaire, un enregistrement par teckel.
// Champ vide = pas de saisie (la ligne existante est supprimée).
export async function saveDayPresence(formData: FormData) {
  await requireAdmin();
  const day = String(formData.get("business_day"));
  if (!ISO_DAY.test(day)) return;

  // Tout est vérifié avant la première écriture : une erreur ne laisse pas la journée à moitié saisie.
  const plan = RESIDENTS.flatMap((dog) => {
    const status = String(formData.get(`${dog.slug}-status`));
    const start = String(formData.get(`${dog.slug}-start`));
    const end = String(formData.get(`${dog.slug}-end`));
    if (status !== "presente" && status !== "absente") {
      return status === "" ? [{ dog: dog.slug, name: dog.name, status: "", start, end }] : [];
    }
    if (status === "presente") {
      const minutes = HOUR.test(start) && HOUR.test(end) ? minutesBetween(start, end) : 0;
      if (minutes <= 0 || minutes > maxMinutesFor(dog)) {
        throw new Error(`${dog.name} : horaires invalides (${maxMinutesFor(dog) / 60} h maximum, fin après le début).`);
      }
    }
    return [{ dog: dog.slug, name: dog.name, status, start, end }];
  });

  const supabase = await getSupabase();
  for (const row of plan) {
    const base = { business_day: day, dog: row.dog };
    const result =
      row.status === ""
        ? await supabase.from("dog_presence").delete().eq("business_day", day).eq("dog", row.dog)
        : await supabase.from("dog_presence").upsert(
            row.status === "presente"
              ? { ...base, status: "presente", start_time: row.start, end_time: row.end }
              : { ...base, status: "absente", start_time: null, end_time: null },
            { onConflict: "business_day,dog" },
          );
    if (result.error) throw new Error(`${row.name} : présence non enregistrée`);
  }
  revalidatePath("/admin", "layout");
}
