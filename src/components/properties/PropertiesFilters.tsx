import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";

export interface FilterState {
  search: string;
  operation: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  beds: string;
  baths: string;
  // Nouveaux champs avancés
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
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  setFilters,
  propertyTypes,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    setFilters({
      search: "",
      operation: "all",
      type: "all",
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
    filters.operation !== "all" || 
    filters.type !== "all" || 
    filters.maxPrice !== 50000000 ||
    filters.pool || filters.parking || filters.seaViews;

  const toggleCheckbox = (field: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border-y border-stone-100 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* LIGNE PRINCIPALE */}
        <div className="flex flex-wrap items-center gap-6">
          
          <div className="flex-1 min-w-[240px] relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 group-focus-within:text-[#C5A059] transition-colors" />
            <input
              type="text"
              placeholder={t('filters.search_placeholder')}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none font-oswald text-[10px] uppercase tracking-widest focus:ring-1 focus:ring-[#C5A059]/30 rounded-sm"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {/* Sélecteurs simples (Opération & Type) */}
            {['operation', 'type'].map((id) => (
              <div key={id} className="relative group">
                <select
                  className="appearance-none bg-transparent pr-8 py-2 font-oswald text-[10px] uppercase tracking-[0.2em] text-stone-900 cursor-pointer outline-none"
                  value={id === 'operation' ? filters.operation : filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, [id]: e.target.value }))}
                >
                  {id === 'operation' ? (
                    <>
                      <option value="all">{t('property.operation.sale')} & {t('property.operation.rent')}</option>
                      <option value="1">{t('property.operation.sale')}</option>
                      <option value="2">{t('property.operation.rent')}</option>
                    </>
                  ) : (
                    <>
                      <option value="all">All Types</option>
                      {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#C5A059]" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 py-2.5 border border-stone-200 font-oswald text-[10px] uppercase tracking-widest transition-all ${isExpanded ? 'bg-stone-900 text-white' : 'hover:bg-stone-50'}`}
            >
              <SlidersHorizontal size={14} />
              {isExpanded ? t('filters.simple') : t('filters.advanced')}
            </button>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleReset}
                  className="p-2.5 bg-stone-100 text-stone-500 hover:text-stone-900 rounded-full transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* PANNEAU AVANCÉ */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-stone-100 mt-6">
                
                {/* Surfaces & Prix */}
                <div className="space-y-4">
                  <p className="font-oswald text-[9px] uppercase tracking-[0.2em] text-stone-400">{t('filters.surface')}</p>
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Min m²" 
                      className="w-1/2 p-3 bg-stone-50 border-none text-[11px] font-oswald focus:ring-1 focus:ring-[#C5A059]/30"
                      value={filters.minSurface}
                      onChange={(e) => setFilters(prev => ({ ...prev, minSurface: e.target.value }))}
                    />
                    <input 
                      type="number" placeholder="Max m²" 
                      className="w-1/2 p-3 bg-stone-50 border-none text-[11px] font-oswald focus:ring-1 focus:ring-[#C5A059]/30"
                      value={filters.maxSurface}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxSurface: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-oswald text-[9px] uppercase tracking-[0.2em] text-stone-400">{t('filters.reference')}</p>
                  <input 
                    type="text" placeholder="REF..." 
                    className="w-full p-3 bg-stone-50 border-none text-[11px] font-oswald focus:ring-1 focus:ring-[#C5A059]/30"
                    value={filters.ref}
                    onChange={(e) => setFilters(prev => ({ ...prev, ref: e.target.value }))}
                  />
                </div>

                {/* Caractéristiques (Checkboxes) */}
                <div className="md:col-span-2 grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { id: 'pool', label: 'pool' },
                    { id: 'parking', label: 'parking' },
                    { id: 'terrace', label: 'terrace' },
                    { id: 'seaViews', label: 'sea_views' }
                  ].map((feat) => (
                    <label key={feat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => toggleCheckbox(feat.id as keyof FilterState)}
                        className={`w-5 h-5 border transition-all flex items-center justify-center rounded-sm ${filters[feat.id as keyof FilterState] ? 'bg-[#C5A059] border-[#C5A059]' : 'border-stone-300 group-hover:border-[#C5A059]'}`}
                      >
                        {filters[feat.id as keyof FilterState] && <Check size={12} className="text-white" />}
                      </div>
                      <span className="font-oswald text-[10px] uppercase tracking-widest text-stone-600 group-hover:text-stone-900 transition-colors">
                        {t(`filters.features.${feat.label}`)}
                      </span>
                    </label>
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