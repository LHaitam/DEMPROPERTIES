import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroAgence: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-4 pt-24 pb-12 bg-cream">

      {/* ================= BACKGROUND SHAPES ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* TOP RIGHT SHAPE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="
            absolute top-[-10%] right-[-10%]
            w-[60vw] h-[75vh]
            bg-sand/25
            rounded-bl-[12rem]
            blur-2xl md:blur-3xl
          "
        />

        {/* BOTTOM LEFT SHAPE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="
            absolute bottom-[-10%] left-[-10%]
            w-[65vw] h-[60vh]
            bg-gold/30
            rounded-tr-[14rem]
            blur-2xl md:blur-3xl
          "
        />
      </div>

      {/* ================= TEXTURE ================= */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.18] md:opacity-[0.25] mix-blend-soft-light" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ===== TITLES ===== */}
          <div className="lg:col-span-12 relative mb-14 lg:mb-28">

            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="
                font-oswald font-bold uppercase tracking-tighter
                leading-[0.85]
                text-charcoal
                text-[clamp(72px,11vw,180px)]
              "
            >
              About
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                font-oswald font-bold uppercase tracking-tighter
                leading-[0.85]
                -mt-[0.15em]

                text-transparent bg-clip-text
                text-[clamp(72px,11vw,180px)]
                bg-gradient-to-r from-[#8A6930] via-[#CFA670] to-[#6F5327]

                text-center lg:text-left
                ml-0 lg:ml-[20vw]
              "
            >
              The Agency
            </motion.h1>
          </div>

          {/* ===== SUBTITLE & CTA ===== */}
          <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-10">

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                font-playfair italic
                text-xl md:text-2xl
                text-charcoal/80
                leading-relaxed
                border-l-2 border-gold
                pl-6
              "
            >
              A boutique real estate agency in Marbella,
              dedicated to discretion, expertise and a deeply
              personal approach to luxury property.
            </motion.p>

            {/* ===== CTA BUTTONS ===== */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* PRIMARY CTA */}
              <button
                onClick={() => (window.location.href = "/properties")}
                className="
                  group relative
                  px-8 py-4
                  bg-charcoal text-cream
                  font-oswald uppercase tracking-widest
                  overflow-hidden
                "
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:gap-5 transition-all">
                  View Properties <ArrowRight className="w-4 h-4" />
                </span>

                <span
                  className="
                    absolute inset-0 scale-x-0
                    group-hover:scale-x-100
                    transition-transform duration-500
                    origin-left
                  "
                  style={{
                    background:
                      "linear-gradient(90deg,#A47C3B,#CFA670,#8C6A30)",
                  }}
                />
              </button>

              {/* SECONDARY CTA */}
              <button
                onClick={() => (window.location.href = "/contact")}
                className="
                  px-8 py-4
                  border border-charcoal
                  text-charcoal
                  font-oswald uppercase tracking-widest
                  transition-colors duration-300
                  hover:bg-charcoal hover:text-cream
                "
              >
                Private Contact
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= SIGNATURE ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-10 hidden md:block"
      >
        <span className="
          font-oswald text-xs uppercase tracking-[0.35em]
          writing-vertical-rl rotate-180
          text-charcoal/40
        ">
          Est. 2019 — Boutique Real Estate in Marbella
        </span>
      </motion.div>
    </section>
  );
};

export default HeroAgence;
