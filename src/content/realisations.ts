/**
 * Réalisations RÉELLES et vérifiées uniquement.
 * Laisser vide tant que les informations n'ont pas été fournies et
 * validées par le propriétaire (et, si besoin, par le client concerné).
 * Aucun nom, logo, témoignage ou chiffre ne doit être ajouté sans source.
 */

export type Realisation = {
  title: string;
  /** Nom du client — uniquement avec son accord. */
  client?: string;
  context: string;
  whatTheAgentDoes: string;
  /** Résultat constaté et vérifiable — jamais estimé. */
  outcome?: string;
  link?: string;
};

export const realisations: Realisation[] = [];
