import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Adventure: React.FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <section className="relative py-36 md:py-44 px-6 text-center overflow-hidden bg-cream">

      {/* ===== BACKGROUND TEXTURE ===== */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
      />

      {/* ===== GIANT MONOGRAM ===== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-oswald font-bold uppercase text-charcoal/5"
          style={{
            fontSize: "clamp(140px, 38vw, 540px)",
          }}
        >
          DEM
        </span>
      </div>

      {/* ===== CONTENT ===== */}
      <motion.div
        initial={
          reduceMotion || isMobile
            ? { opacity: 0 }
            : { opacity: 0, y: 40 }
        }
        whileInView={
          reduceMotion || isMobile
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: isMobile ? 0.5 : 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        {/* EYEBROW */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="
            block font-oswald uppercase tracking-[0.45em]
            text-charcoal/60 text-xs mb-6
          "
        >
          {t("adventure.eyebrow")}
        </motion.span>

        {/* SMALL TITLE */}
        <h2
          className="
            font-oswald text-3xl md:text-5xl
            uppercase font-bold tracking-tight
            text-charcoal mb-6
          "
        >
          {t("adventure.smallTitle")}
        </h2>

        {/* MAIN TITLE */}
        <h3
          className="
            font-oswald text-6xl md:text-9xl
            uppercase font-bold tracking-tight mb-16
            bg-clip-text text-transparent
          "
          style={{
            backgroundImage:
              "linear-gradient(90deg, #A47C3B 0%, #a5694f 50%, #8C6A30 100%)",
          }}
        >
          {t("adventure.mainTitle")}
        </h3>

        {/* CTA */}
        <motion.a
          href="/contact"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="
            group relative inline-flex items-center gap-4
            px-12 py-5
            font-oswald uppercase tracking-widest
            text-base md:text-lg
            text-cream bg-charcoal
            overflow-hidden
            shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          "
        >
          <span className="relative z-10">
            {t("adventure.cta")}
          </span>

          <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />

          {/* GOLD REVEAL */}
          <span
            className="
              absolute inset-0
              scale-x-0 group-hover:scale-x-100
              origin-left transition-transform duration-500 ease-out
            "
            style={{
              background:
                "linear-gradient(90deg, #A47C3B 0%, #a5694f 50%, #8C6A30 100%)",
            }}
          />

          {/* SUBTLE GLOW */}
          <span
            className="
              absolute -inset-px
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              bg-gradient-to-r from-gold/30 via-transparent to-gold/30
              pointer-events-none
            "
          />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Adventure;
