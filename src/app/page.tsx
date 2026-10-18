import { Hero, Pillars, Services, Scenarios, Realisations, Method, Trust, Synatrap } from "@/components/Sections";
import { Contact } from "@/components/Contact";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/env";

function jsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: siteUrl,
    areaServed: [
      { "@type": "City", name: site.location.city },
      { "@type": "AdministrativeArea", name: site.location.region },
      { "@type": "Country", name: "France" },
    ],
    serviceType: [
      "Conception d'agents IA sur mesure",
      "Développement d'agents IA",
      "Personnalisation d'agents IA",
    ],
    parentOrganization: {
      "@type": "Organization",
      name: site.group.name,
      ...(site.group.url ? { url: site.group.url } : {}),
    },
    ...(site.contact.email ? { email: site.contact.email } : {}),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <Hero />
      <Pillars />
      <Services />
      <Scenarios />
      <Realisations />
      <Method />
      <Trust />
      <Synatrap />
      <Contact />
    </>
  );
}
