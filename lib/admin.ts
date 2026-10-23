"use client";

// ---------------------------------------------------------------- Types

export type Teckel = {
  id: string;
  name: string;
  trait: string;
  coat: string;
  /** jours travaillés, 1 = lundi … 7 = dimanche */
  workingDays: number[];
  startHour: number; // ex. 14 → 14:00
  endHour: number;
  maxPerDay: number;
  price: number; // par personne, créneau 60 min
  active: boolean;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "honored";

export type Booking = {
  id: string;
  teckelId: string;
  /** yyyy-mm-dd */
  date: string;
  /** HH:mm */
  time: string;
  duration: 30 | 60;
  people: number;
  extras: string[];
  customer: string;
  status: BookingStatus;
  total: number;
};

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customer: string;
  items: string[];
  /** livraison ou retrait boutique */
  mode: "livraison" | "retrait";
  status: OrderStatus;
  /** yyyy-mm-dd */
  date: string;
  total: number;
};

export type Donation = {
  id: string;
  donor: string;
  amount: number;
  association: "30 Millions d'Amis" | "SPA" | "Refuge de marchepied";
  date: string;
};

export type AdminDb = {
  teckels: Teckel[];
  bookings: Booking[];
  orders: Order[];
  donations: Donation[];
};

// ---------------------------------------------------------------- Helpers

const CUSTOMER_NAMES = [
  "Marion Fontaine", "Julien Kéravel", "Camille Toussaint", "Éric Bernaudeau",
  "Sofia Marchetti", "Léa Perrin", "Hugo Danjou", "Amandine Ceyrat",
  "Nicolas Estève", "Rébecca Hassoun", "Théo G-authier", "Blanche Riedel",
  "Paul-Olivier Bel", "Jeanne-Marie Vaux", "Greg Lécorché", "Maria Sanchez",
];

const EXTRAS = ["boisson offerte", "gâteau pour chien", "photo souvenir", "privatisation"];

const PRODUCTS = [
  "T-shirt « Patouille béarnaise »", "Mug teckel allongé", "Tote bag « 6 pattes »",
  "Affiche « Le Gratin »", "Collier tartan XXS", "Laiss'pote cuir",
  "Jouet korékoké", "Friandises saucisson", "Gamelles inox duo",
  "Bière « Tripe Sale » 33cl", "Sirop grenadine maison", "Gâteau d'anniversaire croûté",
  "Coffee beans « Cri du cœur »", "Coffret « Après-midi grattant »", "Carte cadeau créneau",
];

