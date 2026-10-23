import Link from "next/link";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-ink-soft sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-ink">Le Bar à Teckels</p>
            <p className="mt-2">12 rue des Longs-Dos, 75011 Paris</p>
            <p>Du mercredi au dimanche, 10 h – 20 h</p>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/reserver" className="hover:text-caramel">Réserver un créneau</Link>
            <Link href="/boutique" className="hover:text-caramel">Boutique</Link>
            <Link href="/ateliers" className="hover:text-caramel">Ateliers & événements</Link>
          </div>
          <p>
            Nos teckels sont suivis par un vétérinaire et ne travaillent jamais plus de quatre heures par
            jour. Siestes obligatoires.
          </p>
        </div>
      </footer>
    </CartProvider>
  );
}
