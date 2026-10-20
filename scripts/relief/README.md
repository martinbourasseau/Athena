# Carte de relief du visage d'Athéna

`public/athena-relief.webp` (256 × 384, RGBA) est produite hors ligne par
`relief.py` à partir de l'image de référence fournie (non versionnée ici) :

- R : ombrage de la sculpture ;
- G : profondeur reconstruite ;
- B : contours ;
- A : silhouette (fondue vers les épaules).

## Méthode

Une seule photographie ne contient pas la géométrie complète d'une tête. La
profondeur est donc **reconstruite**, pas mesurée :

1. silhouette : enveloppe tracée sur les repères de l'image, croisée avec un
   seuil relatif au fond local ;
2. volume de base : « gonflement » de la silhouette (profil circulaire sur la
   transformée de distance) ;
3. structure du visage : arête et pointe du nez, orbites, arcades, lèvres,
   menton, pommettes, visière et ornement du casque, placés sur les repères
   relevés dans l'image ;
4. relief fin : passe-haut de la luminance (boucles, ornements).

Le résultat est un relief 2,5D vu de trois quarts : il supporte de légères
rotations, pas un tour complet de la tête.

## Régénérer

```bash
pip install numpy opencv-python pillow
# placer l'image de référence sous le nom ref.png à côté du script
python3 relief.py
```

Le script écrit `athena-relief.webp`, à copier dans `public/`.
