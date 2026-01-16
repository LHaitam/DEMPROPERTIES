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

  const propertyTypes = useMemo(() => {
    return Array.from(new Set(properties.map(p => (p as any).tipoinmo).filter(Boolean))) as string[];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const prop = p as any;

      // 0. Ignorer l'objet de pagination (celui qui a la clé 'posicion')
      if (prop.posicion) return false;

      // 1. Recherche textuelle (Ville ou Réf)
      // Dans ton JSON c'est 'ciudad' et 'ref'
      const matchSearch = !filters.search ||
        (`${prop.ciudad} ${prop.ref}`).toLowerCase().includes(filters.search.toLowerCase());

      // 2. Opération (Vente=1 / Location=2)
      const matchOp = filters.operation === "all" || String(prop.keyacci) === String(filters.operation);

      // 3. Type de bien (nbtipo dans ton JSON ex: "Apartamento")
      const matchType = filters.type === "all" || prop.nbtipo === filters.type;

      // 4. Chambres (total_hab dans ton JSON)
      const matchBeds = filters.beds === "all" || Number(prop.total_hab) >= Number(filters.beds);

      // 5. Référence
      const matchRef = !filters.ref || prop.ref?.toLowerCase().includes(filters.ref.toLowerCase());

      // 6. Surfaces (m_cons dans ton JSON pour surface construite)
      const surface = Number(prop.m_cons) || 0;
      const matchMinSurf = !filters.minSurface || surface >= Number(filters.minSurface);
      const matchMaxSurf = !filters.maxSurface || surface <= Number(filters.maxSurface);

      // 7. Caractéristiques (Inmovilla utilise souvent 1 pour Oui, 0 pour Non dans ce JSON)
      const matchPool = !filters.pool || (Number(prop.piscina_com) === 1 || Number(prop.piscina_prop) === 1);
      const matchParking = !filters.parking || Number(prop.parking) > 0;
      const matchSea = !filters.seaViews || Number(prop.vistasalmar) === 1;
      const matchTerrace = !filters.terrace || Number(prop.terraza) === 1;

      // 8. Prix 
      // Logic: precioinmo pour vente (keyacci 1), precioalq pour location (keyacci 2)
      const isRental = String(prop.keyacci) === "2";
      const price = isRental ? Number(prop.precioalq) : Number(prop.precioinmo);

      // Sécurité : si le prix est 0 (prix sur demande), on décide généralement de l'afficher 
      // sauf si l'utilisateur a mis un filtre de prix très strict
      const matchMinPrice = price === 0 || price >= filters.minPrice;
      const matchMaxPrice = price === 0 || price <= filters.maxPrice;

      return (
        matchSearch && matchOp && matchType && matchBeds && matchRef &&
        matchMinSurf && matchMaxSurf && matchPool && matchParking &&
        matchSea && matchTerrace && matchMinPrice && matchMaxPrice
      );
    });
  }, [properties, filters]);

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
            ? "Catálogo exclusivo de villas, apartamentos y propiedades off-market en Marbella. Encuentre su hogar ideal con nuestra asesoría experta."
            : "Exclusive catalog of villas, apartments, and off-market properties in Marbella. Find your ideal home with our expert guidance."}
        />
        <link rel="canonical" href="https://demproperties.es/properties" />
        <meta property="og:title" content={isES ? "Propiedades en Marbella — DEM" : "Marbella Properties — DEM"} />
      </Helmet>

      <Header />

      <HeroProperties onExploreClick={scrollToGrid} onFiltersClick={scrollToFilters} />

      <div ref={filterRef} className="scroll-mt-20">
        <PropertyFilters filters={filters} setFilters={setFilters} propertyTypes={propertyTypes} />
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
                  <PropertiesGrid properties={paginatedProperties} onPreview={(p) => { setSelectedProperty(p); setIsPreviewOpen(true); }} />
                </motion.div>
              </AnimatePresence>

              {/* PAGINATION */}
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
                          whileHover={{ y: -2 }}
                          className={`relative w-12 h-12 font-oswald text-xs tracking-widest transition-colors ${currentPage === pageNum ? "text-white" : "text-stone-400 hover:text-stone-900"
                            }`}
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