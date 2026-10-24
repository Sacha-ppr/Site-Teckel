import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { CartLink } from "./cart-link";

const NAV = [
  { href: "/bar", label: "Le bar" },
  { href: "/residents", label: "Résidents" },
  { href: "/boutique", label: "Boutique" },
  { href: "/ateliers", label: "Ateliers" },
];

// L'enseigne lumineuse au-dessus de la cabine.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-rouge text-tirage shadow-[0_1px_0_rgb(0_0_0/0.25)]">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 md:px-8">
        <Link href="/" className="enseigne shrink-0 text-[1.1rem] leading-none [font-stretch:100%] sm:[font-stretch:112%] md:text-[1.35rem]">
          Le Bar à Teckels
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="legende text-[0.8rem] hover:text-jeton">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:block">
            <Suspense fallback={<span className="w-20" />}>
              <UserMenu />
            </Suspense>
          </div>
          <CartLink />
          <Link href="/reserver" className="btn btn-jeton hidden px-5 py-2.5 sm:inline-flex">
            Réserver
          </Link>
        </div>
      </div>
      <nav
        aria-label="Navigation principale"
        className="flex gap-5 overflow-x-auto border-t border-rouge-fonce px-4 py-2.5 xl:hidden"
      >
        <Link href="/reserver" className="legende shrink-0 text-jeton sm:hidden">
          Réserver
        </Link>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="legende shrink-0 hover:text-jeton">
            {item.label}
          </Link>
        ))}
        <div className="shrink-0 sm:hidden">
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}

async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/connexion" className="legende hover:text-jeton">
        Connexion
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4">
      {user.role === "admin" ? (
        <Link href="/admin" className="legende rounded-full bg-encre px-3 py-1.5 text-tirage hover:bg-rouge-fonce">
          Espace pro
        </Link>
      ) : null}
      <Link href="/compte" className="legende hover:text-jeton">
        Mon compte
      </Link>
    </div>
  );
}
