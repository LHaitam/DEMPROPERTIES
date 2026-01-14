import React from "react";
import { motion } from "framer-motion";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";

type Props = {
  properties: Property[];
  onPreview: (property: Property) => void;
};

export const PropertiesGrid: React.FC<Props> = ({
  properties,
  onPreview,
}) => {
  if (!properties.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-playfair italic text-[#121212]/40 text-lg">
          No properties match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12"
    >
      {properties.map((property) => (
        <motion.div
          key={property.id} // id frontend normalisé
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <PropertyCard
            property={property}
            onPreview={() => onPreview(property)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
