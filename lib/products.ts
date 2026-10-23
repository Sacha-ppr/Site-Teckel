import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "./catalog";

// Le catalogue est public : on le lit sans cookies pour pouvoir le mettre en cache.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");

  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("name");
  if (error) {
    console.error("Lecture du catalogue impossible :", error.message);
    return [];
  }
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
