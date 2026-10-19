import localFont from "next/font/local";

/**
 * Anybody (OFL) : police variable, graisse 100–900 et largeur 50–150 %.
 * La largeur porte le système des titres : large et léger pour l'idée,
 * condensé et dense quand « le fil se tend ».
 * Auto-hébergée via next/font : préchargée, police de secours ajustée
 * pour éviter tout saut de mise en page.
 */
export const anybody = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/anybody/files/anybody-latin-standard-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-anybody",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
});
