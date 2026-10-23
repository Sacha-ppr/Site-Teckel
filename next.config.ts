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

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
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
