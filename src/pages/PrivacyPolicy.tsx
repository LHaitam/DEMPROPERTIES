import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Eye, Lock, FileText, ArrowDown } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  
  // Parallaxe identique au HeroProperties
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, 100]);

  const sections = [
    { icon: <Eye size={24} />, title: t("privacy.sections.collect.title"), content: t("privacy.sections.collect.content") },
    { icon: <FileText size={24} />, title: t("privacy.sections.use.title"), content: t("privacy.sections.use.content") },
    { icon: <Lock size={24} />, title: t("privacy.sections.protect.title"), content: t("privacy.sections.protect.content") },
    { icon: <ShieldCheck size={24} />, title: t("privacy.sections.rights.title"), content: t("privacy.sections.rights.content") }
  ];

  return (
    <div className="bg-[#F5F5F3] min-h-screen w-full">
      {/* ================= HERO SECTION (Strictly HeroProperties Style) ================= */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-4 pt-24 pb-12">
        
        {/* BACKGROUND SHAPES */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[-10%] right-[-10%] w-[60vw] h-[75vh] bg-stone-200/30 rounded-bl-[12rem] blur-2xl md:blur-3xl"
          />
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[-10%] left-[-10%] w-[65vw] h-[60vh] bg-[#a5694f]/10 rounded-tr-[14rem] blur-2xl md:blur-3xl"
          />
        </div>

        {/* GOLD HALO */}
        <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none opacity-60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[980px] h-[85vw] max-h-[980px] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(207,166,112,0.18) 0%, rgba(207,166,112,0.08) 35%, rgba(0,0,0,0) 68%)",
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* TITLES (Identique Collection) */}
            <div className="lg:col-span-12 relative mb-14 lg:mb-28 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-oswald font-bold uppercase tracking-tighter leading-[0.85] text-stone-900 text-[clamp(72px,11vw,180px)]"
              >
                {t("privacy.hero.title1")}
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="font-oswald font-bold uppercase tracking-tighter text-transparent bg-clip-text leading-[0.85] text-[clamp(72px,11vw,180px)] bg-gradient-to-r from-[#9B7440] via-[#a5694f] to-[#7A4F2A] lg:ml-[20vw]"
              >
                {t("privacy.hero.title2")}
              </motion.h1>
            </div>

            {/* SUBTITLE */}
            <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-playfair text-xl md:text-2xl text-stone-800/80 leading-relaxed italic border-l-2 border-[#a5694f] pl-6"
              >
                {t("privacy.hero.quote")}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.8 }}
                className="flex items-center gap-4 text-[#a5694f] font-oswald uppercase tracking-widest text-xs"
              >
                <div className="w-12 h-[1px] bg-[#a5694f]" />
                {t("privacy.hero.scroll")}
                <ArrowDown size={14} className="animate-bounce" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* SIGNATURE DYNAMIQUE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-10 hidden md:block"
        >
          <span className="font-oswald text-xs uppercase tracking-[0.35em] [writing-mode:vertical-rl] rotate-180 text-stone-900/40">
            {t('hero.signature')}
          </span>
        </motion.div>
      </section>

      {/* ================= DETAILS SECTION ================= */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
               <h4 className="font-oswald uppercase tracking-widest text-xs text-[#a5694f] mb-4">{t("privacy.sidebar.updated")}</h4>
               <p className="font-sans text-stone-500 text-sm mb-12">
                 {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
               </p>
               <div className="p-8 bg-stone-900 text-stone-50 rounded-2xl shadow-xl">
                  <h3 className="font-playfair italic text-2xl mb-4">{t("privacy.sidebar.contactTitle")}</h3>
                  <p className="font-sans text-stone-400 text-sm leading-relaxed mb-6">
                    {t("privacy.sidebar.contactDesc")}
                  </p>
                  <a href="mailto:d.elmoutii@demproperties.es" className="font-oswald uppercase tracking-wider text-[#a5694f] hover:text-white transition-colors">
                    d.elmoutii@demproperties.es
                  </a>
               </div>
            </div>

            <div className="lg:col-span-8 space-y-24">
              {sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#a5694f] shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      {section.icon}
                    </div>
                    <h3 className="font-oswald uppercase tracking-[0.2em] text-xl text-stone-900">
                      {section.title}
                    </h3>
                  </div>
                  <p className="font-playfair text-lg md:text-xl text-stone-600 leading-relaxed pl-20">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;