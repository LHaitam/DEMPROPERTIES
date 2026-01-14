import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { HeroProperties } from "@/components/properties/PropertiesHero";
import {
  PropertyFilters,
  type PropertyFiltersValues,
} from "@/components/properties/PropertiesFilters";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import PropertyPreview from "@/components/property/PropertyPreview";

import type { Property } from "@/types/property";
import { fetchAllProperties } from "@/services/inmovillaApi";
import { mapInmovillaToProperty } from "@/lib/property-mapper";

export default function PropertiesPage() {
  const filtersRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Property | null>(null);
  const [filters, setFilters] = useState<PropertyFiltersValues>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProperties();

        // Inmovilla: paginacion[0] = meta
        const items = data?.paginacion?.slice(1) ?? [];

        const mapped: Property[] = items.map((raw: any) =>
          mapInmovillaToProperty(raw)
        );

        setProperties(mapped);
      } catch (error) {
        console.error("Error loading properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  /* ===================== FILTERING ===================== */
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // OPERATION
      if (filters.operation && p.operation !== filters.operation) {
        return false;
      }

      // PRICE
      const minPrice = filters.minPrice
        ? Number(filters.minPrice)
        : null;
      const maxPrice = filters.maxPrice
        ? Number(filters.maxPrice)
        : null;

      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;

      // LOCATION
      if (
        filters.location &&
        !p.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  /* ===================== PAGINATION ===================== */
  const pagination = useMemo(() => {
    const total = filteredProperties.length;
    return {
      total,
      pages: Math.ceil(total / itemsPerPage),
    };
  }, [filteredProperties]);

  const displayProperties = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, page]);

  /* ===================== HANDLERS ===================== */
  const handleSearch = (newFilters: PropertyFiltersValues) => {
    setFilters(newFilters);
    setPage(1);

    setTimeout(() => {
      filtersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  /* ===================== VIEW ===================== */
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      <HeroProperties
        onExploreClick={() =>
          filtersRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div
        ref={filtersRef}
        className="scroll-mt-[80px] md:scroll-mt-[100px]"
      >
        <PropertyFilters onSearch={handleSearch} />
      </div>

      <section className="max-w-[1500px] mx-auto px-6 py-20 min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="w-10 h-10 border border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
            <p className="font-oswald tracking-[0.4em] text-[9px] uppercase text-[#121212]/40 text-center">
              Curating the finest selection...
            </p>
          </div>
        ) : (
          <>
            {displayProperties.length > 0 ? (
              <PropertiesGrid
                properties={displayProperties}
                onPreview={setSelected}
              />
            ) : (
              <div className="text-center py-40 border border-[#121212]/5 bg-white/40 backdrop-blur-sm">
                <p className="font-playfair italic text-2xl text-[#121212]/40 mb-8">
                  No properties found for your criteria.
                </p>
                <button
                  onClick={() => handleSearch({})}
                  className="font-oswald text-[10px] tracking-widest text-[#C5A059] uppercase border-b border-[#C5A059]/20 hover:border-[#C5A059] transition-all pb-1"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* ===== PAGINATION ===== */}
            {pagination.pages > 1 && displayProperties.length > 0 && (
              <div className="mt-32 border-t border-[#121212]/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <p className="font-oswald text-[9px] tracking-[0.3em] text-[#121212]/30 uppercase">
                  Listing {String(page).padStart(2, "0")} of{" "}
                  {String(pagination.pages).padStart(2, "0")}
                </p>

                <div className="flex items-center gap-4 md:gap-10">
                  <button
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      filtersRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="group flex items-center gap-3 font-oswald text-[10px] tracking-[0.4em] uppercase disabled:opacity-10"
                  >
                    <span className="w-6 h-[1px] bg-[#121212] group-hover:w-12 group-hover:bg-[#C5A059] transition-all" />
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setPage(i);
                          filtersRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        className={`w-12 h-12 flex items-center justify-center font-oswald text-[11px] transition-all ${
                          page === i
                            ? "text-[#121212]"
                            : "text-[#121212]/20 hover:text-[#C5A059]"
                        }`}
                      >
                        {String(i).padStart(2, "0")}
                        {page === i && (
                          <motion.div
                            layoutId="pageBar"
                            className="absolute bottom-2 w-4 h-[1px] bg-[#C5A059]"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === pagination.pages}
                    onClick={() => {
                      setPage((p) => p + 1);
                      filtersRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="group flex items-center gap-3 font-oswald text-[10px] tracking-[0.4em] uppercase disabled:opacity-10"
                  >
                    Next
                    <span className="w-6 h-[1px] bg-[#121212] group-hover:w-12 group-hover:bg-[#C5A059] transition-all" />
                  </button>
                </div>

                <div className="hidden lg:block w-32" />
              </div>
            )}
          </>
        )}
      </section>

      <PropertyPreview
        property={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
