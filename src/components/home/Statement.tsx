import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Statement: React.FC = () => {
  const { t } = useTranslation();

  const text = t("statement.text");

  return (
    <section className="relative py-16 bg-charcoal text-cream border-y border-gold/20 overflow-hidden">
      <div className="relative overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-14 marquee-track"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 65,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <h2
                className="
                  font-oswald text-3xl md:text-5xl uppercase font-bold tracking-tight
                  text-transparent stroke-text
                  opacity-60 hover:opacity-100
                  transition-all duration-500
                  whitespace-nowrap
                "
              >
                {text}
              </h2>

              {/* GOLD MARK */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-gold/40 blur-sm" />
                <div className="w-2.5 h-2.5 bg-gold rotate-45 shadow-[0_0_12px_#a5694faa]" />
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* LOCAL STYLES */}
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(244, 237, 227, 0.6);
        }

        .stroke-text:hover {
          -webkit-text-stroke: 1px #a5694f;
          color: #a5694f;
          text-shadow: 0 0 20px rgba(207, 166, 112, 0.25);
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Statement;
