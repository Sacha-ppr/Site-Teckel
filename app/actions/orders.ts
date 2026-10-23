"use server";

import { updateTag } from "next/cache";
import { getCurrentUser, getSupabase } from "@/lib/auth";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; error: string; needsLogin?: boolean }
  | { status: "success"; orderId: number };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", error: "Connectez-vous pour finaliser la commande.", needsLogin: true };
  }

  let items: { product_id: number; quantity: number }[];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { status: "error", error: "Panier invalide." };
  }

  const shippingName = String(formData.get("shipping_name") ?? "").trim();
  const shippingAddress = String(formData.get("shipping_address") ?? "").trim();
  if (!shippingName || !shippingAddress) {
    return { status: "error", error: "Merci de renseigner le nom et l'adresse de livraison." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("place_order", {
    items,
    shipping_name: shippingName,
    shipping_address: shippingAddress,
  });
  if (error) return { status: "error", error: error.message };

  updateTag("products");
  return { status: "success", orderId: data as number };
}
