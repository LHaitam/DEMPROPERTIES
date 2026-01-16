import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction icône Leaflet (évite le marqueur invisible)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  property: {
    lat?: number | string;
    lng?: number | string;
    nbtipo?: string;
    zona?: string;
    ciudad?: string;
  };
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  // Conversion en nombres
  const lat = property.lat ? Number(property.lat) : null;
  const lng = property.lng ? Number(property.lng) : null;

  // Validation (Inmovilla met souvent 0 ou null si c'est vide)
  const hasCoords = lat !== null && lng !== null && lat !== 0;

  // Position finale (Fallback Marbella)
  const position: [number, number] = hasCoords 
    ? [lat, lng] 
    : [36.5101, -4.8824];

  return (
    <div className="w-full h-full min-h-[400px] rounded-sm overflow-hidden border border-stone-100 shadow-sm relative">
      <MapContainer
        // IMPORTANT : La key force la carte à se recentrer quand on change de propriété
        key={`${position[0]}-${position[1]}`} 
        center={position}
        zoom={hasCoords ? 15 : 13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer 
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        {hasCoords && (
          <Marker position={position}>
            <Popup>
              <div className="font-oswald text-[10px] uppercase p-1">
                <p className="font-bold text-stone-900">{property.nbtipo}</p>
                <p className="text-stone-500">{property.zona || property.ciudad}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {!hasCoords && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 px-3 py-1 text-[9px] font-oswald uppercase tracking-widest text-stone-400 border border-stone-100 shadow-sm">
          Ubicación aproximada
        </div>
      )}
    </div>
  );
};

export default PropertyMap;