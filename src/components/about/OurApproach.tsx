import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const easePremium = [0.22, 1, 0.36, 1] as const;

export const OurApproach: React.FC = () => {
  const { t } = useTranslation();

  const items = t("ourApproach.items", {
    returnObjects: true,
  }) as { title: string; text: string }[];

  return (
    <section className="relative py-40 px-6 bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easePremium }}
          viewport={{ once: true }}
          className="max-w-3xl mb-28"
        >
          <span
            className="
              block font-oswald uppercase
              tracking-[0.45em]
              text-xs text-gold
              mb-8
            "
          >
            {t("ourApproach.eyebrow")}
          </span>

          <h2
            className="
              font-oswald uppercase
              text-5xl md:text-6xl
              leading-[1.08]
            "
          >
            {t("ourApproach.title.line1")}
            <br />
            {t("ourApproach.title.line2")}
          </h2>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: easePremium,
              }}
              viewport={{ once: true }}
              className="
                relative
                pt-14
                border-t border-cream/15
              "
            >
              {/* INDEX */}
              <span
                className="
                  absolute -top-6 left-0
                  font-oswald text-xs
                  tracking-[0.4em]
                  text-cream/40
                "
              >
                0{i + 1}
              </span>

              {/* TITLE */}
              <h3
                className="
                  font-oswald uppercase
                  text-lg md:text-xl
                  tracking-wide
                  mb-6
                "
              >
                {item.title}
              </h3>

              {/* TEXT */}
              <p
                className="
                  font-playfair
                  text-cream/65
                  leading-relaxed
                  max-w-sm
                "
              >
                {item.text}
              </p>

              {/* ACCENT LINE */}
              <span
                className="
                  absolute left-0 bottom-[-12px]
                  h-[1px] w-8
                  bg-gold/50
                "
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurApproach;
