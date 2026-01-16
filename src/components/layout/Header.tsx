import React, { useState, useEffect, useCallback } from "react";
import { X, Phone } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, handleKeyDown]);

  const menuItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.properties"), href: "/properties" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  // Variants pour l'overlay de menu
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[60] px-6 lg:px-12 transition-all duration-700 ease-in-out
        ${isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-stone-100 py-3 shadow-sm" 
          : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* LOGO DYNAMIQUE & RAFFINÉ */}
          <motion.a 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            href="/" 
            className="flex items-center gap-4 group z-[70]"
          >
            <div className={`border transition-all duration-700 flex items-center justify-center
              ${isScrolled ? "border-stone-200 w-10 h-10" : "border-white/30 w-14 h-14"}`}>
              <img 
                src="/logo.webp" 
                alt="Logo" 
                className={`object-contain transition-all duration-700 ${isScrolled ? "w-6 h-6" : "w-8 h-8"} ${!isScrolled && "brightness-0 invert"}`} 
              />
            </div>

            <div className="leading-[0.75]">
              <span className={`block font-oswald uppercase tracking-tighter transition-colors duration-700 font-bold
                ${isScrolled ? "text-2xl text-stone-900" : "text-4xl md:text-5xl text-white"}`}>
                DEM
              </span>
              <span className={`block font-oswald uppercase tracking-[0.4em] transition-all duration-700 font-light mt-1
                ${isScrolled 
                  ? "text-[8px] bg-clip-text text-transparent bg-gradient-to-r from-[#A47C3B] to-[#CFA670]" 
                  : "text-[10px] md:text-[12px] text-white/80"}`}>
                Properties
              </span>
            </div>
          </motion.a>

          {/* OUTILS À DROITE */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {["en", "es"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`font-oswald text-xs tracking-[0.3em] transition-all relative py-1
                    ${i18n.language === lang 
                      ? (isScrolled ? "text-[#A47C3B]" : "text-white") 
                      : (isScrolled ? "text-stone-300 hover:text-stone-800" : "text-white/40 hover:text-white")}`}
                >
                  {lang.toUpperCase()}
                  {i18n.language === lang && (
                    <motion.div 
                      layoutId="activeLang" 
                      className={`absolute bottom-0 left-0 w-full h-[1px] ${isScrolled ? "bg-[#A47C3B]" : "bg-white"}`} 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Menu Toggle Minimaliste */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`group flex items-center gap-4 transition-colors duration-700 ${isScrolled ? "text-stone-900" : "text-white"}`}
            >
              <span className={`hidden lg:block font-oswald text-[10px] uppercase tracking-[0.5em] transition-colors
                ${isScrolled ? "text-stone-400 group-hover:text-stone-900" : "text-white/60 group-hover:text-white"}`}>
                {t("nav.menu", "Menu")}
              </span>
              <div className="relative w-8 h-8 flex flex-col items-end justify-center gap-1.5">
                <span className={`h-[1px] transition-all duration-500 ${isScrolled ? "bg-stone-900 w-8" : "bg-white w-8"} group-hover:w-5`} />
                <span className={`h-[1px] transition-all duration-500 ${isScrolled ? "bg-stone-900 w-5" : "bg-white w-5"} group-hover:w-8`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-stone-900 text-stone-100 flex flex-col"
          >
            <div className="flex justify-end p-8 md:p-12">
              <button onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-4 p-2">
                <span className="font-oswald text-[10px] uppercase tracking-[0.5em] text-stone-500 group-hover:text-white">Close</span>
                <X className="w-10 h-10 text-[#CFA670] group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.ul variants={containerVars} initial="hidden" animate="show" className="space-y-6 md:space-y-12 text-center">
                {menuItems.map((item) => (
                  <motion.li key={item.href} variants={itemVars}>
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group relative inline-block font-oswald uppercase text-5xl md:text-8xl transition-all duration-500 hover:text-[#CFA670]"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute bottom-4 left-0 w-0 h-1 bg-[#CFA670] transition-all duration-500 group-hover:w-full" />
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-20 flex flex-col items-center gap-10">
                <div className="md:hidden flex gap-12 border-y border-white/10 py-6 px-10">
                  {["en", "es"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={`font-oswald text-2xl tracking-[0.3em] ${i18n.language === lang ? "text-[#CFA670]" : "text-stone-600"}`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <a href="tel:+34655623860" className="flex items-center gap-3 text-[#CFA670] font-oswald text-xl tracking-widest">
                  <Phone size={20} /> +34 655 62 38 60
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;