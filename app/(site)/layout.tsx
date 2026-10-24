import Link from "next/link";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t-[6px] border-rouge-fonce bg-rouge text-tirage">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pt-14 pb-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
          <div>
            <p className="enseigne text-[clamp(2.2rem,5vw,4rem)]">
              Souriez,
              <br />
              c&apos;est dans la boîte.
            </p>
            <Link href="/reserver" className="btn btn-jeton mt-8">
              Réserver un créneau
            </Link>
          </div>
          <div className="flex flex-col gap-1.5 text-rose">
            <p className="legende mb-2 text-tirage">Le bar</p>
            <p>12 rue des Longs-Dos, 75011 Paris</p>
            <p>Du mercredi au dimanche, 10 h – 20 h</p>
            <p className="mt-3">
              Nos teckels sont suivis par un vétérinaire et ne travaillent jamais plus de quatre heures par
              jour. Siestes obligatoires.
            </p>
          </div>
          <nav aria-label="Pied de page" className="flex flex-col gap-1.5 text-rose">
            <p className="legende mb-2 text-tirage">Plan du site</p>
            <Link href="/bar" className="hover:text-jeton">Le bar & la charte</Link>
            <Link href="/residents" className="hover:text-jeton">Nos résidents</Link>
            <Link href="/boutique" className="hover:text-jeton">Boutique</Link>
            <Link href="/ateliers" className="hover:text-jeton">Ateliers & événements</Link>
            <Link href="/compte" className="hover:text-jeton">Mon compte</Link>
            <Link href="/credits" className="hover:text-jeton">Crédits photo</Link>
          </nav>
        </div>
        <div className="border-t border-rouge-fonce">
          <p className="mx-auto max-w-[1400px] px-4 py-4 text-sm text-rose md:px-8">
            Projet d&apos;école : le bar, ses résidents et sa boutique sont fictifs. Photos de teckels libres de Wikimedia Commons et Flickr, photos d&apos;articles générées par IA.
          </p>
        </div>
      </footer>
    </CartProvider>
  );
}
