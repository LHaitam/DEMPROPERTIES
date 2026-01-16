import React, { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { HeroProperties } from "@/components/properties/PropertiesHero";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { PropertyFilters } from "@/components/properties/PropertiesFilters";
import type { FilterState } from "@/components/properties/PropertiesFilters";

import { PropertyPreview } from "@/components/property/PropertyPreview";
import { useProperties } from "@/hooks/useProperties";
import type { Property } from "@/hooks/useProperties";
import Header from "@/components/layout/Header";

const ITEMS_PER_PAGE = 9;

// --- DÉFINITION DES TRANCHES DE PRIX (Correspondant à votre image) ---
export const PRICE_RANGES = [
  { label: "000.000 - 300.000 €", min: 0, max: 300000 },
  { label: "300.000 - 500.000 €", min: 300000, max: 500000 },
  { label: "500.000 - 750.000 €", min: 500000, max: 750000 },
  { label: "750.000 - 1.000.000 €", min: 750000, max: 1000000 },
  { label: "1.000.000 - 3.000.000 €", min: 1000000, max: 3000000 },
  { label: "3.000.000 - 6.000.000 €", min: 3000000, max: 6000000 },
  { label: "6.000.000 € +", min: 6000000, max: 999999999 },
];

const Properties: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { properties, loading } = useProperties(i18n.language);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const isES = i18n.language === "es";

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    operation: "all",
    type: "all",
    location: "all",
    priceRange: "all", // Utilisation de la tranche au lieu de min/max individuels
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // --- LOGIQUE DYNAMIQUE POUR LES DROPDOWNS (CORRIGÉE) ---

  const locations = useMemo(() => {
    const raw = properties.map(p => {
      const prop = p as any;
      return prop.ciudad || prop.poblacion || prop.zona || prop.municipio;
    }).filter((val): val is string => Boolean(val));

    return Array.from(new Set(raw)).sort();
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const raw = properties.map(p => {
      const prop = p as any;
      return prop.nbtipo || prop.tipo;
    }).filter((val): val is string => Boolean(val));

    return Array.from(new Set(raw)).sort();
  }, [properties]);

  const bedOptions = useMemo(() => {
    const raw = properties.map(p => {
      const val = (p as any).total_hab || (p as any).habitaciones;
      return val !== undefined && val !== "0" && val !== 0 ? String(val) : null;
    }).filter((val): val is string => Boolean(val));

    return Array.from(new Set(raw)).sort((a, b) => parseInt(a) - parseInt(b));
  }, [properties]);

  // --- LOGIQUE DE FILTRAGE AMÉLIORÉE ---

  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter(p => {
      const prop = p as any;

      const propLocation = prop.ciudad || prop.poblacion || "";
      const propType = prop.nbtipo || prop.tipo || "";
      const propBeds = Number(prop.total_hab || prop.habitaciones || 0);

      // 1. Recherche (Texte libre)
      const matchSearch = !filters.search ||
        (`${propLocation} ${prop.ref} ${propType}`).toLowerCase().includes(filters.search.toLowerCase());

      // 2. Localisation
      const matchLocation = filters.location === "all" || propLocation === filters.location;

      // 3. Type de bien
      const matchType = filters.type === "all" || propType === filters.type;

      // 4. Chambres
      const matchBeds = filters.beds === "all" || propBeds >= Number(filters.beds);

      // 5. Prix (Logique par tranches de l'image)
      const isRental = String(prop.keyacci) === "2";
      const price = isRental ? Number(prop.precioalq || 0) : Number(prop.precioinmo || 0);

      let matchPrice = true;
      if (filters.priceRange && filters.priceRange !== "all") {
        const range = PRICE_RANGES.find(r => r.label === filters.priceRange);
        if (range) {
          matchPrice = price >= range.min && price <= range.max;
        }
      } else {
        // Fallback sur le slider si utilisé
        matchPrice = (price === 0 || price >= filters.minPrice) && (price === 0 || price <= filters.maxPrice);
      }

      // 6. Autres filtres
      const matchRef = !filters.ref || prop.ref?.toLowerCase().includes(filters.ref.toLowerCase());
      const surface = Number(prop.m_cons) || 0;
      const matchMinSurf = !filters.minSurface || surface >= Number(filters.minSurface);
      const matchMaxSurf = !filters.maxSurface || surface <= Number(filters.maxSurface);
      const matchPool = !filters.pool || (Number(prop.piscina_com) === 1 || Number(prop.piscina_prop) === 1);
      const matchParking = !filters.parking || Number(prop.parking) > 0;
      const matchSea = !filters.seaViews || Number(prop.vistasalmar) === 1;
      const matchTerrace = !filters.terrace || Number(prop.terraza) === 1;

      return (
        matchSearch && matchLocation && matchType && matchBeds && matchPrice &&
        matchRef && matchMinSurf && matchMaxSurf && matchPool &&
        matchParking && matchSea && matchTerrace
      );
    });
  }, [properties, filters]);

  // --- PAGINATION ---

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFilters = () => filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>
          {isES ? "Viviendas en Venta y Alquiler | DEM Properties Marbella" : "Properties for Sale & Rent | DEM Properties Marbella"}
        </title>
        <meta
          name="description"
          content={isES
            ? "Catálogo exclusivo de villas, apartamentos y propriétés off-market en Marbella."
            : "Exclusive catalog of villas, apartments, and off-market properties in Marbella."}
        />
        <link rel="canonical" href="https://demproperties.es/properties" />
      </Helmet>

      <Header />

      <HeroProperties onExploreClick={scrollToGrid} onFiltersClick={scrollToFilters} />

      <div ref={filterRef} className="scroll-mt-20">
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          propertyTypes={propertyTypes}
          locations={locations}
          bedOptions={bedOptions}
        />
      </div>

      <section ref={gridRef} className="py-20 px-6 md:px-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 font-playfair italic text-stone-500">{t('featured.loading')}</div>
          ) : (
            <>
              <div className="mb-12 flex justify-between items-center border-b border-stone-100 pb-6">
                <span className="font-oswald text-[10px] uppercase tracking-[0.3em] text-stone-400">
                  {filteredProperties.length} {t('nav.properties')}
                  {totalPages > 1 && ` — Page ${currentPage} / ${totalPages}`}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {filteredProperties.length > 0 ? (
                    <PropertiesGrid
                      properties={paginatedProperties}
                      onPreview={(p) => { setSelectedProperty(p); setIsPreviewOpen(true); }}
                    />
                  ) : (
                    <div className="text-center py-20 font-playfair italic text-stone-400">
                      {t('filters.no_results') || "No properties match your criteria."}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* PAGINATION UI */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-3 border border-stone-200 rounded-full disabled:opacity-20 hover:border-stone-900 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>

                  <div className="flex gap-3">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <motion.button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative w-12 h-12 font-oswald text-xs tracking-widest transition-colors ${currentPage === pageNum ? "text-white" : "text-stone-400 hover:text-stone-900"}`}
                        >
                          <span className="relative z-10">{pageNum}</span>
                          {currentPage === pageNum && (
                            <motion.div
                              layoutId="activePageBg"
                              className="absolute inset-0 bg-stone-900"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-3 border border-stone-200 rounded-full disabled:opacity-20 hover:border-stone-900 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isPreviewOpen && selectedProperty && (
          <PropertyPreview
            property={selectedProperty}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            lang={i18n.language}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;