import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  const menuItems = [
    { label: t("nav.home", "Home"), href: "/" },
    { label: t("nav.properties", "Properties"), href: "/properties" },
    { label: t("nav.about", "About"), href: "/about" },
    { label: t("nav.contact", "Contact"), href: "/contact" },
  ];

  const LanguageSelector = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex items-center ${mobile ? "gap-8" : "gap-6"}`}>
      {["en", "es"].map((lang) => (
        <button
          key={lang}
          onClick={() => {
            i18n.changeLanguage(lang);
            if (mobile) setIsMenuOpen(false);
          }}
          className={`font-oswald tracking-[0.3em] transition-colors py-1 ${
            mobile ? "text-sm" : "text-xs"
          } ${
            i18n.language === lang
              ? mobile ? "text-[#CFA670]" : (isScrolled ? "text-[#A47C3B]" : "text-white")
              : mobile ? "text-stone-500 hover:text-white" : (isScrolled ? "text-stone-300 hover:text-stone-800" : "text-white/40 hover:text-white")
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[60] px-6 lg:px-12 transition-all duration-500 ease-out 
        ${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-stone-100 py-3 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* LOGO BRAND */}
          <Link to="/" className="flex items-center gap-4 group z-[70]">
            <div className={`border transition-all duration-500 flex items-center justify-center
              ${isScrolled ? "border-stone-200 w-10 h-10" : "border-white/30 w-14 h-14"}`}>
              <img 
                src="/logo.webp" 
                alt="Logo" 
                className={`object-contain transition-all duration-500 ${isScrolled ? "w-6 h-6" : "w-8 h-8"} 
                ${(!isScrolled && isHome) ? "brightness-0 invert" : ""}`} 
              />
            </div>
            <div className="leading-[0.75]">
              <span className={`block font-oswald uppercase tracking-tighter transition-colors duration-500 font-bold
                ${isScrolled ? "text-2xl text-stone-900" : "text-4xl md:text-5xl text-white"}`}>
                DEM
              </span>
              <span className={`block font-oswald uppercase tracking-[0.4em] transition-all duration-500 font-light mt-1
                ${isScrolled ? "text-[8px] bg-clip-text text-transparent bg-gradient-to-r from-[#A47C3B] to-[#CFA670]" : "text-[10px] md:text-[12px] text-white/80"}`}>
                Properties
              </span>
            </div>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-8">
            {/* Langues Desktop */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            <button onClick={() => setIsMenuOpen(true)} className={`group flex items-center gap-4 ${isScrolled ? "text-stone-900" : "text-white"}`}>
              <span className="hidden lg:block font-oswald text-[10px] uppercase tracking-[0.5em] opacity-60">Menu</span>
              <div className="relative w-8 h-8 flex flex-col items-end justify-center gap-1.5">
                <span className={`h-[1px] transition-all duration-300 ${isScrolled ? "bg-stone-900 w-8" : "bg-white w-8"} group-hover:w-5`} />
                <span className={`h-[1px] transition-all duration-300 ${isScrolled ? "bg-stone-900 w-5" : "bg-white w-5"} group-hover:w-8`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900 text-stone-100 flex flex-col"
          >
            {/* Header Overlay: Langues Mobile + Close */}
            <div className="flex justify-between items-center p-8 md:p-12">
              <LanguageSelector mobile />
              
              <button onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-4 p-2">
                <span className="font-oswald text-[10px] uppercase tracking-[0.5em] text-stone-500 group-hover:text-white transition-colors">Close</span>
                <X className="w-10 h-10 text-[#CFA670] group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <ul className="space-y-6 md:space-y-10 text-center">
                {menuItems.map((item, idx) => (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group relative inline-block font-oswald uppercase text-5xl md:text-7xl transition-all duration-500 hover:text-[#CFA670]"
                    >
                      {item.label}
                      <span className="absolute bottom-2 left-0 w-0 h-[1px] bg-[#CFA670] transition-all duration-500 group-hover:w-full" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-20 flex flex-col items-center gap-6">
                <a href="tel:+34655623860" className="flex items-center gap-3 text-[#CFA670] font-oswald text-xl tracking-widest hover:text-white transition-colors">
                  <Phone size={20} /> +34 655 62 38 60
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;