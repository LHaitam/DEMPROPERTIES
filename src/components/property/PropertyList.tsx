import { useState, useEffect } from "react";
import { PropertyFilters } from "@/components/properties/PropertiesFilters";
import { PropertiesGrid } from "../properties/PropertiesGrid";

import type { Property } from "@/types/property";
import { fetchAllProperties } from "@/services/inmovillaApi";
import { mapInmovillaToProperty } from "@/lib/property-mapper";

export const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
  setLoading(true);
  try {
    const data = await fetchAllProperties();

    const items = data?.paginacion?.slice(1) || [];
    const mapped = items.map(mapInmovillaToProperty);

    setProperties(mapped);
  } catch (error) {
    console.error("Failed to load properties", error);
    setProperties([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="space-y-12">
      <PropertyFilters onSearch={fetchProperties} />

      {loading ? (
        <div className="h-96 flex items-center justify-center font-playfair italic text-[#C5A059]">
          Loading collection…
        </div>
      ) : (
        <PropertiesGrid
          properties={properties}
          onPreview={(property) => {
            // Ici tu peux ouvrir PropertyPreview
            console.log(property);
          }}
        />
      )}
    </div>
  );
};
