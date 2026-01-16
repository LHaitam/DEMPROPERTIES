import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";

// --- DÉFINITION DES TRANCHES DE PRIX ---
export const PRICE_RANGES = [
  { label: "000.000 - 300.000 €", min: 0, max: 300000 },
  { label: "300.000 - 500.000 €", min: 300000, max: 500000 },
  { label: "500.000 - 750.000 €", min: 500000, max: 750000 },
  { label: "750.000 - 1.000.000 €", min: 750000, max: 1000000 },
  { label: "1.000.000 - 3.000.000 €", min: 1000000, max: 3000000 },
  { label: "3.000.000 - 6.000.000 €", min: 3000000, max: 6000000 },
  { label: "6.000.000 € +", min: 6000000, max: 999999999 },
];

export interface FilterState {
  search: string;
  operation: string;
  type: string;
  location: string;
  priceRange: string; // Ajouté pour le menu déroulant
  minPrice: number;
  maxPrice: number;
  beds: string;
  baths: string;
  ref: string;
  minSurface: string;
  maxSurface: string;
  pool: boolean;
  parking: boolean;
  terrace: boolean;
  seaViews: boolean;
}

interface PropertyFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  propertyTypes: string[];
  locations: string[];
  bedOptions: string[];
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  setFilters,
  propertyTypes = [],
  locations = [],
  bedOptions = [],
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    setFilters({
      search: "",
      operation: "all",
      type: "all",
      location: "all",
      priceRange: "all",
      minPrice: 0,
      maxPrice: 50000000,
      beds: "all",
      baths: "all",
      ref: "",
      minSurface: "",
      maxSurface: "",
      pool: false,
      parking: false,
      terrace: false,
      seaViews: false,
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.location !== "all" ||
    filters.type !== "all" ||
    filters.priceRange !== "all" ||
    filters.beds !== "all" ||
    filters.ref !== "" ||
    filters.pool ||
    filters.parking ||
    filters.terrace ||
    filters.seaViews;

  const toggleCheckbox = (field: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border-y border-stone-100 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        
        {/* --- BARRE PRINCIPALE --- */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Recherche */}
          <div className="flex-1 min-w-[200px] relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("filters.search_placeholder")}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none font-oswald text-[10px] uppercase tracking-widest focus:ring-1 focus:ring-[#a5694f]/30 rounded-sm"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Localisation */}
          <div className="relative min-w-[140px]">
            <select
              className="w-full appearance-none bg-stone-50 pl-4 pr-10 py-3 font-oswald text-[10px] uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-stone-100 transition-colors"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            >
              <option value="all">{t("filters.location_all")}</option>
              {(locations || []).slice().sort().map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#a5694f] pointer-events-none" />
          </div>

          {/* Type */}
          <div className="relative min-w-[140px]">
            <select
              className="w-full appearance-none bg-stone-50 pl-4 pr-10 py-3 font-oswald text-[10px] uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-stone-100 transition-colors"
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">{t("filters.type_all")}</option>
              {(propertyTypes || []).slice().sort().map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#a5694f] pointer-events-none" />
          </div>

          {/* NOUVEAU : Menu Déroulant Prix */}
          <div className="relative min-w-[160px]">
            <select
              className="w-full appearance-none bg-stone-50 pl-4 pr-10 py-3 font-oswald text-[10px] uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-stone-100 transition-colors"
              value={filters.priceRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="all">{t("propertyPreview.priceLabel") || "SELECT PRICE"}</option>
              {PRICE_RANGES.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#a5694f] pointer-events-none" />
          </div>

          {/* Chambres */}
          <div className="relative min-w-[100px]">
            <select
              className="w-full appearance-none bg-stone-50 pl-4 pr-10 py-3 font-oswald text-[10px] uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-stone-100 transition-colors"
              value={filters.beds}
              onChange={(e) => setFilters((prev) => ({ ...prev, beds: e.target.value }))}
            >
              <option value="all">{t("filters.beds_all")}</option>
              {(bedOptions || []).slice().sort((a, b) => parseInt(a) - parseInt(b)).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}+ {t("property.specs.beds")}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#a5694f] pointer-events-none" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-5 py-3 border border-stone-200 font-oswald text-[10px] uppercase tracking-widest transition-all ${
                isExpanded ? "bg-stone-900 text-white border-stone-900" : "hover:bg-stone-50"
              }`}
            >
              <SlidersHorizontal size={14} />
              {isExpanded ? t("filters.simple") : t("filters.advanced")}
            </button>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleReset}
                  className="p-3 bg-stone-100 text-stone-500 hover:text-stone-900 rounded-full transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- PANNEAU AVANCÉ --- */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone-100 mt-6">
                
                {/* 1. SURFACE */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-oswald text-[9px] uppercase tracking-[0.2em] text-stone-400">
                      {t("filters.surface")}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min m²"
                        className="w-1/2 p-2 bg-stone-50 border-none text-[10px] font-oswald focus:ring-1 focus:ring-[#a5694f]/30"
                        value={filters.minSurface}
                        onChange={(e) => setFilters((prev) => ({ ...prev, minSurface: e.target.value }))}
                      />
                      <input
                        type="number"
                        placeholder="Max m²"
                        className="w-1/2 p-2 bg-stone-50 border-none text-[10px] font-oswald focus:ring-1 focus:ring-[#a5694f]/30"
                        value={filters.maxSurface}
                        onChange={(e) => setFilters((prev) => ({ ...prev, maxSurface: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. RÉFÉRENCE */}
                <div className="space-y-3">
                  <p className="font-oswald text-[9px] uppercase tracking-[0.2em] text-stone-400">
                    {t("property.ref") || "REFERENCE"}
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. DEM-123"
                    className="w-full p-2 bg-stone-50 border-none text-[10px] font-oswald focus:ring-1 focus:ring-[#a5694f]/30"
                    value={filters.ref}
                    onChange={(e) => setFilters((prev) => ({ ...prev, ref: e.target.value }))}
                  />
                </div>

                {/* 3. CARACTÉRISTIQUES */}
                <div className="flex flex-col gap-y-4">
                  {(["pool", "parking", "terrace", "seaViews"] as const).map((id) => (
                    <div
                      key={id}
                      className="flex items-center gap-3 group cursor-pointer"
                      onClick={() => toggleCheckbox(id)}
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 border transition-all flex items-center justify-center rounded-sm ${
                          filters[id] ? "bg-[#a5694f] border-[#a5694f]" : "border-stone-300 group-hover:border-[#a5694f]"
                        }`}
                      >
                        {filters[id] && <Check size={10} className="text-white" />}
                      </button>
                      <span className="font-oswald text-[9px] uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">
                        {t(`filters.features.${id === "seaViews" ? "sea_views" : id}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};