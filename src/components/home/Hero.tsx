import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const videoId = "5bAtqoKGz1E";

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-4 pt-24 pb-12">
      {/* ======================
          BG VIDEO (OPTIMIZED OBJECT-COVER)
      ====================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* On crée un conteneur 20% plus grand pour masquer les bords de l'iframe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   /* Mobile : Très large pour remplir la hauteur sans bandes */
                   w-[450vw] h-[120vh] 
                   /* Desktop : Ratio 16:9 avec marge de sécurité pour le crop */
                   md:w-[200vh] md:h-[115vw]
                   min-w-full min-h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${videoId}&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
          />
        </div>

        {/* Overlays pour masquer le flash initial et améliorer le contraste */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-[1]" />
      </div>

      {/* GOLD HALO SHAPES */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[75vh] bg-[#CFA670]/18 rounded-bl-[12rem] blur-2xl md:blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[-10%] left-[-10%] w-[65vw] h-[60vh] bg-[#C5A059]/14 rounded-tr-[14rem] blur-2xl md:blur-3xl"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12 relative mb-14 lg:mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-oswald font-bold uppercase tracking-tighter leading-[0.85] text-white text-[clamp(60px,11vw,180px)] drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
            >
              DEM
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-oswald font-bold uppercase tracking-tighter text-transparent bg-clip-text leading-[0.85] text-[clamp(60px,11vw,180px)] bg-gradient-to-r from-[#8A6930] via-[#CFA670] to-[#6F5327] lg:pl-[20vw] drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
            >
              {t("hero.brand")}
            </motion.h1>
          </div>

          <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-playfair text-xl md:text-2xl text-white/80 leading-relaxed italic border-l-2 border-[#C5A059]/60 pl-6"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => (window.location.href = "/properties")}
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white font-oswald uppercase tracking-widest overflow-hidden border border-white/15 hover:border-[#C5A059]/60 transition-colors"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:gap-5 transition-all">
                  {t("hero.ctaProperties")} <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-[#A47C3B] via-[#CFA670] to-[#8C6A30] opacity-55" />
              </button>

              <button
                onClick={() => (window.location.href = "/contact")}
                className="px-8 py-4 border border-white/25 text-white font-oswald uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                {t("hero.ctaContact")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-10 hidden md:block z-10"
      >
        <span className="font-oswald text-xs uppercase tracking-[0.35em] writing-vertical-rl rotate-180 text-white/35">
          {t("hero.signature")}
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;