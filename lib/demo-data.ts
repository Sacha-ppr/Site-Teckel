// Données de démonstration affichées dans /admin quand la base est vide
// (pas encore de vraie commande ou réservation). Purement côté code,
// aucune dépendance à Supabase : elles disparaissent dès qu'une vraie
// ligne existe dans la table correspondante.
import { addDays, isOpenOn, parisToday, type FormulaId, type Order, type OrderStatus, type Reservation, type Slot } from "./catalog";

type DemoOrderSpec = {
  daysAgo: number;
  hour: number;
  status: OrderStatus;
  name: string;
  address: string;
  items: { product_name: string; quantity: number; unit_price_cents: number }[];
};

const ORDER_SPECS: DemoOrderSpec[] = [
  { daysAgo: 0, hour: 9, status: "payee", name: "Camille Dubois", address: "14 rue de Charonne, 75011 Paris", items: [{ product_name: "Biscuits en forme de saucisse", quantity: 2, unit_price_cents: 850 }, { product_name: "Balle à terrier", quantity: 1, unit_price_cents: 900 }] },
  { daysAgo: 0, hour: 16, status: "payee", name: "Hugo Girard", address: "3 rue Oberkampf, 75011 Paris", items: [{ product_name: "Harnais en H dos long", quantity: 1, unit_price_cents: 4400 }] },
  { daysAgo: 1, hour: 11, status: "preparation", name: "Léa Chevalier", address: "27 avenue de la République, 75011 Paris", items: [{ product_name: "Manteau « Saucisse au chaud »", quantity: 1, unit_price_cents: 4900 }, { product_name: "Os à mâcher naturel", quantity: 1, unit_price_cents: 1200 }] },
  { daysAgo: 2, hour: 18, status: "preparation", name: "Nathan Moreau", address: "9 rue Saint-Maur, 75011 Paris", items: [{ product_name: "Pull marinière", quantity: 1, unit_price_cents: 3400 }] },
  { daysAgo: 3, hour: 10, status: "expediee", name: "Chloé Fontaine", address: "52 rue de Montreuil, 75011 Paris", items: [{ product_name: "Rampe de canapé", quantity: 1, unit_price_cents: 8900 }] },
  { daysAgo: 3, hour: 20, status: "expediee", name: "Gabriel Bernard", address: "18 boulevard Voltaire, 75011 Paris", items: [{ product_name: "Tapis de fouille", quantity: 1, unit_price_cents: 2900 }, { product_name: "Peluche blaireau", quantity: 2, unit_price_cents: 1600 }] },
  { daysAgo: 4, hour: 13, status: "expediee", name: "Manon Rousseau", address: "61 rue de Belleville, 75020 Paris", items: [{ product_name: "Imperméable ciré", quantity: 1, unit_price_cents: 3900 }] },
  { daysAgo: 5, hour: 9, status: "expediee", name: "Louis Lemoine", address: "4 rue des Pyrénées, 75020 Paris", items: [{ product_name: "Gamelle céramique surélevée", quantity: 1, unit_price_cents: 2700 }, { product_name: "Biscuits en forme de saucisse", quantity: 3, unit_price_cents: 850 }] },
  { daysAgo: 6, hour: 17, status: "expediee", name: "Emma Gauthier", address: "33 rue Myrha, 75018 Paris", items: [{ product_name: "Béret parisien", quantity: 1, unit_price_cents: 2200 }, { product_name: "Foulard rouge", quantity: 1, unit_price_cents: 1400 }] },
  { daysAgo: 7, hour: 12, status: "annulee", name: "Sarah Mercier", address: "8 rue Lecourbe, 75015 Paris", items: [{ product_name: "Casquette à oreilles", quantity: 1, unit_price_cents: 1900 }] },
  { daysAgo: 8, hour: 15, status: "expediee", name: "Jules Perrot", address: "71 rue de Vaugirard, 75006 Paris", items: [{ product_name: "Panier « terrier »", quantity: 1, unit_price_cents: 6900 }] },
  { daysAgo: 10, hour: 10, status: "expediee", name: "Inès Blanchard", address: "15 quai de Valmy, 75010 Paris", items: [{ product_name: "Lunettes de soleil canines", quantity: 1, unit_price_cents: 2400 }, { product_name: "Nœud papillon", quantity: 1, unit_price_cents: 1200 }] },
  { daysAgo: 12, hour: 19, status: "expediee", name: "Adam Guérin", address: "22 rue du Cherche-Midi, 75006 Paris", items: [{ product_name: "Pull en laine torsadée", quantity: 1, unit_price_cents: 4200 }] },
  { daysAgo: 14, hour: 9, status: "expediee", name: "Zoé Faure", address: "40 rue de la Roquette, 75011 Paris", items: [{ product_name: "Os à mâcher naturel", quantity: 2, unit_price_cents: 1200 }, { product_name: "Balle à terrier", quantity: 2, unit_price_cents: 900 }] },
  { daysAgo: 16, hour: 14, status: "expediee", name: "Mathis Boyer", address: "6 rue du Faubourg-Saint-Antoine, 75012 Paris", items: [{ product_name: "Harnais en H dos long", quantity: 1, unit_price_cents: 4400 }] },
  { daysAgo: 18, hour: 11, status: "expediee", name: "Juliette Legrand", address: "29 rue de Charonne, 75011 Paris", items: [{ product_name: "Biscuits en forme de saucisse", quantity: 4, unit_price_cents: 850 }] },
  { daysAgo: 20, hour: 16, status: "expediee", name: "Enzo Girard", address: "11 rue de Bagnolet, 75020 Paris", items: [{ product_name: "Manteau « Saucisse au chaud »", quantity: 1, unit_price_cents: 4900 }, { product_name: "Foulard rouge", quantity: 1, unit_price_cents: 1400 }] },
  { daysAgo: 23, hour: 10, status: "expediee", name: "Lina Dubois", address: "2 rue de la Folie-Regnault, 75011 Paris", items: [{ product_name: "Tapis de fouille", quantity: 1, unit_price_cents: 2900 }] },
  { daysAgo: 26, hour: 18, status: "expediee", name: "Noah Fontaine", address: "48 rue Caulaincourt, 75018 Paris", items: [{ product_name: "Pull marinière", quantity: 1, unit_price_cents: 3400 }, { product_name: "Os à mâcher naturel", quantity: 1, unit_price_cents: 1200 }] },
];

