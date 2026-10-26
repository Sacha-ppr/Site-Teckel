import { MAX_DOG_MINUTES, addDays, type DogPresence } from "./catalog";
import { RESIDENTS, type Resident } from "./residents";

// Plafond journalier d'un teckel : 4 h par défaut, moins pour un chiot.
export function maxMinutesFor(dog: Resident) {
  return dog.maxMinutes ?? MAX_DOG_MINUTES;
}

export type PresenceIssue = {
  dog: string;
  day: string;
  level: "alerte" | "info";
  text: string;
};

// Lundi = 1 … dimanche = 7.
export function isoWeekday(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return d === 0 ? 7 : d;
}

export function weekStart(iso: string) {
  return addDays(iso, 1 - isoWeekday(iso));
}

// Le bar est fermé le lundi et le mardi : aucun teckel n'est annoncé ces jours-là.
export function isAnnounced(dog: { days: number[] }, iso: string) {
  const wd = isoWeekday(iso);
  return dog.days.includes(wd) && wd !== 1 && wd !== 2;
}

// « 14:30:00 » et « 16:00 » donnent 90 minutes entre les deux.
export function minutesBetween(start: string, end: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return toMinutes(end) - toMinutes(start);
}

export function dogMinutes(records: DogPresence[], dog: string) {
  return records
    .filter((r) => r.dog === dog && r.status === "presente" && r.start_time && r.end_time)
    .reduce((n, r) => n + minutesBetween(r.start_time!, r.end_time!), 0);
}

// Compare ce qui est annoncé sur le site et ce qui a été saisi, jour par jour.
// Un jour passé sans aucune saisie ne compte pas : le carnet a pu ne pas exister encore.
export function checkPresence(records: DogPresence[], weekDays: string[], today: string): PresenceIssue[] {
  const issues: PresenceIssue[] = [];

  for (const day of weekDays) {
    const logged = records.some((r) => r.business_day === day);

    for (const dog of RESIDENTS) {
      const record = records.find((r) => r.dog === dog.slug && r.business_day === day);
      const announced = isAnnounced(dog, day);

      if (!record) {
        if (announced && day < today && logged) {
          issues.push({ dog: dog.name, day, level: "alerte", text: "Annoncé sur le site, aucune présence saisie" });
        }
        continue;
      }

      if (record.status === "absente") {
        if (announced) {
          issues.push({ dog: dog.name, day, level: "info", text: "Annoncé sur le site, mais absent ce jour-là" });
        }
        continue;
      }

      if (!announced) {
        issues.push({ dog: dog.name, day, level: "alerte", text: "Présent alors que le site ne l'annonce pas ce jour-là" });
      }
      const max = maxMinutesFor(dog);
      if (record.start_time && record.end_time && minutesBetween(record.start_time, record.end_time) > max) {
        issues.push({ dog: dog.name, day, level: "alerte", text: `Plus de ${max / 60} h de présence, au-delà du plafond de ${dog.name}` });
      }
    }
  }

  return issues;
}
