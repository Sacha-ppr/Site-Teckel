import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Espace pro", template: "%s · Espace pro" },
  robots: { index: false },
};

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/reservations", label: "Réservations" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/produits", label: "Produits & stock" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-800 md:flex-row">
      <aside className="border-b border-slate-200 bg-slate-900 text-slate-300 md:w-60 md:shrink-0 md:border-b-0">
        <div className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Bar à Teckels</p>
          <p className="text-lg font-semibold text-white">Espace pro</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:pb-0">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-slate-800 px-5 py-4 text-sm md:mt-6 md:block">
          <Link href="/" className="block hover:text-white">← Voir le site</Link>
          <form action={signOut} className="mt-2">
            <button className="hover:text-white">Se déconnecter</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={null}>
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// Défense en profondeur : la page /admin/teckels est un composant client sans contrôle propre,
// et le proxy ne vérifie que la connexion, pas le rôle.
async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}
