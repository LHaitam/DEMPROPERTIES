import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Components
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyPreview } from "@/components/property/PropertyPreview";

// Hooks & Types
import { useProperties } from "@/hooks/useProperties";
import type { Property } from "@/hooks/useProperties";

const FeaturedProperties: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { properties, loading } = useProperties(i18n.language);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const lastThreeProperties = properties.slice(0, 3);

  const handlePreview = (property: Property) => {
    setSelectedProperty(property);
    setIsPreviewOpen(true);
  };

  return (
    <section className="relative py-36 sm:py-44 px-4 sm:px-6 overflow-hidden bg-cream">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION - STYLE CENTRÉ LUXE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="block font-oswald uppercase tracking-[0.45em] text-[#C5A059] text-[10px] mb-6">
            {t("featured.eyebrow", "Sélection Exclusive")}
          </span>

          <h2 className="font-oswald uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-stone-900 leading-[1.05]">
            {t("featured.title", "Dernières Opportunités")}
          </h2>

          <p className="mt-10 font-playfair italic text-base sm:text-lg text-stone-500/70">
            {t("featured.subtitle", "Une collection de propriétés d'exception sélectionnées pour leur caractère unique.")}
          </p>
        </motion.div>

        {/* GRID SECTION */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {lastThreeProperties.map((property, index) => (
              <motion.div
                key={property.cod_ofer}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <PropertyCard 
                  property={property} 
                  onPreview={handlePreview} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* BOTTOM CTA - STYLE "MODERN LEGACY" */}
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
              border border-stone-900/15
              text-stone-900 font-oswald text-[10px] tracking-[0.3em] uppercase
              hover:bg-stone-900 hover:text-white hover:border-stone-900
              transition-all duration-700
            "
          >
            {t("featured.cta", "Voir tout le catalogue")}
          </Link>
        </motion.div>
      </div>

      {/* MODAL PREVIEW */}
      <AnimatePresence>
        {isPreviewOpen && selectedProperty && (
          <PropertyPreview 
            property={selectedProperty} 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)}
            lang={i18n.language}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedProperties;