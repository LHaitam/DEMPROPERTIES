import { Bed, Bath, Ruler, Calendar, Hash, Map } from "lucide-react";
import type { Property } from "@/types/property";

export const PropertySpecs = ({ property }: { property: Property }) => {
  const specs = [
    { label: "Reference", value: property.reference, icon: Hash },
    { label: "Bedrooms", value: property.specs.beds, icon: Bed },
    { label: "Bathrooms", value: property.specs.baths, icon: Bath },
    { label: "Living Area", value: `${property.specs.size} m²`, icon: Ruler },
    { label: "Location", value: property.location.split(',')[0], icon: Map },
    { label: "Status", value: property.operation === 'sale' ? 'For Sale' : 'To Rent', icon: Calendar },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 border-y border-[#121212]/5">
      {specs.map((spec, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[#C5A059]">
            <spec.icon size={18} strokeWidth={1.5} />
            <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-[#121212]/40">{spec.label}</span>
          </div>
          <p className="font-oswald text-lg uppercase text-[#121212] ml-7">{spec.value}</p>
        </div>
      ))}
    </div>
  );
};