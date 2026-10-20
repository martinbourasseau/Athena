"""Reconstruction 2,5D du buste d'Athéna à partir de l'image de référence.
Volume = silhouette gonflée + structure anatomique du visage + relief d'ombrage."""
import numpy as np, cv2
from PIL import Image
im = np.asarray(Image.open('ref.png').convert('RGB')).astype(np.float32) / 255
H, W = im.shape[:2]
r, g, b = im[..., 0], im[..., 1], im[..., 2]
L = 0.3 * r + 0.55 * g + 0.15 * b
blur = lambda a, s: cv2.GaussianBlur(a, (0, 0), s)

# ── Silhouette : on lisse les étincelles du fond puis on garde la plus grande masse.
# Enveloppe tracée sur les repères de l'image (le fond est éclairé à droite :
# un seuil seul y déborde), croisée avec un seuil relatif au fond local.
hull = np.array([(330,25),(450,15),(560,55),(610,140),(660,205),(745,300),(805,400),(838,500),(862,600),
  (872,690),(885,760),(888,860),(862,930),(825,1000),(790,1050),(735,1075),(680,1090),(668,1180),(680,1255),
  (760,1285),(900,1300),(1024,1330),(1024,1536),(0,1536),(0,1420),(120,1335),(175,1250),(165,1110),
  (190,960),(160,820),(140,670),(105,520),(100,380),(140,265),(215,160),(260,70)], np.int32)
m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [hull], 1)
local = blur(L, 5) - blur(L, 60) * 0.6
keep = (blur((local > 0.03).astype(np.float32), 9) > 0.25).astype(np.uint8)
m = m * keep
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (35, 35)))
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); m = (lab == big).astype(np.uint8)
ff = np.pad(m, 1); cv2.floodFill(ff, None, (0, 0), 2); m = np.where(ff[1:-1, 1:-1] == 2, 0, 1).astype(np.uint8)
mask = blur(m.astype(np.float32), 10)
Image.fromarray(m*255).resize((512,768)).save('v_mask.png')

# ── Volume de base : gonflement (profil circulaire) de la silhouette.
dt = cv2.distanceTransform(m, cv2.DIST_L2, 5)
dn = np.clip(dt / 230.0, 0, 1)
base = np.sqrt(dn * (2 - dn))
base = blur(base, 18)

# ── Structure du visage : repères relevés sur l'image (pixels).
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
def bump(cx, cy, rx, ry, amp, ang=0.0):
    c, s = np.cos(ang), np.sin(ang)
    u = ((xx - cx) * c + (yy - cy) * s) / rx
    v = (-(xx - cx) * s + (yy - cy) * c) / ry
    return amp * np.exp(-(u * u + v * v))
face = np.zeros_like(L)
face += bump(690, 860, 190, 230, 0.38)            # masse du visage, en avant du casque et des cheveux
face += bump(715, 805, 20, 70, 0.30, 0.15)        # arête du nez
face += bump(726, 858, 30, 26, 0.20)              # pointe du nez
face += bump(622, 728, 42, 22, -0.13)             # orbite gauche
face += bump(778, 738, 30, 20, -0.11)             # orbite droite
face += bump(640, 698, 80, 16, 0.07, -0.05)       # arcade sourcilière
face += bump(780, 704, 45, 14, 0.05)
face += bump(700, 922, 52, 14, 0.07)              # lèvre supérieure
face += bump(705, 955, 46, 15, 0.08)              # lèvre inférieure
face += bump(700, 939, 50, 5, -0.05)              # commissure / fente des lèvres
face += bump(728, 1022, 55, 40, 0.10)             # menton
face += bump(560, 870, 75, 70, 0.07)              # pommette gauche
face += bump(800, 860, 40, 60, 0.03)              # pommette droite
face += bump(505, 530, 75, 75, 0.10)              # ornement spiralé du casque
face += bump(600, 630, 300, 40, 0.10, 0.08)       # visière du casque qui avance sur le front
face += bump(420, 360, 260, 230, 0.12)            # calotte du casque
face += bump(700, 1180, 85, 140, 0.05)            # cou

# ── Relief fin d'ombrage (boucles, ornements) : clair = vers nous.
detail = blur(L, 4.5) - blur(L, 22)
detail = np.clip(detail * 0.7, -0.06, 0.06)

depth = (0.62 * base + face + detail) * mask
depth = np.clip(depth / np.percentile(depth[m > 0], 99.7), 0, 1)

# ── Luminance « sculpture » : ombrage lissé (on garde les traits, on efface les étincelles).
shade = np.clip(blur(L, 2.0) * 1.9, 0, 1) * mask
# Arêtes (contours, yeux, nez, lèvres, casque).
gx = cv2.Sobel(blur(L, 3), cv2.CV_32F, 1, 0); gy = cv2.Sobel(blur(L, 3), cv2.CV_32F, 0, 1)
edge = np.clip(np.hypot(gx, gy) * 2.2, 0, 1) * mask
# Braise : pixels orangés de l'image.
orange = np.clip((r - g * 1.05) * 3.0, 0, 1) * (r > 0.35)
orange = np.clip(blur(orange, 1.5) * 2, 0, 1) * mask

np.savez_compressed('relief.npz', depth=depth, shade=shade, edge=edge, orange=orange, mask=mask)
for name, a in (('depth', depth), ('shade', shade), ('edge', edge), ('orange', orange)):
    Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).resize((512, 768)).save(f'v_{name}.png')
print('mask coverage', m.mean(), 'depth range', depth.min(), depth.max())

# ── Carte pour le site : 256 × 384, RGBA = ombrage, profondeur, contours, silhouette.
yy = np.arange(H)[:, None] * np.ones((1, W))
fade = np.clip((1420 - yy) / 220, 0, 1)  # fondu vers les épaules
small = lambda a: cv2.resize(a.astype(np.float32), (256, 384), interpolation=cv2.INTER_AREA)
rgba = np.dstack([small(shade), small(depth), small(edge), small(mask * fade)])
Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').save(
    'athena-relief.webp', quality=88, method=6)

# Le site sert la carte en six fragments (public/relief/0.bin … 5.bin).
data = open('athena-relief.webp', 'rb').read()
size = -(-len(data) // 6)
for i in range(6):
    open(f'{i}.bin', 'wb').write(data[i * size:(i + 1) * size])