const rng = (() => {
  let s = 42;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

export function euros(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function eurosPrecise(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function dateFr(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function dateFrFull(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

// ---------------------------------------------------------------- Seed

export const SEED_TECKELS: Teckel[] = [
  { id: "gratin", name: "Le Gratin", trait: "Grand séducteur, ronronne côté crème", coat: "Fauve", workingDays: [1, 2, 3, 4, 5], startHour: 14, endHour: 19, maxPerDay: 4, price: 18, active: true },
  { id: "pistache", name: "Pistache", trait: "Énergique, court après les mouches", coat: "Arlequin", workingDays: [2, 3, 4, 6, 7], startHour: 12, endHour: 18, maxPerDay: 3, price: 16, active: true },
  { id: "berna", name: "Bernadette", trait: "Doyenne sagesse, ronfle poliment", coat: "Noir & feu", workingDays: [1, 2, 3, 5, 6], startHour: 15, endHour: 20, maxPerDay: 3, price: 20, active: true },
  { id: "australe", name: "Australe", trait: "Timide au premier contact, pot de colle ensuite", coat: "Bringé", workingDays: [3, 4, 5, 6, 7], startHour: 13, endHour: 18, maxPerDay: 4, price: 16, active: true },
  { id: "mousson", name: "Mousson", trait: "Abhoie quand la machine à café s'arrête", coat: "Rouge", workingDays: [1, 3, 4, 5, 7], startHour: 14, endHour: 19, maxPerDay: 3, price: 18, active: true },
];

function seedBookings(teckels: Teckel[]): Booking[] {
  const today = new Date();
  const out: Booking[] = [];
  let n = 1;
  // 30 jours de passé + 7 jours à venir
  for (let offset = -30; offset <= 7; offset++) {
    const date = addDays(today, offset);
    const dow = date.getDay() === 0 ? 7 : date.getDay();
    const iso = toISO(date);
    const rate = offset <= 0 ? 0.6 : 0.75; // les créneaux à venir se remplissent bien
    for (const dog of teckels) {
      if (!dog.workingDays.includes(dow)) continue;
      const slots = dog.maxPerDay;
      for (let s = 0; s < slots; s++) {
        if (rng() > rate) continue;
        const hour = dog.startHour + s >= dog.endHour ? dog.startHour : Math.min(dog.startHour + s, dog.endHour - 1);
        const time = `${String(hour).padStart(2, "0")}:00`;
        const past = offset < 0;
        // une petite part d'annulations, une part d'attente sur les jours à venir
        const roll = rng();
        const status: BookingStatus = past
          ? roll < 0.08 ? "cancelled" : "honored"
          : offset === 0
            ? roll < 0.3 ? "pending" : "confirmed"
            : roll < 0.45 ? "pending" : "confirmed";
        const duration: 30 | 60 = rng() < 0.35 ? 30 : 60;
        const people = 1 + Math.floor(rng() * 3);
        const extras = rng() < 0.4 ? [pick(EXTRAS)] : [];
        const total = dog.price * (duration === 30 ? 0.6 : 1) * people + extras.length * 4;
        out.push({
          id: `B-${String(n++).padStart(4, "0")}`,
          teckelId: dog.id, date: iso, time, duration, people,
          extras, customer: pick(CUSTOMER_NAMES), status,
          total: Math.round(total),
        });
      }
    }
  }
  return out;
}

function seedOrders(): Order[] {
  const today = new Date();
  const out: Order[] = [];
  for (let offset = -30; offset <= 7; offset++) {
    if (rng() < 0.35) continue;
    const date = toISO(addDays(today, offset));
    const itemCount = 1 + Math.floor(rng() * 3);
    const items: string[] = [];
    for (let i = 0; i < itemCount; i++) items.push(pick(PRODUCTS));
    const past = offset < 0;
    const roll = rng();
    const status: OrderStatus = past
      ? roll < 0.06 ? "cancelled" : "delivered"
      : roll < 0.5 ? "pending" : "shipped";
    out.push({
      id: `C-${toISO(today)}-${String(out.length + 1).padStart(3, "0")}`,
      customer: pick(CUSTOMER_NAMES), items,
      mode: rng() < 0.5 ? "livraison" : "retrait",
      status, date,
      total: Math.round(18 + rng() * 70),
    });
  }
  return out;
}

function seedDonations(): Donation[] {
  const today = new Date();
  const out: Donation[] = [];
  const assos: Donation["association"][] = ["30 Millions d'Amis", "SPA", "Refuge de marchepied"];
  for (let offset = -30; offset <= 7; offset++) {
    if (rng() < 0.55) continue;
    out.push({
      id: `D-${String(out.length + 1).padStart(3, "0")}`,
      donor: pick(CUSTOMER_NAMES),
      amount: [3, 5, 5, 10, 10, 15, 20][Math.floor(rng() * 7)],
      association: pick(assos),
      date: toISO(addDays(today, offset)),
    });
  }
  return out;
}

function buildSeed(): AdminDb {
  const teckels = SEED_TECKELS;
  return {
    teckels,
    bookings: seedBookings(teckels),
    orders: seedOrders(),
    donations: seedDonations(),
  };
}

// ---------------------------------------------------------------- Store

const KEY = "bar-a-teckel-db-v1";

let cached: AdminDb | null = null;

export function loadDb(): AdminDb {
  if (typeof window === "undefined") return buildSeed(); // SSR fallback (docker seed complet)
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      cached = JSON.parse(raw) as AdminDb;
      return cached;
    }
  } catch { /* localStorage indisponible : on retombe sur le seed */ }
  cached = buildSeed();
  window.localStorage.setItem(KEY, JSON.stringify(cached));
  return cached;
}

export function saveDb(db: AdminDb) {
  cached = db;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  }
}

export function resetDb(): AdminDb {
  cached = buildSeed();
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  saveDb(cached);
  return cached;
}

export function useAdminData(): [
  AdminDb,
  (mutate: (d: AdminDb) => void) => void,
] {
  const db = loadDb();
  const mutate = (fn: (d: AdminDb) => void) => {
    const clone: AdminDb = JSON.parse(JSON.stringify(loadDb()));
    fn(clone);
    saveDb(clone);
    window.dispatchEvent(new CustomEvent("bar-a-teckel:db-change"));
  };
  return [db, mutate];
}

// sélecteurs pour le dashboard -------------------------------------------------

export function revenueByDay(db: AdminDb, days: number): { date: string; total: number; reservations: number; boutique: number; dons: number }[] {
  const today = new Date();
  const out: { date: string; total: number; reservations: number; boutique: number; dons: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const iso = toISO(addDays(today, -i));
    const bookingTotal = db.bookings
      .filter((b) => b.date === iso && (b.status === "honored" || b.status === "confirmed"))
      .reduce((s, b) => s + b.total, 0);
    const orderTotal = db.orders
      .filter((o) => o.date === iso && o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const donTotal = db.donations.filter((d) => d.date === iso).reduce((s, d) => s + d.amount, 0);
    out.push({ date: iso, total: bookingTotal + orderTotal + donTotal, reservations: bookingTotal, boutique: orderTotal, dons: donTotal });
  }
  return out;
}

export function toTodayISO(): string {
  return toISO(new Date());
}

export function bookedCount(db: AdminDb, teckelId: string, iso: string): number {
  return db.bookings.filter(
    (b) => b.teckelId === teckelId && b.date === iso && b.status !== "cancelled",
  ).length;
}
