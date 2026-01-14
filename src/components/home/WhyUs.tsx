import React from "react";
import { motion, type Variants } from "framer-motion";
import { Gem, Compass, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyUs: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: Gem,
      title: t("whyUs.items.curated.title"),
      text: t("whyUs.items.curated.text"),
    },
    {
      icon: Compass,
      title: t("whyUs.items.tailored.title"),
      text: t("whyUs.items.tailored.text"),
    },
    {
      icon: Shield,
      title: t("whyUs.items.local.title"),
      text: t("whyUs.items.local.text"),
    },
  ];

  /* ================= ANIMATIONS ================= */
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const cardVariants: Variants = {
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

  return (
    <section className="relative py-36 sm:py-44 px-4 sm:px-6 overflow-hidden bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="block font-oswald uppercase tracking-[0.45em] text-gold text-xs mb-6">
            {t("whyUs.eyebrow")}
          </span>

          <h2 className="font-oswald uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-charcoal leading-[1.05]">
            {t("whyUs.title.line1")}
            <br className="hidden sm:block" />
            {t("whyUs.title.line2")}
          </h2>

          <p className="mt-10 font-playfair italic text-base sm:text-lg text-charcoal/70">
            {t("whyUs.subtitle")}
          </p>
        </motion.div>

        {/* ================= GRID ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-14"
        >
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={index}
                variants={cardVariants}
                className="
                  group relative
                  px-10 py-14
                  rounded-[2.5rem]
                  bg-cream
                  border border-charcoal/10
                  transition-all duration-700
                  hover:-translate-y-2
                  hover:shadow-[0_40px_90px_rgba(0,0,0,0.12)]
                "
              >
                {/* INDEX */}
                <span
                  className="
                    absolute top-8 right-8
                    font-oswald
                    text-[4rem]
                    leading-none
                    text-charcoal/5
                    pointer-events-none
                  "
                >
                  0{index + 1}
                </span>

                {/* GOLD LINE */}
                <span className="block w-16 h-px mb-12 bg-gold transition-all duration-500 group-hover:w-24" />

                {/* ICON */}
                <div
                  className="
                    w-16 h-16 mb-10
                    flex items-center justify-center
                    rounded-full
                    border border-gold/40
                    transition-all duration-500
                    group-hover:scale-105
                    group-hover:border-gold
                  "
                >
                  <Icon className="w-6 h-6 text-gold" />
                </div>

                {/* CONTENT */}
                <h3 className="font-oswald uppercase text-xl text-charcoal mb-6">
                  {item.title}
                </h3>

                <p className="text-charcoal/70 leading-relaxed text-sm sm:text-base">
                  {item.text}
                </p>

                {/* HOVER LIGHT */}
                <div
                  className="
                    absolute inset-0
                    rounded-[2.5rem]
                    bg-gradient-to-br
                    from-gold/10
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-700
                    pointer-events-none
                  "
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
