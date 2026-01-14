import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

type HeroPropertiesProps = {
  onExploreClick?: () => void;
};

export const HeroProperties: React.FC<HeroPropertiesProps> = ({
  onExploreClick,
}) => {
  return (
    <section
      aria-label="Luxury properties hero"
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-4 pt-24 pb-12"
    >
      {/* ================= BACKGROUND SHAPES ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2.4,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute bottom-[-10%] left-[-10%]
            w-[65vw] h-[60vh]
            bg-terracotta/25
            rounded-tr-[14rem]
            blur-2xl md:blur-3xl
          "
        />
      </div>

      {/* ================= TEXTURE ================= */}
      <div
        className="
          absolute inset-0 z-[1]
          pointer-events-none
          opacity-[0.18] md:opacity-[0.25]
          mix-blend-soft-light
        "
        style={{
          backgroundImage: `url("/tadelakt.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ================= GOLD HALO ================= */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none opacity-60"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.6,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute left-1/2 top-[55%]
            -translate-x-1/2 -translate-y-1/2
            w-[85vw] max-w-[980px]
            h-[85vw] max-h-[980px]
            rounded-full blur-3xl
          "
          style={{
            background:
              "radial-gradient(circle, rgba(207,166,112,0.18) 0%, rgba(207,166,112,0.08) 35%, rgba(0,0,0,0) 68%)",
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* TITLES */}
          <div className="lg:col-span-12 relative mb-14 lg:mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="
                font-oswald font-bold uppercase tracking-tighter
                leading-[0.85] text-charcoal
                text-[clamp(72px,11vw,180px)]
              "
            >
              Luxury
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
                text-transparent bg-clip-text
                leading-[0.85]
                text-[clamp(72px,11vw,180px)]
                bg-gradient-to-r from-[#8A6930] via-[#CFA670] to-[#6F5327]
                text-center lg:text-left
                ml-0 lg:ml-[20vw]
              "
            >
              Properties
            </motion.h1>
          </div>

          {/* SUBTITLE & CTA */}
          <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.85,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                font-playfair text-xl md:text-2xl
                text-charcoal/80 leading-relaxed italic
                border-l-2 border-gold pl-6
              "
            >
              Curated listings in Marbella — from the Golden Mile to Nueva
              Andalucía — selected for architecture, address and long-term value.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.05,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onExploreClick}
                className="
                  group relative px-8 py-4
                  bg-charcoal text-cream
                  font-oswald uppercase tracking-widest
                  overflow-hidden
                "
              >
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
                  Explore listings <ArrowRight className="w-4 h-4" />
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

              <button
                onClick={onExploreClick}
                className="
                  px-8 py-4
                  border border-charcoal
                  text-charcoal
                  font-oswald uppercase tracking-widest
                  hover:bg-charcoal hover:text-cream
                  transition-colors duration-300
                  flex items-center justify-center gap-2
                "
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
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
        <span className="font-oswald text-xs uppercase tracking-[0.35em] writing-vertical-rl rotate-180 text-charcoal/40">
          Fine Real Estate — Marbella
        </span>
      </motion.div>
    </section>
  );
};
