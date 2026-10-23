"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { ORDER_STATUS, RESERVATION_STATUS } from "@/lib/catalog";

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
