import React from "react";
import { motion } from "framer-motion";
import type { Property } from "@/hooks/useProperties";
import PropertyCard from "../property/PropertyCard";

type Props = {
  properties: Property[];
  onPreview: (property: Property) => void;
};

export const PropertiesGrid: React.FC<Props> = ({ properties, onPreview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {properties.map((property) => (
        <motion.div
          key={property.cod_ofer} // Ici cod_ofer est maintenant garanti
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PropertyCard property={property} onPreview={onPreview} />
        </motion.div>
      ))}
    </div>
  );
};