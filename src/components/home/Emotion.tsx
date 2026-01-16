import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Emotion: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-36 px-6 overflow-hidden">

      {/* BACKGROUND TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-soft-light"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

        {/* ================= TEXT ================= */}
        <div className="lg:col-span-7">

          {/* EYEBROW */}
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="
              block font-oswald text-sm uppercase tracking-[0.34em]
              text-charcoal mb-10
            "
          >
            {t("emotion.eyebrow")}
          </motion.span>

          {/* QUOTE */}
          <motion.blockquote
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="flex items-start gap-6 mb-8">
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="text-gold text-7xl md:text-8xl font-oswald leading-none"
              >
                “
              </motion.span>

              <p
                className="
                  font-playfair text-2xl md:text-3xl lg:text-[2.6rem]
                  leading-[1.35] text-charcoal/90
                "
              >
                {t("emotion.quote")}
              </p>
            </div>

            {/* AUTHOR */}
            <footer className="pl-7 border-l border-gold/40">
              <span className="block font-oswald uppercase tracking-wide text-charcoal">
                Dounia El Moutii
              </span>
              <span className="block text-sm text-charcoal/60 tracking-wide mt-1">
                {t("emotion.role")}
              </span>
            </footer>
          </motion.blockquote>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">

          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="
              relative w-[300px] h-[420px]
              sm:w-[340px] sm:h-[480px]
              lg:w-[380px] lg:h-[520px]
              rounded-2xl overflow-hidden
              shadow-2xl z-10
            "
          >
            <img
              src="/img.jpeg"
              alt={t("emotion.imageAlt")}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            <div
              className="absolute inset-0 bg-gold/15 mix-blend-overlay"
              aria-hidden="true"
            />
          </motion.div>

          {/* SUBTLE SHAPE */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="
              absolute -right-6 -top-6
              w-48 h-48
              rounded-full
              border border-gold/35
              z-0
            "
            aria-hidden="true"
          />

          {/* ACCENT DOT */}
          <motion.div
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity }}
            className="
              absolute right-20 top-20
              w-2 h-2
              bg-gold rounded-full
              shadow-[0_0_10px_#a5694f]
            "
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default Emotion;
