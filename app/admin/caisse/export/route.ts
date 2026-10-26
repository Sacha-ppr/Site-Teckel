import { getSupabase, requireAdmin } from "@/lib/auth";
import { CASH_CATEGORIES, CASH_KINDS, CASH_METHODS, monthBounds, type CashEntry } from "@/lib/catalog";
import { toCsv } from "@/lib/csv";

const MONTH = /^\d{4}-\d{2}$/;

export async function GET(request: Request) {
  await requireAdmin();
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!MONTH.test(month)) return new Response("Mois invalide (attendu AAAA-MM)", { status: 400 });

  const bounds = monthBounds(month);
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cash_entries")
    .select("*")
    .gte("business_day", bounds.from)
    .lte("business_day", bounds.to)
    .order("business_day")
    .order("created_at");
  const entries = (data ?? []) as CashEntry[];

  // Montants en euros avec virgule décimale, signés : les dépenses sont négatives.
  const euros = (cents: number, sign: number) => ((sign * cents) / 100).toFixed(2).replace(".", ",");
  const csv = toCsv(
    ["Date", "Type", "Catégorie", "Mode", "Libellé", "Montant (€)"],
    entries.map((e) => [
      e.business_day,
      CASH_KINDS[e.kind],
      CASH_CATEGORIES[e.category],
      CASH_METHODS[e.method],
      e.label,
      euros(e.amount_cents, e.kind === "depense" ? -1 : 1),
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="caisse-${month}.csv"`,
    },
  });
}
