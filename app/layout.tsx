import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Polices variables auto-hébergées (sous-ensemble latin, licence SIL OFL).
const dmSans = localFont({
  src: "./fonts/dm-sans.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
});

const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Le Bar à Teckels — café, boutique & câlins",
    template: "%s · Le Bar à Teckels",
  },
  description:
    "Le premier bar à teckels de Paris : réservez votre créneau, rencontrez nos résidents et découvrez notre boutique pour chiens au long dos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
