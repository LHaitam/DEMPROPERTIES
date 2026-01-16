import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import HeroAgence from "@/components/about/HeroAgence";
import { FounderStatement } from "@/components/about/FounderStatement";
import OurApproach from "@/components/about/OurApproach";
import WhyUs from "@/components/home/WhyUs";
import LocalExpertise from "@/components/about/LocalExpertise";
import BrandSignature from "@/components/about/BrandSignature";
import Adventure from "@/components/common/Adventure";
import Header from "@/components/layout/Header";

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isES = lang === "es";

  return (
    <div className="relative min-h-screen w-full bg-cream text-charcoal overflow-hidden">
      {/* SEO DYNAMIQUE AVEC HELMET */}
      <Helmet>
        <title>{t("about.seo.title")}</title>
        <meta name="description" content={t("about.seo.description")} />
        <meta name="keywords" content={t("about.seo.keywords")} />
        <meta name="author" content="DEM Properties" />
        
        {/* Open Graph (Réseaux Sociaux) */}
        <meta property="og:title" content={t("about.seo.ogTitle")} />
        <meta property="og:description" content={t("about.seo.ogDescription")} />
        <meta property="og:image" content="https://demproperties.es/og-image-about.webp" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://demproperties.es/about" />
        <meta property="og:locale" content={isES ? "es_ES" : "en_GB"} />

        {/* Canonical Link */}
        <link rel="canonical" href="https://demproperties.es/about" />

        {/* Données Structurées AboutPage & Person (Fondateur) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Person",
              "name": "D. El Moutii",
              "jobTitle": "Founder & Real Estate Advisor",
              "worksFor": {
                "@type": "RealEstateAgent",
                "name": "DEM Properties"
              },
              "description": isES 
                ? "Asesor inmobiliario experto en el mercado de lujo de Marbella." 
                : "Expert real estate advisor in the Marbella luxury market."
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Texture de fond subtile */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('/assets/textures/grain.png')]" />

      <main className="relative z-10">
        <HeroAgence />
        
        {/* Section Identité & Vision */}
        <FounderStatement />
        
        {/* Section Méthodologie */}
        <OurApproach />
        
        {/* Réutilisation des arguments de vente de la Home */}
        <WhyUs />
        
        {/* Focus sur Marbella */}
        <LocalExpertise />
        
        {/* Signature Visuelle de la Marque */}
        <BrandSignature />
        
        {/* Appel à l'action final */}
        <Adventure />
      </main>
    </div>
  );
}