import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async"; // Importación clave

import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import Emotion from "@/components/home/Emotion";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyUs from "@/components/home/WhyUs";
import Adventure from "@/components/common/Adventure";
import Header from "@/components/layout/Header";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  const isES = i18n.language === "es";

  // Control del Loading Screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      /* z-index passé à 9999 pour être au-dessus de tout */
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-[9999]">
        <div className="text-center">
          <h1
            className="font-oswald text-3xl md:text-4xl uppercase tracking-[0.35em]"
            style={{
              color: "#a5694f",
              textShadow: "0 0 14px rgba(207,166,112,0.45)",
            }}
          >
            DEM
          </h1>
          <p className="font-playfair italic text-sm mt-3 text-charcoal/60">
            {t("home.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full overflow-hidden">
      {/* SEO con Helmet: Limpio y dinámico */}
      <Helmet>
        <title>
          {isES
            ? "DEM Properties | Asesoría inmobiliaria en Marbella"
            : "DEM Properties | Real Estate Advisory in Marbella"}
        </title>
        <meta
          name="description"
          content={isES
            ? "Asesoría inmobiliaria en Marbella. Selección de propiedades, oportunidades off-market y representación personalizada."
            : "Real estate advisory based in Marbella. Curated properties, off-market opportunities and bespoke representation."}
        />
        <meta
          name="keywords"
          content={isES
            ? "inmobiliaria Marbella, propiedades, off-market, Costa del Sol, dem properties"
            : "real estate Marbella, properties, off-market properties, Costa del Sol, dem properties"}
        />
        <link rel="canonical" href="https://demproperties.es/" />

        {/* Open Graph (Redes Sociales) */}
        <meta property="og:title" content={isES ? "DEM Properties — Marbella" : "DEM Properties — Marbella"} />
        <meta property="og:url" content="https://demproperties.es/" />
        <meta property="og:image" content="https://demproperties.es/og-image-home.webp" />
        <meta property="og:type" content="website" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "DEM Properties",
              "image": "https://demproperties.es/logo.webp",
              "@id": "https://demproperties.es",
              "url": "https://demproperties.es",
              "telephone": "+34655623860",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Marbella",
                "addressLocality": "Marbella",
                "addressRegion": "Málaga",
                "postalCode": "29600",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 36.51007,
                "longitude": -4.88244
              },
              "sameAs": [
                "https://www.instagram.com/dounia_elmoutii_properties_?igsh=dWtudnlreHlqYXdh"
              ]
            })}
        </script>
      </Helmet>

      <Header />
      <Hero />
      <Statement />
      <Emotion />
      <FeaturedProperties />
      <WhyUs />
      <Adventure />
    </main>
  );
};

export default Home;