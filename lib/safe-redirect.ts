// Redirections « next » : on n'accepte qu'un chemin interne du site.
// Le filtre « commence par / et pas par // » ne suffit pas : « /\evil.com » passe, et les
// navigateurs lisent « \ » comme « / », ce qui envoie le visiteur sur un autre domaine.
export function safeNext(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    // Un chemin interne reste sur l'origine factice ; tout le reste (schéma, hôte) est refusé.
    if (new URL(value, "http://interne.invalid").origin !== "http://interne.invalid") return null;
  } catch {
    return null;
  }
  return value;
}

// Origine utilisée dans les liens envoyés par email. On ne fait pas confiance aux en-têtes
// Host / X-Forwarded-Host (un attaquant pourrait les forger pour détourner le lien de confirmation).
export function trustedOrigin(requestHost: string | null): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Développement local uniquement.
  if (requestHost && /^localhost(:\d+)?$/.test(requestHost)) return `http://${requestHost}`;
  return "http://localhost:3000";
}
