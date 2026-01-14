import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Property } from "@/types/property";

interface Props {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyPreview({ property, isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  useEffect(() => { if (isOpen) setIndex(0); }, [isOpen, property]);

  if (!isOpen || !property) return null;

  const images = property.images?.length > 0 ? property.images : [property.mainImage];

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-12 xl:p-20"
      >
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-stone-950/98 backdrop-blur-md" onClick={onClose} />

        {/* MODAL CONTAINER */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[100dvh] md:h-auto md:max-h-[90vh] max-w-[1440px] bg-white flex flex-col lg:flex-row overflow-hidden shadow-2xl"
        >
          {/* ================= LEFT — GALLERY (RESIZABLE) ================= */}
          <div className="relative h-[45vh] lg:h-auto lg:flex-[1.8] bg-black overflow-hidden shrink-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={images[index]}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x800?text=Property"; }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* View details - Hidden on very small screens, visible otherwise */}
            <Link
              to={`/properties/${property.id}`}
              onClick={onClose}
              className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-3
                         bg-white/10 backdrop-blur-md border border-white/20
                         px-4 py-2 md:px-6 md:py-3 text-white font-oswald text-[8px] md:text-[9px]
                         uppercase tracking-[0.3em] hover:bg-[#A47C3B] hover:border-[#A47C3B]
                         transition-all"
            >
              <Maximize2 size={12} />
              <span className="hidden sm:inline">{t("propertyPreview.viewDetails")}</span>
            </Link>

            {/* Close mobile (Visible only on small screens) */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white lg:hidden z-50"
            >
              <X size={20} />
            </button>

            {/* Navigation Controls */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex items-center gap-4 md:gap-8 z-20">
                <div className="flex gap-1">
                  <NavButton onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}>
                    <ChevronLeft size={18} />
                  </NavButton>
                  <NavButton onClick={() => setIndex((i) => (i + 1) % images.length)}>
                    <ChevronRight size={18} />
                  </NavButton>
                </div>
                <div className="font-oswald text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/70 bg-black/20 px-3 py-1 backdrop-blur-sm">
                  {index + 1} / {images.length}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT — CONTENT (SCROLLABLE ON MOBILE) ================= */}
          <aside className="flex-1 flex flex-col bg-white overflow-y-auto lg:overflow-visible relative">
            {/* Close desktop */}
            <button
              onClick={onClose}
              className="absolute top-10 right-10 text-stone-200 hover:text-[#A47C3B] transition-all hidden lg:block z-50"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <div className="flex-1 px-8 py-10 md:px-12 md:py-16 lg:px-16 flex flex-col justify-center">
              <div className="space-y-8 md:space-y-12 lg:space-y-14">
                <header className="space-y-4 md:space-y-6">
                  <span className="inline-block font-oswald text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-[#A47C3B]">
                    {property.propertyType} <span className="mx-2 opacity-20">|</span> {property.reference}
                  </span>

                  <h2 className="text-3xl md:text-4xl xl:text-5xl font-oswald uppercase leading-[1.1] text-stone-900 tracking-tight">
                    {property.title}
                  </h2>

                  <div className="flex items-center gap-2 text-stone-400 font-playfair italic text-base md:text-lg">
                    <MapPin size={16} className="text-[#A47C3B] shrink-0" />
                    {property.location}
                  </div>
                </header>

                {/* Specs - Adaptive Grid */}
                <div className="grid grid-cols-3 gap-4 md:gap-10 border-y border-stone-100 py-8 md:py-12">
                  <Stat label={t("propertyPreview.surface")} value={`${property.specs.size} m²`} />
                  <Stat label={t("propertyPreview.beds")} value={property.specs.beds} />
                  <Stat label={t("propertyPreview.baths")} value={property.specs.baths} />
                </div>

                {/* Price */}
                <div className="pt-2">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-stone-300 font-oswald mb-2 md:mb-4">
                    {t("propertyPreview.priceLabel")}
                  </p>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-playfair italic text-stone-900">
                    {property.price > 0
                      ? `€${property.price.toLocaleString("fr-FR")}`
                      : t("property.price.onRequest")}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA — STICKY AT BOTTOM ON MOBILE */}
            <div className="p-8 md:px-12 md:pb-12 lg:px-16 lg:pb-16 bg-white border-t border-stone-50 lg:border-none">
              <Link
                to={`/properties/${property.id}`}
                onClick={onClose}
                className="w-full bg-stone-900 text-white flex items-center justify-center gap-4
                           py-6 md:py-8 font-oswald text-[10px] uppercase tracking-[0.5em]
                           hover:bg-[#A47C3B] transition-all duration-500 group"
              >
                {t("propertyPreview.explore")}
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </aside>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* =========================================================
   SUB COMPONENTS
========================================================= */
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1 md:space-y-2">
      <p className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-stone-300 font-oswald leading-none">
        {label}
      </p>
      <p className="text-sm md:text-xl font-oswald text-stone-800 tracking-tight leading-none">
        {value}
      </p>
    </div>
  );
}

function NavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                 bg-white/10 backdrop-blur-md text-white
                 border border-white/10
                 hover:bg-[#A47C3B] hover:border-[#A47C3B]
                 transition-all active:scale-95"
    >
      {children}
    </button>
  );
}