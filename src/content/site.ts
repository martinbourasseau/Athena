/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURATION CENTRALE — ATHÉNA
 * ─────────────────────────────────────────────────────────────
 *  Règle : rien n'est inventé. Un champ à `null` masque ou
 *  neutralise l'élément correspondant sur le site.
 *
 *  À confirmer par le propriétaire avant la mise en production :
 *  - name            : nom de marque définitif (provisoire : « Athéna »)
 *  - contact.email   : adresse professionnelle réelle
 *  - group.url       : adresse du site du Groupe BOURASSEAU
 *  - legal.*         : informations légales
 *  Réservation et formulaire : voir .env.example.
 */

export const site = {
  /** Nom provisoire — à confirmer. */
  name: "Athéna",
  tagline: "Agents IA sur mesure",
  locale: "fr_FR",

  description:
    "Athéna conçoit, développe et personnalise des agents IA sur mesure pour les entreprises, entrepreneurs et professionnels : des agents qui exécutent de vraies tâches, sous votre contrôle.",

  location: {
    label: "Nantes · Pays de la Loire · France",
    city: "Nantes",
    region: "Pays de la Loire",
  },

  contact: {
    /**
     * Adresse professionnelle réelle — `null` tant qu'elle n'est pas confirmée.
     * Proposée par le propriétaire, NON activée : orthographe à vérifier
     * (« bourrasseau4 » proposé vs « bourasseau4 » utilisé ailleurs).
     */
    email: null as string | null,
  },

  /** Lien vers la maison mère. `url` à `null` → signature sans lien. */
  group: {
    name: "Groupe BOURASSEAU",
    url: "https://groupe-bourrasso.vercel.app" as string | null,
  },

  /** Plateforme indépendante, présentée comme complémentaire. */
  synatrap: {
    name: "SYNATRAP",
    url: "https://synatrap.com",
  },

  legal: {
    publisher: null as string | null,
    status: null as string | null,
    siret: null as string | null,
    address: null as string | null,
    /** Hébergeur (raison sociale + adresse) — à renseigner depuis les informations officielles. */
    host: null as string | null,
  },
} as const;
