/**
 * Adresse publique du site.
 * Ordre : NEXT_PUBLIC_SITE_URL → domaine de production Vercel →
 * adresse du déploiement (preview) → localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3004";
}

export const siteUrl = resolveSiteUrl();

/** Vrai seulement si les trois variables d'envoi sont présentes. */
export function isFormConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL,
  );
}

/** URL réelle de réservation, ou null. Seules les adresses https sont acceptées. */
export function bookingUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  return url && url.startsWith("https://") ? url : null;
}

/** Les previews et le local ne doivent pas être indexés. */
export const isIndexable =
  process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
