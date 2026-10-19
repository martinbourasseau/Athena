import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { anybody } from "./fonts";
import { site } from "@/content/site";
import { isIndexable, siteUrl } from "@/lib/env";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { Universe } from "@/components/Universe";

const title = `${site.name} — Agents IA sur mesure pour les entreprises · Nantes`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#04080B",
  colorScheme: "dark",
};

/**
 * Pose la classe `js` avant le premier affichage : les éléments animés
 * peuvent ainsi partir de leur état initial sans clignoter. Filet de
 * sécurité : si le moteur ne démarre pas en 3 s, la classe est retirée
 * et tout le contenu s'affiche normalement.
 */
const boot = `(function(r){r.classList.add('js');setTimeout(function(){if(!r.classList.contains('motion-ready'))r.classList.remove('js')},3000)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${GeistSans.variable} ${GeistMono.variable} ${anybody.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <Universe />
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