export function getDemoOrders(): Order[] {
  const now = Date.now();
  return ORDER_SPECS.map((spec, i) => {
    const subtotal = spec.items.reduce((n, it) => n + it.quantity * it.unit_price_cents, 0);
    const shippingCents = subtotal >= 6000 ? 0 : 590;
    return {
      id: -1000 - i,
      user_id: "demo",
      status: spec.status,
      total_cents: subtotal + shippingCents,
      shipping_cents: shippingCents,
      shipping_name: spec.name,
      shipping_address: spec.address,
      created_at: new Date(now - spec.daysAgo * 86_400_000 - spec.hour * 3_600_000).toISOString(),
      order_items: spec.items,
    };
  });
}

type DemoReservationSpec = {
  dayOffset: number;
  slot: Slot;
  guests: number;
  formula: FormulaId;
  name: string;
  withDog?: boolean;
  notes?: string;
};

const RESERVATION_SPECS: DemoReservationSpec[] = [
  { dayOffset: 0, slot: "10:00", guests: 2, formula: "cafe-calin", name: "Camille Dubois" },
  { dayOffset: 0, slot: "14:00", guests: 4, formula: "gouter-teckel", name: "Hugo Girard", withDog: true },
  { dayOffset: 0, slot: "16:00", guests: 3, formula: "cafe-calin", name: "Léa Chevalier" },
  { dayOffset: 1, slot: "12:00", guests: 5, formula: "apero-saucisse", name: "Nathan Moreau" },
  { dayOffset: 1, slot: "18:00", guests: 2, formula: "cafe-calin", name: "Chloé Fontaine", notes: "Anniversaire du teckel" },
  { dayOffset: 2, slot: "10:00", guests: 1, formula: "cafe-calin", name: "Gabriel Bernard" },
  { dayOffset: 2, slot: "16:00", guests: 6, formula: "gouter-teckel", name: "Manon Rousseau", withDog: true },
  { dayOffset: 3, slot: "12:00", guests: 3, formula: "apero-saucisse", name: "Louis Lemoine" },
  { dayOffset: 3, slot: "14:00", guests: 2, formula: "cafe-calin", name: "Emma Gauthier" },
  { dayOffset: 4, slot: "10:00", guests: 4, formula: "gouter-teckel", name: "Sarah Mercier", withDog: true },
  { dayOffset: 4, slot: "18:00", guests: 5, formula: "apero-saucisse", name: "Jules Perrot" },
  { dayOffset: 5, slot: "12:00", guests: 6, formula: "gouter-teckel", name: "Inès Blanchard" },
  { dayOffset: 5, slot: "14:00", guests: 3, formula: "cafe-calin", name: "Adam Guérin" },
  { dayOffset: 5, slot: "16:00", guests: 2, formula: "cafe-calin", name: "Zoé Faure" },
  { dayOffset: 6, slot: "10:00", guests: 3, formula: "apero-saucisse", name: "Mathis Boyer" },
  { dayOffset: 6, slot: "12:00", guests: 4, formula: "gouter-teckel", name: "Juliette Legrand", withDog: true },
  { dayOffset: 6, slot: "18:00", guests: 2, formula: "cafe-calin", name: "Enzo Girard" },
];

export function getDemoReservations(): Reservation[] {
  const today = parisToday();
  return RESERVATION_SPECS.map((spec, i) => ({
    id: -2000 - i,
    user_id: "demo",
    contact_name: spec.name,
    phone: null,
    date: addDays(today, spec.dayOffset),
    slot: spec.slot,
    guests: spec.guests,
    formula: spec.formula,
    with_own_dog: spec.withDog ?? false,
    notes: spec.notes ?? null,
    status: "confirmee" as const,
    created_at: new Date().toISOString(),
  })).filter((r) => isOpenOn(r.date));
}
