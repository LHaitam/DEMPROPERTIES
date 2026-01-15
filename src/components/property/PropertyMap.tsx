import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { Property } from "@/hooks/useProperties";

interface PropertyMapProps {
  property: Property & {
    lat?: number | string;
    lng?: number | string;
    title?: string;
    poblacion?: string;
    ciudad?: string;
  };
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const lat = Number(property.lat);
  const lng = Number(property.lng);

  // fallback (Marbella)
  const position: [number, number] =
    !isNaN(lat) && !isNaN(lng) ? [lat, lng] : [36.5101, -4.8824];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-stone-100 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.35)]">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{property.title || "Property"}</p>
              <p className="text-stone-500">
                {property.poblacion || "-"}, {property.ciudad || "-"}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
