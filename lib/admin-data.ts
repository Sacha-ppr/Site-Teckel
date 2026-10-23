import "server-only";
import { getSupabase, requireAdmin } from "./auth";
import { RESERVATION_STATUS, parisToday, type Reservation } from "./catalog";

export type ReservationFilters = { date?: string; status?: string; q?: string };

export function parseReservationFilters(params: Record<string, string | string[] | undefined>): ReservationFilters {
  const pick = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);
  return { date: pick("date"), status: pick("status"), q: pick("q") };
}

// Sans date choisie, on affiche les réservations à venir.
export async function listReservations(filters: ReservationFilters): Promise<Reservation[]> {
  await requireAdmin();
  const supabase = await getSupabase();
  let query = supabase.from("reservations").select("*").order("date").order("slot");

  if (filters.date && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)) query = query.eq("date", filters.date);
  else query = query.gte("date", parisToday());
  if (filters.status && filters.status in RESERVATION_STATUS) query = query.eq("status", filters.status);
  if (filters.q) query = query.ilike("contact_name", `%${filters.q.replace(/[%_]/g, "")}%`);

  const { data } = await query.limit(500);
  return (data ?? []) as Reservation[];
}
