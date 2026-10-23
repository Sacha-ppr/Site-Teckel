import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bar à Teckel",
  description: "Réservez un créneau avec un teckel, boutique et dons.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-stone-900 antialiased">{children}</body>
    </html>
  );
}
