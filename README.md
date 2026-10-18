# Athéna — agents IA sur mesure

Site indépendant de l'activité « agents IA » du Groupe BOURASSEAU.
Direction artistique : **Le Métier** (Athéna Erganè, le tissage, la carte perforée).
Aucun code partagé avec le site du groupe ni avec SYNATRAP.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3004
npm run build && npm start
```

Node 22, Next.js 16. Vérifications : `npm run typecheck` et `npm run lint`.

## Règle de contenu

Rien n'est inventé. Tout ce qui n'est pas confirmé est à `null` et le site s'adapte.

| Fichier | Contenu |
| --- | --- |
| `src/content/site.ts` | Nom (provisoire), email, lien du groupe, lien SYNATRAP, mentions légales |
| `src/content/scenarios.ts` | Scénarios **illustratifs**, étiquetés comme tels sur le site |
| `src/content/realisations.ts` | Réalisations **réelles et vérifiées** — vide pour l'instant (section neutre affichée) |

## Les trois parcours de contact

Chacun n'est actif que s'il est réellement configuré. Rien n'est simulé.

1. **Formulaire de qualification** — route `/api/qualification`, envoi via l'API Resend.
   Nécessite `RESEND_API_KEY`, `CONTACT_TO_EMAIL` et `CONTACT_FROM_EMAIL` (domaine vérifié dans Resend).
   Sans elles : le formulaire est affiché désactivé et l'API répond 503.
   La confirmation n'apparaît que si Resend a accepté l'email.
2. **Email** — `site.contact.email` dans `src/content/site.ts` (lien `mailto:`).
3. **Réservation** — `NEXT_PUBLIC_BOOKING_URL` (https uniquement), lien vers l'outil réel.

La page d'accueil est statique : après avoir ajouté ou modifié une variable sur Vercel,
**redéployer** pour que l'état du formulaire et de la réservation soit mis à jour.

## Indexation

Les previews ne sont pas indexées (`noindex` + `robots.txt` bloquant).
Seul l'environnement de production Vercel est indexable.

## Déploiement

Projet Vercel dédié. Aucune mise en production sans validation explicite du propriétaire.
