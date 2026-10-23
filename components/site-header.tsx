import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { CartLink } from "./cart-link";
import { Teckel } from "./teckel";

const NAV = [
  { href: "/bar", label: "Le bar" },
  { href: "/reserver", label: "Réserver" },
  { href: "/boutique", label: "Boutique" },
  { href: "/residents", label: "Nos résidents" },
  { href: "/ateliers", label: "Ateliers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Teckel className="h-8 w-auto" />
          <span className="font-display text-xl font-semibold tracking-tight">Le Bar à Teckels</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-ink-soft">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-caramel">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Suspense fallback={<span className="w-20" />}>
            <UserMenu />
          </Suspense>
          <CartLink />
        </div>
      </div>
      <nav className="md:hidden flex gap-4 overflow-x-auto px-4 pb-3 text-sm font-medium text-ink-soft">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 hover:text-caramel">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/connexion" className="font-medium hover:text-caramel">
        Connexion
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3">
      {user.role === "admin" ? (
        <Link href="/admin" className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
          Espace pro
        </Link>
      ) : null}
      <Link href="/compte" className="font-medium hover:text-caramel">
        Mon compte
      </Link>
    </div>
  );
}
