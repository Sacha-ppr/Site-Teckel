import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { setReservationStatus } from "@/app/actions/admin";
import { StatusSelect } from "@/components/admin/status-select";
import { Kpi, PageTitle, Panel, Skeleton, Table } from "@/components/admin/ui";
import { listReservations, parseReservationFilters } from "@/lib/admin-data";
import { RESERVATION_STATUS, formatDate, formatPrice, formulaName, formulaPriceCents } from "@/lib/catalog";

export const metadata: Metadata = { title: "Réservations" };

export default function Page({ searchParams }: PageProps<"/admin/reservations">) {
  return (
    <>
      <PageTitle title="Réservations" subtitle="Suivi des créneaux du bar" />
      <Suspense fallback={<Skeleton />}>
        <Reservations searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Reservations({ searchParams }: Pick<PageProps<"/admin/reservations">, "searchParams">) {
  const params = await searchParams;
  const filters = parseReservationFilters(params);
  const reservations = await listReservations(filters);

  const active = reservations.filter((r) => r.status !== "annulee");
  const guests = active.reduce((n, r) => n + r.guests, 0);
  const revenue = active.reduce((n, r) => n + r.guests * formulaPriceCents(r.formula), 0);
  const withDog = active.filter((r) => r.with_own_dog).length;
  const exportQuery = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div className="mt-6 flex flex-col gap-6">
      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Date</span>
          <input type="date" name="date" defaultValue={filters.date} className="rounded-md border border-slate-300 px-2 py-1.5" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Statut</span>
          <select name="status" defaultValue={filters.status ?? ""} className="rounded-md border border-slate-300 px-2 py-1.5">
            <option value="">Tous</option>
            {Object.entries(RESERVATION_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Nom</span>
          <input name="q" defaultValue={filters.q} placeholder="Rechercher…" className="rounded-md border border-slate-300 px-2 py-1.5" />
        </label>
        <button className="rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">Filtrer</button>
        <Link href="/admin/reservations" className="px-2 py-1.5 text-slate-500 hover:text-slate-900">Réinitialiser</Link>
        <a
          href={`/admin/reservations/export${exportQuery ? `?${exportQuery}` : ""}`}
          className="ml-auto rounded-md border border-slate-300 px-4 py-1.5 font-medium hover:bg-slate-50"
        >
          Exporter CSV
        </a>
      </form>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Réservations" value={String(active.length)} hint={filters.date ? formatDate(filters.date) : "À venir"} />
        <Kpi label="Couverts" value={String(guests)} />
        <Kpi label="CA estimé" value={formatPrice(revenue)} />
        <Kpi label="Chiens visiteurs" value={String(withDog)} />
      </div>

      <Panel title={`${reservations.length} réservation${reservations.length > 1 ? "s" : ""}`}>
        <Table
          head={["Date", "Créneau", "Nom", "Téléphone", "Pers.", "Formule", "Chien", "Notes", "Statut"]}
          empty={reservations.length === 0}
        >
          {reservations.map((r) => (
            <tr key={r.id} className={r.status === "annulee" ? "text-slate-400" : undefined}>
              <td className="whitespace-nowrap px-4 py-2 capitalize">{formatDate(r.date)}</td>
              <td className="px-4 py-2 tabular-nums">{r.slot}</td>
              <td className="px-4 py-2 font-medium">{r.contact_name}</td>
              <td className="whitespace-nowrap px-4 py-2 tabular-nums">{r.phone ?? "—"}</td>
              <td className="px-4 py-2 tabular-nums">{r.guests}</td>
              <td className="px-4 py-2">{formulaName(r.formula)}</td>
              <td className="px-4 py-2">{r.with_own_dog ? "Oui" : "—"}</td>
              <td className="max-w-56 truncate px-4 py-2 text-slate-500" title={r.notes ?? ""}>{r.notes ?? ""}</td>
              <td className="px-4 py-2">
                <StatusSelect id={r.id} value={r.status} options={RESERVATION_STATUS} action={setReservationStatus} />
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
