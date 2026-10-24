import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Police variable auto-hébergée (sous-ensemble latin, licence SIL OFL) : graisse et largeur réglables.
const archivo = localFont({
  src: "./fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  title: {
    default: "Le Bar à Teckels — café, boutique & câlins",
    template: "%s · Le Bar à Teckels",
  },
  description:
    "Le bar à teckels du 11e arrondissement de Paris : réservez votre créneau, rencontrez nos résidents et découvrez notre boutique pour chiens au long dos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
