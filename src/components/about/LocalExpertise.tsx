import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const easePremium = [0.22, 1, 0.36, 1] as const;

export const LocalExpertise: React.FC = () => {
  const { t } = useTranslation();

  const locations = t("localExpertise.locations", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="relative py-36 sm:py-44 px-4 sm:px-6 bg-cream overflow-hidden">
      {/* SUBTLE TEXTURE */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-soft-light" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* OVERLINE */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easePremium }}
          viewport={{ once: true }}
          className="
            block font-oswald uppercase tracking-[0.45em]
            text-gold text-[10px] sm:text-xs mb-8
          "
        >
          {t("localExpertise.eyebrow")}
        </motion.span>

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: easePremium }}
          viewport={{ once: true }}
          className="
            font-oswald uppercase tracking-tight
            text-4xl sm:text-5xl md:text-6xl
            text-charcoal mb-10
          "
        >
          {t("localExpertise.title")}
        </motion.h2>

        {/* TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: easePremium }}
          viewport={{ once: true }}
          className="
            font-playfair
            text-base sm:text-lg md:text-xl
            leading-relaxed
            text-charcoal/70
            max-w-3xl mx-auto
          "
        >
          {t("localExpertise.text")}
        </motion.p>

        {/* LOCATIONS */}
        <div
          className="
            mt-16
            flex flex-wrap justify-center gap-x-10 gap-y-4
            font-oswald uppercase tracking-[0.35em]
            text-xs text-charcoal/60
          "
        >
          {locations.map((label, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.45 + i * 0.08,
                ease: easePremium,
              }}
              viewport={{ once: true }}
              className="relative"
            >
              {label}
              {i < locations.length - 1 && (
                <span className="mx-6 text-gold/40">•</span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalExpertise;
