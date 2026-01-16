import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  /* -------------------------------------------
      SEO — Multilangue
  ------------------------------------------- */
  useEffect(() => {
    const isES = i18n.language === "es";

    document.title = isES
      ? "DEM Properties | Asesoría inmobiliaria en Marbella"
      : "DEM Properties | Real Estate Advisory in Marbella";

    const metas = [
      {
        name: "description",
        content: isES
          ? "DEM Properties es una asesoría inmobiliaria en Marbella, ofreciendo propiedades seleccionadas, oportunidades off-market y representación personalizada."
          : "DEM Properties is a real estate advisory based in Marbella, offering curated properties, off-market opportunities and bespoke client representation.",
      },
      {
        name: "keywords",
        content: isES
          ? "inmobiliaria Marbella, propiedades Marbella, off-market, Golden Mile, Nueva Andalucía, DEM Properties"
          : "real estate Marbella, properties Marbella, off-market properties, Golden Mile, Nueva Andalucia, DEM Properties",
      },
      { name: "author", content: "DEM Properties" },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: isES
          ? "DEM Properties — Asesoría inmobiliaria en Marbella"
          : "DEM Properties — Real Estate Advisory in Marbella",
      },
      {
        property: "og:description",
        content: isES
          ? "Propiedades cuidadosamente seleccionadas en Marbella. Discreción, experiencia y un enfoque personalizado."
          : "Carefully curated properties in Marbella. Discretion, expertise and a personalised real estate approach.",
      },
      { property: "og:image", content: "/og-image-home.webp" },
      { property: "og:type", content: "website" },
    ];

    metas.forEach((entry) => {
      const meta = document.createElement("meta");
      Object.entries(entry).forEach(([key, value]) =>
        meta.setAttribute(key, value)
      );
      document.head.appendChild(meta);
    });

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://demproperties.es/";
    document.head.appendChild(canonical);

    return () => {
      metas.forEach((entry) => {
        const selector = Object.entries(entry)
          .map(([k, v]) => `[${k}="${v}"]`)
          .join("");
        document.head.querySelector(selector)?.remove();
      });

      document.head.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [i18n.language]);

  /* -------------------------------------------
      LOADING SCREEN
  ------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
        <div className="text-center">
          <h1
            className="font-oswald text-3xl md:text-4xl uppercase tracking-[0.35em]"
            style={{
              color: "#CFA670",
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

  /* -------------------------------------------
      PAGE CONTENT
  ------------------------------------------- */
  return (
    <main className="w-full overflow-hidden">
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
