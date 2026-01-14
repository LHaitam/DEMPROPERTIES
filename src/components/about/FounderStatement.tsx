import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const FounderStatement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 px-6 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">

        {/* TEXT 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <span className="font-oswald uppercase tracking-[0.3em] text-xs text-gold block mb-6">
            {t("founder.eyebrow")}
          </span>

          <blockquote className="font-playfair italic text-2xl md:text-3xl text-charcoal/90 leading-relaxed mb-10">
            “{t("founder.quote")}”
          </blockquote>

          <p className="font-oswald uppercase tracking-widest text-sm text-charcoal">
            {t("founder.name")}
          </p>
          <p className="font-playfair italic text-charcoal/70">
            {t("founder.title")}
          </p>
        </motion.div>

        {/* VISUAL 1/3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full h-[420px]"
        >
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl" />
          <img
            src="/img.jpeg"
            alt={t("founder.imageAlt")}
            className="relative z-10 w-full h-full object-cover rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
