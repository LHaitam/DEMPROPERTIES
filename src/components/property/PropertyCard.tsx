import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Bed,
  Bath,
  Ruler,
  ArrowRight,
} from "lucide-react";
import type { Property } from "@/types/property";

type Props = {
  property: Property;
  onPreview: () => void;
};

const PropertyCard: React.FC<Props> = ({ property, onPreview }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /* =======================
     ⛔ SKIP NON DISPONIBLE
  ======================= */
  if (property.status === "unavailable") return null;

  const images =
    property.images?.length > 0
      ? property.images
      : [property.mainImage];

  const priceValue = Number(property.price);
  const isRental = property.operation === "rent";

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article
      className="group bg-white flex flex-col h-[660px] relative
                 transition-all duration-700 ease-in-out
                 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)]
                 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]
                 hover:-translate-y-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-[420px] overflow-hidden bg-stone-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/800x600?text=Property";
            }}
            alt={property.title}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60" />

        {/* Navigation */}
        {images.length > 1 && (
          <div
            className={`absolute inset-0 flex items-center justify-between px-4 z-20 transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-0 invisible"
            }`}
          >
            <button
              onClick={prevImg}
              aria-label={t("property.actions.previousImage")}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center
                         hover:bg-[#C5A059] hover:text-white transition-colors shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImg}
              aria-label={t("property.actions.nextImage")}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center
                         hover:bg-[#C5A059] hover:text-white transition-colors shadow-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Operation badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-white px-4 py-2 font-oswald text-[10px] uppercase tracking-[0.2em] shadow-sm">
            {t(`property.operation.${property.operation}`)}
          </span>
        </div>

        {/* Preview */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreview();
          }}
          aria-label={t("property.actions.preview")}
          className="absolute top-6 right-6 w-10 h-10 bg-white shadow-sm
                     flex items-center justify-center text-stone-500
                     hover:text-[#C5A059] transition-all z-30"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-col flex-1 p-8">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-oswald text-xl uppercase tracking-tight text-stone-900 line-clamp-1">
              {property.title}
            </h3>
            <span className="font-oswald text-[10px] text-stone-400 uppercase tracking-widest">
              {t("property.ref")} {property.reference}
            </span>
          </div>

          <p className="font-playfair italic text-stone-400 text-sm mb-6 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A059]" />
            {property.location}
          </p>

          <div className="flex justify-between border-y border-stone-100 py-6">
            <Spec
              icon={<Bed size={16} />}
              value={property.specs.beds}
              label={t("property.specs.beds")}
            />
            <Spec
              icon={<Bath size={16} />}
              value={property.specs.baths}
              label={t("property.specs.baths")}
            />
            <Spec
              icon={<Ruler size={16} />}
              value={property.specs.size}
              label={t("property.specs.size")}
            />
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-8 flex justify-between items-end">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 font-oswald mb-1">
              {t("property.price.label")}
            </p>
            <p className="text-2xl font-playfair italic text-[#C5A059]">
              {priceValue > 0
                ? `€${priceValue.toLocaleString("fr-FR")}`
                : t("property.price.onRequest")}
              {isRental && (
                <span className="text-xs not-italic text-stone-400 ml-1">
                  {t("property.price.perMonth")}
                </span>
              )}
            </p>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="flex items-center gap-3 font-oswald text-[11px]
                       uppercase tracking-[0.3em] hover:text-[#C5A059]"
          >
            <span className="border-b pb-1">
              {t("property.actions.viewDetails")}
            </span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

function Spec({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="text-stone-300">{icon}</div>
      <span className="font-oswald text-sm">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-stone-400">
        {label}
      </span>
    </div>
  );
}

export default PropertyCard;
