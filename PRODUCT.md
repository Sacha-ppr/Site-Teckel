# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all confirmed as primary:

- **Young urban adults (20–35)** looking for an outing with friends or a date, likely to share the visit on social media. Job: find a slot, book it fast, know what to expect.
- **Dachshund owners** who come with their own dog, buy gear sized for long-backed dogs, and join workshops. Job: shop with confidence that products fit the breed, book a slot with their dog.
- **Families** booking afternoon snacks and birthday parties. Job: check the bar is child-friendly, book for several people.

Back-office users: the bar's staff, using `/admin` to run the day (who is arriving, slot occupancy, orders to ship, stock).

## Product Purpose

A Paris dachshund café ("bar à teckels") with an online shop. Visitors book a time slot to spend time with resident dachshunds over coffee, a snack or an aperitif, and buy breed-specific products. Success: slots filled, orders placed, staff able to run the day from the back-office.

## Positioning

Not a generic cat/dog café: everything is built around one breed. Resident dachshunds with names and personalities, a shop curated for long backs and short legs (H-harnesses, sofa ramps, raised bowls), and workshops on dachshund-specific topics (back health, recall, tracking).

## Operating Context

- Booking: 5 slots per day (10:00, 12:00, 14:00, 16:00, 18:00), 16 seats per slot, 1–6 guests per booking, closed Monday and Tuesday, paid on site, free cancellation from the customer account.
- Formulas: Café câlin 12 €, Goûter teckel 18 €, Apéro saucisse 24 € per person.
- Shop: simulated payment, free shipping from 60 €, otherwise 5.90 €.
- Account required to book and order (Supabase email/password auth).
- Staff back-office: dashboard KPIs, reservation list with status changes and CSV export, order statuses, product price/stock.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, Cache Components, Partial Prefetching), Tailwind CSS 4, Supabase (Auth + Postgres with RLS). Deployed on Vercel.
- French-language site (fr-FR), prices in euros.
- Admin role is granted by email via `public.admin_emails` (defaults `josephhalle992@gmail.com`, `josephhalle@hotmail.com`).

## Brand Commitments

- Name: "Le Bar à Teckels". Playful French tone with sausage puns (Chorizo, Merguez, Apéro saucisse), warm and welcoming, never childish.
- Imagery must be **real photographs of dachshunds** (free-licensed stock or AI-generated). **No illustrations.** Binding user requirement. Single exception requested by the user: the « Habille ton teckel » mini-game (`/habille-ton-teckel`) draws its dog and garments in flat SVG so the clothes can be layered.

## Evidence on Hand

- This is a **fictional school project**: the address, resident dogs, workshops and catalogue are invented and may stay invented.
- No real testimonials, press, customer counts or reviews exist. Do not fabricate them.
- Photos: free-licensed dachshund photographs from Wikimedia Commons, credited on `/credits`. They do not depict the fictional residents; they stand in for them.

## Product Principles

1. Booking first: the shortest path on the site goes to an available slot.
2. The dogs are the product: show them, name them, respect their wellbeing (rest rules, limited hours).
3. Breed expertise earns the shop: every product explains why it suits a dachshund.
4. The back-office is a tool for a busy shift: scannable, dense, no decoration.
