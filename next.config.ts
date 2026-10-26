import type { NextConfig } from "next";

// Sans ces variables, le build échoue plus loin avec « supabaseUrl is required ».
// Sur Vercel : Settings > Environment Variables (Production, Preview et Development).
const missing = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"].filter(
  (name) => !process.env[name],
);
if (missing.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missing.join(", ")}. ` +
      "En local, ajoutez-les dans .env.local ; sur Vercel, dans Settings > Environment Variables.",
  );
}

const isDev = process.env.NODE_ENV !== "production";

// Politique de contenu : le site ne charge que ses propres ressources et parle à Supabase.
// 'unsafe-inline' reste nécessaire pour les scripts d'amorçage de Next.js (pas de nonce ici) ;
// le reste (objets, frames, base, formulaires, connexions) est verrouillé.
const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin}${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Interdit d'afficher le site dans une iframe (clickjacking) ; doublon de frame-ancestors pour les vieux navigateurs.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Ne pas annoncer la technologie du serveur.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    agentFeedback: true,
    // Sur Vercel, le cache de build a resservi un ancien CSS (palette d'avant la refonte) : on repart de zéro à chaque build.
    turbopackFileSystemCacheForBuild: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
