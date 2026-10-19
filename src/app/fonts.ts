import localFont from "next/font/local";

/**
 * Newsreader (OFL), auto-hébergée via next/font : fichiers préchargés et
 * police de secours aux métriques ajustées, pour que les titres ne
 * « sautent » pas au moment où la police se charge.
 * Les fichiers proviennent du paquet @fontsource-variable/newsreader.
 */
export const newsreader = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2",
      style: "normal",
      weight: "200 800",
    },
    {
      path: "../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2",
      style: "italic",
      weight: "200 800",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});
