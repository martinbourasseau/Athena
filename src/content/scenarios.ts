/**
 * Scénarios ILLUSTRATIFS.
 * Ce sont des cas d'usage possibles, pas des clients, pas des projets
 * réalisés, pas des résultats mesurés. Le site les étiquette comme tels.
 */

export type Scenario = {
  id: string;
  title: string;
  situation: string;
  steps: string[];
  /** Le point où l'humain valide — le « nœud ». */
  checkpoint: string;
};

export const scenarios: Scenario[] = [
  {
    id: "qualification",
    title: "Qualification des demandes entrantes",
    situation:
      "Des demandes arrivent par mail et par formulaire. Les trier prend du temps, et les plus urgentes se perdent parfois dans le flux.",
    steps: [
      "Lire chaque nouvelle demande",
      "Identifier l'intention et l'urgence",
      "Classer selon vos critères",
      "Préparer un brouillon de réponse",
    ],
    checkpoint: "Vous relisez et validez les réponses avant tout envoi.",
  },
  {
    id: "recherche",
    title: "Recherche documentaire",
    situation:
      "L'information utile existe déjà, dans vos documents internes, contrats ou procédures, mais la retrouver demande de tout rouvrir.",
    steps: [
      "Interroger vos documents autorisés",
      "Retrouver les passages pertinents",
      "Synthétiser la réponse",
      "Citer les sources consultées",
    ],
    checkpoint: "Chaque réponse renvoie à ses sources pour que vous puissiez vérifier.",
  },
  {
    id: "veille",
    title: "Veille sectorielle",
    situation:
      "Suivre un marché, une réglementation ou des concurrents suppose de parcourir de nombreuses sources, régulièrement.",
    steps: [
      "Parcourir les sources que vous choisissez",
      "Filtrer selon vos sujets",
      "Résumer les éléments nouveaux",
      "Rédiger une note périodique",
    ],
    checkpoint: "Vous ajustez les sources et les sujets suivis à tout moment.",
  },
  {
    id: "commercial",
    title: "Assistance commerciale",
    situation:
      "Préparer un rendez-vous, rédiger une proposition ou relancer un contact demande de rassembler des informations dispersées.",
    steps: [
      "Rassembler l'historique du contact",
      "Préparer une fiche de rendez-vous",
      "Proposer une trame de proposition",
      "Suggérer la prochaine relance",
    ],
    checkpoint: "Les propositions et relances partent seulement après votre accord.",
  },
  {
    id: "processus",
    title: "Automatisation d'un processus",
    situation:
      "Une tâche revient chaque semaine et suit toujours les mêmes étapes, avec quelques décisions à prendre au passage.",
    steps: [
      "Récupérer les éléments d'entrée",
      "Appliquer vos règles de décision",
      "Mettre à jour vos outils",
      "Rendre compte de ce qui a été fait",
    ],
    checkpoint: "Les cas ambigus vous sont remontés au lieu d'être tranchés seuls.",
  },
];

/** Démonstrations du hero — également illustratives. */
export type LoomTask = {
  id: string;
  label: string;
  steps: string[];
  result: { title: string; lines: string[] };
  checkpoint: string;
};

export const loomTasks: LoomTask[] = [
  {
    id: "mails",
    label: "Trier mes mails",
    steps: ["lire", "comprendre", "classer", "rédiger"],
    result: {
      title: "Demande de devis — priorité haute",
      lines: ["Intention : devis pour une prestation", "Classée : à traiter aujourd'hui", "Brouillon de réponse prêt"],
    },
    checkpoint: "Envoyer la réponse ?",
  },
  {
    id: "devis",
    label: "Préparer un devis",
    steps: ["lire", "retrouver", "assembler", "vérifier"],
    result: {
      title: "Brouillon de devis",
      lines: ["Besoin repris de la demande", "Lignes issues de votre grille", "Mentions à relire signalées"],
    },
    checkpoint: "Valider le brouillon ?",
  },
  {
    id: "veille",
    label: "Faire ma veille",
    steps: ["parcourir", "filtrer", "résumer", "rédiger"],
    result: {
      title: "Note de veille",
      lines: ["Sources suivies parcourues", "Nouveautés retenues par sujet", "Synthèse avec liens"],
    },
    checkpoint: "Diffuser la note ?",
  },
  {
    id: "contact",
    label: "Qualifier un contact",
    steps: ["lire", "contextualiser", "évaluer", "proposer"],
    result: {
      title: "Fiche contact",
      lines: ["Besoin exprimé résumé", "Évaluation selon vos critères", "Action suivante proposée"],
    },
    checkpoint: "Retenir cette action ?",
  },
];
