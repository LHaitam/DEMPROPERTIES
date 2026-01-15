import React from "react";
import { MapPin } from "lucide-react";
import type { Property } from "@/hooks/useProperties";

interface PropertyMapProps {
  property: Property;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  return (
    <div className="w-full h-[400px] bg-stone-100 relative flex items-center justify-center overflow-hidden">
      {/* Ici, tu pourrais intégrer Google Maps ou Leaflet */}
      <div className="absolute inset-0 grayscale contrast-125 opacity-50 bg-[url('https://www.google.com/maps/d/u/0/thumbnail?mid=1_7S5M3_3_3_3')] bg-cover" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="p-4 bg-white rounded-full shadow-2xl mb-4 animate-bounce">
          <MapPin className="text-[#C5A059]" size={32} />
        </div>
        <span className="bg-white px-4 py-2 font-oswald text-[10px] uppercase tracking-widest shadow-lg">
          {property.poblacion}, {property.ciudad}
        </span>
      </div>
    </div>
  );
};

export default PropertyMap;