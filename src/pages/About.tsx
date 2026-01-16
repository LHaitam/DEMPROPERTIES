import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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

  /* ---------- SEO — MULTILINGUE ---------- */
  useEffect(() => {
    const lang = i18n.language;

    document.title = t("about.seo.title");

    const metas = [
      {
        name: "description",
        content: t("about.seo.description"),
      },
      {
        name: "keywords",
        content: t("about.seo.keywords"),
      },
      { name: "author", content: "DEM Properties" },
      {
        property: "og:title",
        content: t("about.seo.ogTitle"),
      },
      {
        property: "og:description",
        content: t("about.seo.ogDescription"),
      },
      {
        property: "og:image",
        content: "/og-image-dem-properties.webp",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:locale",
        content: lang === "es" ? "es_ES" : "en_GB",
      },
    ];

    metas.forEach((data) => {
      const meta = document.createElement("meta");
      Object.entries(data).forEach(([k, v]) =>
        meta.setAttribute(k, v)
      );
      document.head.appendChild(meta);
    });

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href =
      lang === "es"
        ? "https://demproperties.es/es/about"
        : "https://demproperties.es/about";
    document.head.appendChild(canonical);

    return () => {
      metas.forEach((data) => {
        const selector = Object.entries(data)
          .map(([k, v]) => `[${k}="${v}"]`)
          .join("");
        document.head.querySelector(selector)?.remove();
      });

      document.head
        .querySelector('link[rel="canonical"]')
        ?.remove();
    };
  }, [i18n.language, t]);
  /* -------------------------------------- */

  return (
    <div className="relative min-h-screen w-full bg-cream text-charcoal overflow-hidden">
      <Header />

      {/* GLOBAL TADELAKT TEXTURE */}
      <div className="fixed inset-0 z-0 opacity-[0.12] pointer-events-none mix-blend-soft-light" />

      {/* SECTIONS */}
      <HeroAgence />
      <FounderStatement />
      <OurApproach />
      <WhyUs />
      <LocalExpertise />
      <BrandSignature />
      <Adventure />
    </div>
  );
}
