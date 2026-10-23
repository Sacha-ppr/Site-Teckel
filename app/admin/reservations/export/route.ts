import { listReservations, parseReservationFilters } from "@/lib/admin-data";
import { RESERVATION_STATUS, formulaName } from "@/lib/catalog";

function csvCell(value: string | number | null) {
  const s = String(value ?? "");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  // listReservations vérifie le rôle admin (redirection sinon).
  const reservations = await listReservations(parseReservationFilters(params));

  const header = ["Date", "Créneau", "Nom", "Téléphone", "Personnes", "Formule", "Chien", "Notes", "Statut"];
  const rows = reservations.map((r) => [
    r.date,
    r.slot,
    r.contact_name,
    r.phone,
    r.guests,
    formulaName(r.formula),
    r.with_own_dog ? "Oui" : "Non",
    r.notes,
    RESERVATION_STATUS[r.status],
  ]);
  // Séparateur « ; » et BOM pour une ouverture directe dans Excel en français.
  const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservations-${params.date ?? "a-venir"}.csv"`,
    },
  });
}
