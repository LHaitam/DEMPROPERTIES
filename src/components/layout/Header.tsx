import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
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

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[60] px-6 lg:px-12 py-5 transition-all duration-500
        ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-stone-100 py-4" : "bg-transparent py-6"}`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* LOGO (Retour Style Original Amélioré) */}
          <a href="/" className="flex items-center gap-5 group z-[70]">
            <div className={`border border-[#A47C3B]/60 flex items-center justify-center transition-all duration-500 group-hover:border-[#A47C3B]
              ${isScrolled ? "w-11 h-11" : "w-14 h-14"}`}>
              <img src="/logo.webp" alt="Logo" className="w-7 h-7 object-contain" />
            </div>

            <div className="leading-tight">
              <span className="block font-oswald uppercase tracking-[0.3em] text-[11px] text-stone-500/80">
                DEM
              </span>
              <span className={`block font-oswald uppercase tracking-[0.15em] transition-all duration-500 bg-clip-text text-transparent bg-gradient-to-r from-[#A47C3B] via-[#CFA670] to-[#8C6A30] font-medium
                ${isScrolled ? "text-lg" : "text-xl md:text-2xl"}`}>
                Properties
              </span>
            </div>
          </a>

          {/* RIGHT TOOLS (Lang + Menu) */}
          <div className="flex items-center gap-8 md:gap-12">
            
            {/* Desktop Language Selector (Plus grand et lisible) */}
            <div className="hidden md:flex items-center gap-6">
              {["en", "es"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`font-oswald text-sm tracking-[0.25em] transition-all relative py-1
                    ${i18n.language === lang 
                      ? "text-[#A47C3B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#A47C3B]" 
                      : "text-stone-400 hover:text-stone-800"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-4 text-stone-900"
            >
              <span className="hidden lg:block font-oswald text-[11px] uppercase tracking-[0.4em] text-stone-500 group-hover:text-[#A47C3B] transition-colors">
                {t("nav.menu", "Menu")}
              </span>
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Menu className="w-7 h-7 transition-transform group-hover:scale-110" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-stone-900 text-stone-100 flex flex-col"
          >
            {/* Overlay Close Bar */}
            <div className="flex justify-end p-8 md:p-12">
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="group flex items-center gap-4 p-2"
              >
                <span className="font-oswald text-[10px] uppercase tracking-[0.5em] text-stone-500 group-hover:text-white transition-colors">
                  Close
                </span>
                <X className="w-10 h-10 text-[#A47C3B] group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Main Menu Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.ul
                variants={containerVars}
                initial="hidden"
                animate="show"
                className="space-y-6 md:space-y-12 text-center"
              >
                {menuItems.map((item) => (
                  <motion.li key={item.href} variants={itemVars}>
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group relative inline-block font-oswald uppercase text-5xl md:text-8xl transition-all duration-500 hover:text-[#C5A059]"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#C5A059] transition-all duration-500 group-hover:w-full" />
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Mobile Contact & Lang Footer */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-20 flex flex-col items-center gap-10"
              >
                {/* Language Switcher Mobile (Central et Grand) */}
                <div className="md:hidden flex gap-12 border-y border-white/10 py-6 px-10">
                  {["en", "es"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={`font-oswald text-2xl tracking-[0.3em] transition-all
                        ${i18n.language === lang ? "text-[#C5A059] scale-125" : "text-stone-600"}`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <a 
                  href="tel:+34655623860" 
                  className="flex items-center gap-3 text-[#C5A059] font-oswald text-xl tracking-widest hover:scale-105 transition-transform"
                >
                  <Phone size={20} />
                  +34 655 62 38 60
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