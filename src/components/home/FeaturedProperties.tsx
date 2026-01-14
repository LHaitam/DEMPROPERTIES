import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { Property } from "@/types/property";
import { fetchAllProperties } from "@/services/inmovillaApi";
import { mapInmovillaToProperty } from "@/lib/property-mapper";

import PropertyCard from "@/components/property/PropertyCard";
import PropertyPreview from "@/components/property/PropertyPreview";

/* =========================================================
   ANIMATIONS
========================================================= */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeaturedProperties() {
  const { t, i18n } = useTranslation();

  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH DATA
  ========================================================= */
  useEffect(() => {
    let mounted = true;

    const fetchFeatured = async () => {
      setLoading(true);

      try {
        const data = await fetchAllProperties();

        // Sécurité : API doit renvoyer un objet JSON
        if (!data || typeof data !== "object") {
          throw new Error("Invalid API response");
        }

        // Inmovilla : paginacion[0] = meta
        const items = Array.isArray(data.paginacion)
          ? data.paginacion.slice(1)
          : [];

        // Langue Inmovilla
        const lang =
          i18n.language === "es" ? 2 :
          i18n.language === "en" ? 3 :
          2; // fallback ES

        const mapped: Property[] = items
          .map((raw: any) =>
            mapInmovillaToProperty(
              raw,
              data.descripciones ?? {},
              lang
            )
          )
          .filter(Boolean)
          .slice(0, 3);

        if (mounted) {
          setProperties(mapped);
        }
      } catch (error) {
        console.error("FeaturedProperties error:", error);
        if (mounted) {
          setProperties([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatured();

    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  /* =========================================================
     LOADING
  ========================================================= */
  if (loading) {
    return (
      <section className="py-40 flex flex-col items-center justify-center bg-cream">
        <div className="w-8 h-8 border border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="font-playfair italic text-charcoal/40">
          {t("featured.loading")}
        </p>
      </section>
    );
  }

  if (!properties.length) return null;

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <section className="relative py-36 sm:py-44 px-4 sm:px-6 overflow-hidden bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="block font-oswald uppercase tracking-[0.45em] text-gold text-xs mb-6">
            {t("featured.eyebrow")}
          </span>

          <h2 className="font-oswald uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-charcoal leading-[1.05]">
            {t("featured.title")}
          </h2>

          <p className="mt-10 font-playfair italic text-base sm:text-lg text-charcoal/70">
            {t("featured.subtitle")}
          </p>
        </motion.div>

        {/* GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard
                property={property}
                onPreview={() => setSelected(property)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <Link
            to="/properties"
            className="
              inline-block px-14 py-5
              border border-charcoal/15
              text-charcoal font-oswald text-[10px] tracking-[0.3em] uppercase
              hover:bg-charcoal hover:text-cream hover:border-charcoal
              transition-all duration-700
            "
          >
            {t("featured.cta")}
          </Link>
        </motion.div>
      </div>

      {/* QUICK VIEW */}
      <PropertyPreview
        property={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
