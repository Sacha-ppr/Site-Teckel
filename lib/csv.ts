// CSV pour Excel en français : séparateur « ; », BOM UTF-8 pour une ouverture directe.

export function csvCell(value: string | number | null) {
  let s = String(value ?? "");
  // Injection de formules : Excel exécute une cellule qui commence par = + - @ (ou tabulation / retour chariot).
  // Un numéro de téléphone (« +33 6 12… ») ne contient aucun caractère exploitable : on le laisse intact.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s().-]+$/.test(s)) s = "'" + s;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: (string | number | null)[][]) {
  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
}
