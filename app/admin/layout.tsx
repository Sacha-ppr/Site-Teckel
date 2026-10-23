import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Traqué le CA", icon: "💰" },
  { href: "/admin/reservations", label: "Réservations", icon: "🗓" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/teckels", label: "Teckels", icon: "🌭" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="sticky top-6 hidden h-fit w-56 shrink-0 md:block">
          <Link href="/" className="mb-8 block px-3 text-sm text-stone-400 transition hover:text-amber-800" title="Retour au site">
            ← Bar à Teckel
          </Link>
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            Back-office
          </p>
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium text-stone-700 transition hover:bg-white hover:text-amber-900"
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-8 px-3 text-xs leading-relaxed text-stone-400">
            Données de démonstration, rien n'est réel.
            <br />
            Les teckels non plus, d'ailleurs.
          </p>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* nav mobile */}
      <nav className="sticky bottom-0 z-10 flex border-t border-stone-200 bg-white/95 backdrop-blur md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-stone-500"
          >
            <span aria-hidden className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
