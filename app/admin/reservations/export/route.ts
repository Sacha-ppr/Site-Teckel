import { listReservations, parseReservationFilters } from "@/lib/admin-data";
import { RESERVATION_STATUS, formulaName } from "@/lib/catalog";

function csvCell(value: string | number | null) {
  let s = String(value ?? "");
  // Injection de formules : Excel exécute une cellule qui commence par = + - @ (ou tabulation / retour chariot).
  // Ces champs sont saisis par les clients : on neutralise avec une apostrophe.
  // Un numéro de téléphone (« +33 6 12… ») ne contient aucun caractère exploitable : on le laisse intact.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s().-]+$/.test(s)) s = "'" + s;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
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
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="reservations-${/^\d{4}-\d{2}-\d{2}$/.test(params.date ?? "") ? params.date : "a-venir"}.csv"`,
    },
  });
}
