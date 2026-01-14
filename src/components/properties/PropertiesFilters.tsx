import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, RotateCcw, Search } from "lucide-react";

/* ===================== TYPES ===================== */

export type PropertyFiltersValues = {
  operation?: "sale" | "rent"; // keyacci (1 = sale, 2 = rent)
  type?: string;               // key_tipo (Inmovilla)
  location?: string;           // ville (texte)
  minPrice?: string;
  maxPrice?: string;
  ref?: string;
  beds?: string;
  baths?: string;
  minSize?: string;
  features?: string[];
};

type Props = {
  onSearch?: (filters: PropertyFiltersValues) => void;
};

/* ===================== INMOVILLA TYPE MAPPING ===================== */
/* ⚠️ Ces codes doivent correspondre à TES enums Inmovilla */
const TYPE_MAPPING: Record<string, string> = {
  villa: "6499",
  apartment: "2799",
  penthouse: "3099",
};

/* ===================== COMPONENT ===================== */

export const PropertyFilters: React.FC<Props> = ({ onSearch }) => {
  const [advanced, setAdvanced] = useState(false);

  const [filters, setFilters] = useState<PropertyFiltersValues>({
    features: [],
  });

  const update = <K extends keyof PropertyFiltersValues>(
    key: K,
    value: PropertyFiltersValues[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /* ===================== ACTIONS ===================== */

  const handleSearch = () => {
    const normalized: PropertyFiltersValues = {
      ...filters,
      type: filters.type ? TYPE_MAPPING[filters.type] : undefined,
    };

    onSearch?.(normalized);
  };

  const resetFilters = () => {
    const empty: PropertyFiltersValues = { features: [] };
    setFilters(empty);
    onSearch?.(empty);
  };

  /* ===================== VIEW ===================== */

  return (
    <section className="sticky top-[64px] md:top-[80px] z-40 bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-[#121212]/5">
      <div className="max-w-[1500px] mx-auto px-6 py-4 md:py-6">
        <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center">
          {/* OPERATION */}
          <select
            value={filters.operation || ""}
            onChange={(e) =>
              update("operation", e.target.value as "sale" | "rent")
            }
            className="flex-1 min-w-[140px] bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] tracking-widest uppercase outline-none focus:border-[#C5A059]"
          >
            <option value="">Sale & Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* TYPE */}
          <select
            value={filters.type || ""}
            onChange={(e) => update("type", e.target.value)}
            className="flex-1 min-w-[140px] bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] tracking-widest uppercase outline-none focus:border-[#C5A059]"
          >
            <option value="">All Types</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="penthouse">Penthouse</option>
          </select>

          {/* LOCATION */}
          <input
            placeholder="LOCATION (CITY)"
            value={filters.location || ""}
            onChange={(e) => update("location", e.target.value)}
            className="flex-[1.5] min-w-[180px] bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] tracking-widest uppercase outline-none focus:border-[#C5A059]"
          />

          {/* PRICE */}
          <div className="flex flex-1 min-w-[200px] gap-2">
            <input
              type="number"
              placeholder="MIN €"
              value={filters.minPrice || ""}
              onChange={(e) => update("minPrice", e.target.value)}
              className="w-1/2 bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] outline-none focus:border-[#C5A059]"
            />
            <input
              type="number"
              placeholder="MAX €"
              value={filters.maxPrice || ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="w-1/2 bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* REF */}
          <input
            placeholder="REF"
            value={filters.ref || ""}
            onChange={(e) => update("ref", e.target.value)}
            className="w-24 bg-transparent border border-[#121212]/10 px-4 py-3 font-oswald text-[10px] outline-none focus:border-[#C5A059]"
          />

          {/* ACTIONS */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={() => setAdvanced((v) => !v)}
              className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-5 py-3 border font-oswald text-[9px] tracking-[0.3em] uppercase transition-all ${
                advanced
                  ? "bg-[#121212] text-white"
                  : "border-[#121212]/10"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 flex-1 lg:flex-none px-8 py-3 bg-[#C5A059] text-white font-oswald text-[9px] tracking-[0.3em] uppercase hover:bg-[#121212] transition-all"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* ===================== ADVANCED ===================== */}
      <AnimatePresence>
        {advanced && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-[#FDFCFB] border-t border-[#121212]/5"
          >
            <div className="max-w-[1500px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* BEDS */}
              <div className="space-y-3">
                <label className="font-oswald text-[8px] tracking-[0.4em] text-[#121212]/40 uppercase">
                  Bedrooms
                </label>
                <select
                  value={filters.beds || ""}
                  onChange={(e) => update("beds", e.target.value)}
                  className="w-full bg-transparent border-b border-[#121212]/10 py-2 font-oswald text-[10px]"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}+ Beds
                    </option>
                  ))}
                </select>
              </div>

              {/* BATHS */}
              <div className="space-y-3">
                <label className="font-oswald text-[8px] tracking-[0.4em] text-[#121212]/40 uppercase">
                  Bathrooms
                </label>
                <select
                  value={filters.baths || ""}
                  onChange={(e) => update("baths", e.target.value)}
                  className="w-full bg-transparent border-b border-[#121212]/10 py-2 font-oswald text-[10px]"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}+ Baths
                    </option>
                  ))}
                </select>
              </div>

              {/* RESET */}
              <div className="flex items-end pb-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-[#121212]/40 hover:text-[#C5A059] font-oswald text-[9px] uppercase"
                >
                  <RotateCcw size={12} /> Reset all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
