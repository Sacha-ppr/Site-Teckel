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

  let items: { product_id: number; quantity: number; variant?: string | null }[];
  try {
    const raw = String(formData.get("items") ?? "[]");
    if (raw.length > 5000) throw new Error("trop long");
    items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) throw new Error("taille");
  } catch {
    return { status: "error", error: "Panier invalide." };
  }

  const shippingName = String(formData.get("shipping_name") ?? "").trim();
  const shippingAddress = String(formData.get("shipping_address") ?? "").trim();
  if (shippingName.length > 100 || shippingAddress.length > 300) {
    return { status: "error", error: "Le nom ou l'adresse de livraison est trop long." };
  }
  if (!shippingName || !shippingAddress) {
    return { status: "error", error: "Merci de renseigner le nom et l'adresse de livraison." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("place_order", {
    items,
    shipping_name: shippingName,
    shipping_address: shippingAddress,
  });
  if (error) {
    const known = /stock|panier|produit|taille|trop de commandes|quantité|livraison|volumineux/i.test(error.message);
    if (!known) console.error("Commande refusée :", error.message);
    return { status: "error", error: known ? error.message : "La commande n'a pas pu être enregistrée. Réessayez dans un instant." };
  }

  updateTag("products");
  return { status: "success", orderId: data as number };
}
