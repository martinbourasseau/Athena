/**
 * Ce qu'un agent peut accomplir — des POSSIBILITÉS DE CONCEPTION, pas des
 * fonctions garanties : les capacités réelles d'un agent dépendent de sa
 * construction, des outils connectés, des données disponibles et des
 * autorisations accordées. Le site le précise sous la liste.
 */

export type CapabilityDomain = {
  id: string;
  name: string;
  /** Une phrase qui donne l'ambition du domaine. */
  promise: string;
  missions: string[];
};

export const capabilities: CapabilityDomain[] = [
  {
    id: "recherche",
    name: "Recherche et intelligence",
    promise: "Transformer l'information dispersée en décisions éclairées.",
    missions: [
      "Rechercher et synthétiser des informations",
      "Analyser des documents et en extraire l'essentiel",
      "Comparer des données et faire ressortir des tendances",
      "Préparer synthèses, notes et rapports",
    ],
  },
  {
    id: "commercial",
    name: "Activité commerciale",
    promise: "Arriver à chaque échange préparé, et ne laisser filer aucune opportunité.",
    missions: [
      "Préparer des recherches sur vos prospects",
      "Structurer les informations commerciales",
      "Préparer réponses et propositions",
      "Organiser le suivi des opportunités dans vos outils",
    ],
  },
  {
    id: "marketing",
    name: "Marketing et communication",
    promise: "Produire davantage, sur chaque canal, sans perdre votre ton.",
    missions: [
      "Préparer des contenus adaptés à chaque canal",
      "Organiser vos calendriers éditoriaux",
      "Analyser les performances disponibles",
      "Contribuer à vos campagnes et supports",
    ],
  },
  {
    id: "operations",
    name: "Opérations et automatisation",
    promise: "Faire circuler le travail d'un outil à l'autre, sans ressaisie.",
    missions: [
      "Enchaîner des étapes entre plusieurs outils",
      "Transformer des informations en actions structurées",
      "Préparer comptes rendus et tâches de suivi",
      "Automatiser ou coordonner les étapes d'un processus",
    ],
  },
  {
    id: "connaissances",
    name: "Connaissances et organisation interne",
    promise: "Rendre le savoir de l'entreprise disponible au moment où il sert.",
    missions: [
      "Retrouver une information dans vos documents autorisés",
      "Structurer vos connaissances",
      "Préparer des réponses à partir de vos ressources",
      "Fluidifier la circulation de l'information entre équipes",
    ],
  },
  {
    id: "sur-mesure",
    name: "Missions sur mesure",
    promise: "Un agent dédié à votre métier, qui grandit avec vos besoins.",
    missions: [
      "Un agent spécialisé sur un métier ou un processus",
      "Plusieurs capacités combinées dans un même flux de travail",
      "Des instructions, outils et règles propres à votre contexte",
      "Des évolutions au rythme de votre activité",
    ],
  },
];
