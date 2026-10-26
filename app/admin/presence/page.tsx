import type { Metadata } from "next";
import { Suspense } from "react";
import { saveDayPresence } from "@/app/actions/admin";
import { PageTitle, Panel, Skeleton } from "@/components/admin/ui";
import { getSupabase, requireAdmin } from "@/lib/auth";
import { addDays, formatDate, parisToday, type DogPresence } from "@/lib/catalog";
import { checkPresence, dogMinutes, isAnnounced, isoWeekday, weekStart } from "@/lib/presence";
import { RESIDENTS } from "@/lib/residents";

export const metadata: Metadata = { title: "Présence des teckels" };

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_SHORT = ["", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const FIELD = "rounded-md border border-slate-300 bg-white px-2 py-1.5";

export default function Page({ searchParams }: PageProps<"/admin/presence">) {
  return (
    <>
      <PageTitle
        title="Teckels : présence"
        subtitle="Heures réelles au bar, comparées à ce que le site annonce. Chaque teckel a son plafond journalier."
      />
      <Suspense fallback={<Skeleton />}>
        <Presence searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function formatMinutes(minutes: number) {
  if (minutes === 0) return "—";
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}

async function Presence({ searchParams }: Pick<PageProps<"/admin/presence">, "searchParams">) {
  await requireAdmin();
  const params = await searchParams;
  const requested = typeof params.date === "string" ? params.date : "";
  const day = ISO_DAY.test(requested) ? requested : parisToday();
  const today = parisToday();
  const monday = weekStart(day);
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const supabase = await getSupabase();
  const { data } = await supabase
    .from("dog_presence")
    .select("*")
    .gte("business_day", monday)
    .lte("business_day", week[6]);
  const records = (data ?? []) as DogPresence[];

  const issues = checkPresence(records, week, today);
  const dayRecords = new Map(records.filter((r) => r.business_day === day).map((r) => [r.dog, r]));
  // Le bar est fermé le lundi et le mardi.
  const dayOpen = isoWeekday(day) > 2;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <form className="flex items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Semaine du</span>
            <input type="date" name="date" defaultValue={day} className={FIELD} />
          </label>
          <button className="rounded-md bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-700">Afficher</button>
        </form>
        <p className="ml-auto text-slate-500">
          {formatDate(week[0])} → {formatDate(week[6])}
        </p>
      </div>

      <Panel title={`Écarts avec le site (${issues.length})`}>
        {issues.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500">Aucun écart : le site et le carnet concordent pour cette semaine.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {issues.map((issue) => (
              <li key={`${issue.dog}-${issue.day}-${issue.text}`} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${issue.level === "alerte" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {issue.level === "alerte" ? "À vérifier" : "Info"}
                </span>
                <span className="font-medium">{issue.dog}</span>
                <span className="text-slate-500 capitalize">{formatDate(issue.day)}</span>
                <span>{issue.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Semaine : présence par teckel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Teckel</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Site annonce</th>
                {week.map((d) => (
                  <th key={d} className={`whitespace-nowrap px-3 py-2 text-center font-medium ${d === day ? "text-slate-900" : ""}`}>
                    {DAY_SHORT[isoWeekday(d)]} {d.slice(8)}
                  </th>
                ))}
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RESIDENTS.map((dog) => (
                <tr key={dog.slug}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium">{dog.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-500">{dog.schedule}</td>
                  {week.map((d) => {
                    const r = records.find((x) => x.dog === dog.slug && x.business_day === d);
                    const closed = isoWeekday(d) <= 2;
                    const announced = isAnnounced(dog, d);
                    return (
                      <td
                        key={d}
                        className={`whitespace-nowrap px-3 py-2 text-center tabular-nums ${closed ? "bg-slate-50 text-slate-300" : announced ? "" : "text-slate-400"}`}
                      >
                        {!r ? (
                          <span className="text-slate-300">{announced ? "· · ·" : ""}</span>
                        ) : r.status === "absente" ? (
                          <span className="text-amber-700">Absent</span>
                        ) : (
                          <span className="font-medium text-emerald-700">
                            {r.start_time?.slice(0, 5)}–{r.end_time?.slice(0, 5)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-4 py-2 text-right font-semibold tabular-nums">
                    {formatMinutes(dogMinutes(records, dog.slug))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Saisir la journée du ${formatDate(day)}`}>
        {!dayOpen ? (
          <p className="px-4 py-6 text-sm text-slate-500">Le bar est fermé ce jour-là : aucune présence attendue.</p>
        ) : (
          <form action={saveDayPresence} className="flex flex-col">
            <input type="hidden" name="business_day" value={day} />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Teckel</th>
                    <th className="px-4 py-2 font-medium">Annoncé</th>
                    <th className="px-4 py-2 font-medium">Présence</th>
                    <th className="px-4 py-2 font-medium">Arrivée</th>
                    <th className="px-4 py-2 font-medium">Départ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RESIDENTS.map((dog) => {
                    const r = dayRecords.get(dog.slug);
                    return (
                      <tr key={dog.slug}>
                        <td className="px-4 py-2 font-medium">{dog.name}</td>
                        <td className="px-4 py-2 text-slate-500">{isAnnounced(dog, day) ? "Oui" : "Non"}</td>
                        <td className="px-4 py-2">
                          <select name={`${dog.slug}-status`} defaultValue={r?.status ?? ""} className={FIELD} aria-label={`Présence de ${dog.name}`}>
                            <option value="">Non saisi</option>
                            <option value="presente">Présent</option>
                            <option value="absente">Absent</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input type="time" name={`${dog.slug}-start`} defaultValue={r?.start_time?.slice(0, 5) ?? ""} className={FIELD} aria-label={`Arrivée de ${dog.name}`} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="time" name={`${dog.slug}-end`} defaultValue={r?.end_time?.slice(0, 5) ?? ""} className={FIELD} aria-label={`Départ de ${dog.name}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
              <span>Champ « Non saisi » : supprime la présence déjà enregistrée pour ce jour.</span>
              <button className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
                Enregistrer la journée
              </button>
            </div>
          </form>
        )}
      </Panel>
    </div>
  );
}
