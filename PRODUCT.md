# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all confirmed as primary:

- **Young urban adults (20–35)** looking for an outing with friends or a date, likely to share the visit on social media. Job: find a slot, book it fast, know what to expect.
- **Dachshund owners** who come with their own dog, buy gear sized for long-backed dogs, and join workshops. Job: shop with confidence that products fit the breed, book a slot with their dog.
- **Families** booking afternoon snacks and birthday parties. Job: check the bar is child-friendly, book for several people.

Back-office users: the bar's staff and owner, using `/admin` to run the day (who is arriving, slot occupancy, orders to ship, stock) and to track revenue (CA by source, trend over time, dog occupancy).

## Product Purpose

A Paris dachshund café ("bar à teckels") with an online shop and a running partnership with real dachshund-rescue associations. Visitors book a time slot to spend time with resident dachshunds over coffee, a snack or an aperitif, can name a preferred resident dog to meet, buy breed-specific products, and optionally donate to a partner association. Success: slots filled, orders placed, donations made, staff able to run the day and track revenue from the back-office.

## Positioning

Not a generic cat/dog café: everything is built around one breed. Resident dachshunds with names and personalities, a shop curated for long backs and short legs (H-harnesses, sofa ramps, raised bowls), and workshops on dachshund-specific topics (back health, recall, tracking).

## Operating Context

- Booking: 5 slots per day (10:00, 12:00, 14:00, 16:00, 18:00), 16 seats per slot, 1–6 guests per booking, closed Monday and Tuesday, paid on site, free cancellation from the customer account. A booking may name one preferred resident dog to meet; this is a wish, not a guarantee — dogs rotate, rest, and resident-dog stats on the back-office help staff manage demand, but no individual per-dog schedule is promised to the customer.
- Formulas: Café câlin 12 €, Goûter teckel 18 €, Apéro saucisse 24 € per person.
- Shop: simulated payment, free shipping from 60 €, otherwise 5.90 €.
- Donations: on a dedicated page and as an optional add-on in the booking and shop checkouts, customers can add a simulated donation to a partner dachshund-rescue association of their choice. No real payment is captured or transferred; the flow must not claim otherwise.
- Account required to book and order (Supabase email/password auth).
- Staff back-office: dashboard KPIs, reservation list with status changes and CSV export, order statuses, product price/stock.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, Cache Components, Partial Prefetching), Tailwind CSS 4, Supabase (Auth + Postgres with RLS). Deployed on Vercel.
- French-language site (fr-FR), prices in euros.
- Admin role is granted by email via `public.admin_emails` (defaults `josephhalle992@gmail.com`, `josephhalle@hotmail.com`).
- Donation partners are real associations named by the user; exact final list still open (candidates raised: SPA, 30 Millions d'Amis). Their names must stay accurate and no logo may be redrawn without a supplied asset.
- Admin dashboard (`/admin`) gains a CA breakdown by source (reservations / shop / donations), a CA evolution chart, and resident-dog popularity/occupancy stats (most-requested dog, occupancy rate, empty slots) — folded into the existing dashboard, not a separate page, alongside the existing reservation, order and product management tools.

## Brand Commitments

- Name: "Le Bar à Teckels". Playful French tone with sausage puns (Chorizo, Merguez, Apéro saucisse), warm and welcoming, never childish.
- Imagery must be **real photographs of dachshunds** (free-licensed stock or AI-generated). **No illustrations.** Binding user requirement.
- Donation partners are presented with respect, never a guilt trip: a simple, optional, warm invitation.

## Evidence on Hand

- This is a **fictional school project**: the address, resident dogs, workshops and catalogue are invented and may stay invented.
- No real testimonials, press, customer counts or reviews exist. Do not fabricate them.
- Photos: free-licensed dachshund photographs from Wikimedia Commons, credited on `/credits`. They do not depict the fictional residents; they stand in for them.
- Donation partner associations are real-world organizations, but the donation itself is simulated like the rest of checkout — no money actually moves.

## Product Principles

1. Booking first: the shortest path on the site goes to an available slot.
2. The dogs are the product: show them, name them, respect their wellbeing (rest rules, limited hours).
3. Breed expertise earns the shop: every product explains why it suits a dachshund.
4. The back-office is a tool for a busy shift: scannable, dense, no decoration.
5. Generosity stays light: supporting a real rescue association is one tap away, never a blocking step or a guilt trip.
