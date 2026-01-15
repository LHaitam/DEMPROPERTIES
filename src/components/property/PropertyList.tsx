import React from "react";
import type { Property } from "@/hooks/useProperties";
import PropertyCard from "./PropertyCard";

interface PropertyListProps {
  properties: Property[];
  onPreview: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPreview }) => {
  return (
    <div className="flex flex-col gap-8">
      {properties.map((property) => (
        <PropertyCard 
          key={property.cod_ofer} 
          property={property} 
          onPreview={onPreview} 
        />
      ))}
    </div>
  );
};

export default PropertyList;