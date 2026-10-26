import type { Metadata } from "next";
import { Suspense } from "react";
import { addCashEntry, closeCashDay } from "@/app/actions/admin";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import {
  CASH_CATEGORIES,
  CASH_KINDS,
  CASH_METHODS,
  formatDate,
  formatPrice,
  monthBounds,
  parisToday,
  type CashClosing,
  type CashEntry,
} from "@/lib/catalog";

export const metadata: Metadata = { title: "Caisse" };

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const FIELD = "rounded-md border border-slate-300 bg-white px-2 py-1.5";

export default function Page({ searchParams }: PageProps<"/admin/caisse">) {
  return (
    <>
      <PageTitle title="Caisse" subtitle="Encaissements espèces et carte, dépenses et clôture du jour" />
      <Suspense fallback={<Skeleton />}>
        <Caisse searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Caisse({ searchParams }: Pick<PageProps<"/admin/caisse">, "searchParams">) {
  await requireAdmin();
  const params = await searchParams;
  const requested = typeof params.date === "string" ? params.date : "";
  const day = ISO_DAY.test(requested) ? requested : parisToday();
  const month = day.slice(0, 7);
  const bounds = monthBounds(month);

  const supabase = await getSupabase();
  const [{ data: entryData }, { data: closingData }] = await Promise.all([
    supabase
      .from("cash_entries")
      .select("*")
      .gte("business_day", bounds.from)
      .lte("business_day", bounds.to)
      .order("created_at"),
    supabase.from("cash_closings").select("*").eq("business_day", day).maybeSingle(),
  ]);
  const entries = (entryData ?? []) as CashEntry[];
  const closing = (closingData ?? null) as CashClosing | null;
  const todays = entries.filter((e) => e.business_day === day);

  const sum = (list: CashEntry[], kind: CashEntry["kind"], method?: CashEntry["method"]) =>
    list
      .filter((e) => e.kind === kind && (!method || e.method === method))
      .reduce((n, e) => n + e.amount_cents, 0);

  const cashIn = sum(todays, "recette", "especes");
  const cardIn = sum(todays, "recette", "carte");
  const cashOut = sum(todays, "depense", "especes");
  const expectedCash = (closing?.opening_float_cents ?? 0) + cashIn - cashOut;
  const gap = closing ? closing.counted_cash_cents - expectedCash : null;

  const monthIn = sum(entries, "recette");
  const monthOut = sum(entries, "depense");

  const cents = (c: number | undefined) => (c === undefined ? "" : (c / 100).toFixed(2));

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <form className="flex items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Journée</span>
            <input type="date" name="date" defaultValue={day} className={FIELD} />
          </label>
          <button className="rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">Afficher</button>
        </form>
        {day !== parisToday() ? (
          <a href="/admin/caisse" className="px-2 py-1.5 text-slate-500 hover:text-slate-900">Aujourd&apos;hui</a>
        ) : null}
        <a
          href={`/admin/caisse/export?month=${month}`}
          className="ml-auto rounded-md border border-slate-300 px-4 py-1.5 font-medium hover:bg-slate-50"
        >
          Exporter le mois (CSV)
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Espèces encaissées" value={formatPrice(cashIn)} hint={formatDate(day)} />
        <Kpi label="Carte encaissée" value={formatPrice(cardIn)} hint={formatDate(day)} />
        <Kpi label="Dépenses du jour" value={formatPrice(sum(todays, "depense"))} />
        <Kpi
          label="Solde du jour"
          value={formatPrice(cashIn + cardIn - sum(todays, "depense"))}
          hint={`Mois : ${formatPrice(monthIn - monthOut)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel title="Nouvelle écriture">
          <form action={addCashEntry} className="grid gap-3 p-4 text-sm">
            <input type="hidden" name="business_day" value={day} />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Type</span>
                <select name="kind" defaultValue="recette" className={FIELD}>
                  {Object.entries(CASH_KINDS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Mode de paiement</span>
                <select name="method" defaultValue="especes" className={FIELD}>
                  {Object.entries(CASH_METHODS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Catégorie</span>
                <select name="category" defaultValue="bar" className={FIELD}>
                  {Object.entries(CASH_CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Montant (€)</span>
                <input name="amount" inputMode="decimal" required placeholder="12,50" className={`${FIELD} tabular-nums`} />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Libellé</span>
              <input name="label" required maxLength={120} placeholder="Ex. 3 cafés et 1 goûter" className={FIELD} />
            </label>
            <button className="justify-self-start rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">
              Enregistrer l&apos;écriture
            </button>
            <p className="text-xs text-slate-500">
              Une écriture ne se modifie ni ne se supprime : pour corriger une erreur, saisissez l&apos;écriture inverse.
            </p>
          </form>
        </Panel>

        <Panel title="Clôture de caisse">
          <form action={closeCashDay} className="grid gap-3 p-4 text-sm">
            <input type="hidden" name="business_day" value={day} />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Fond de caisse (€)</span>
                <input name="opening_float" inputMode="decimal" defaultValue={cents(closing?.opening_float_cents)} className={`${FIELD} tabular-nums`} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Espèces comptées (€)</span>
                <input name="counted_cash" inputMode="decimal" defaultValue={cents(closing?.counted_cash_cents)} className={`${FIELD} tabular-nums`} />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Note</span>
              <input name="note" maxLength={300} defaultValue={closing?.note ?? ""} className={FIELD} />
            </label>
            <dl className="grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-3">
              <dt className="text-slate-500">Espèces attendues</dt>
              <dd className="text-right font-medium tabular-nums">{formatPrice(expectedCash)}</dd>
              <dt className="text-slate-500">Écart</dt>
              <dd
                className={`text-right font-semibold tabular-nums ${gap === null ? "text-slate-400" : gap === 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {gap === null ? "Non clôturée" : formatPrice(gap)}
              </dd>
            </dl>
            <button className="justify-self-start rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">
              Enregistrer la clôture
            </button>
          </form>
        </Panel>
      </div>

      <Panel title={`Écritures du ${formatDate(day)} (${todays.length})`}>
        <Table head={["Heure", "Type", "Catégorie", "Mode", "Libellé", "Montant"]} empty={todays.length === 0}>
          {todays.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap px-4 py-2 tabular-nums text-slate-500">
                {new Date(e.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}
              </td>
              <td className="px-4 py-2">{CASH_KINDS[e.kind]}</td>
              <td className="px-4 py-2">{CASH_CATEGORIES[e.category]}</td>
              <td className="px-4 py-2">{CASH_METHODS[e.method]}</td>
              <td className="px-4 py-2">{e.label}</td>
              <td className={`px-4 py-2 text-right font-semibold tabular-nums ${e.kind === "depense" ? "text-red-600" : "text-emerald-700"}`}>
                {e.kind === "depense" ? "−" : "+"}
                {formatPrice(e.amount_cents)}
              </td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel title={`Mois en cours : ${month}`}>
        <div className="grid grid-cols-2 gap-4 p-4 text-sm lg:grid-cols-4">
          <Kpi label="Recettes espèces" value={formatPrice(sum(entries, "recette", "especes"))} />
          <Kpi label="Recettes carte" value={formatPrice(sum(entries, "recette", "carte"))} />
          <Kpi label="Dépenses" value={formatPrice(monthOut)} />
          <Kpi label="Résultat" value={formatPrice(monthIn - monthOut)} hint="Recettes − dépenses" />
        </div>
      </Panel>
    </div>
  );
}
