import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Bed,
  Bath,
  Ruler,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "@/hooks/useProperties";

const globalCache: Record<string, { images: string[]; detailedTitle: string }> = {};

interface PropertyCardProps {
  property: Property;
  onPreview: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPreview }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const [extraData, setExtraData] = useState({
    images: property.foto ? [property.foto] : [],
    detailedTitle: property.poblacion || "Propiedad",
    loading: true
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const langId = i18n.language === 'es' ? '1' : '2';
      const cacheKey = `${property.cod_ofer}_${langId}`;

      if (globalCache[cacheKey]) {
        setExtraData({ ...globalCache[cacheKey], loading: false });
        return;
      }

      try {
        const res = await fetch(
          `https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=detail&id=${property.cod_ofer}&lang=${langId}`
        );
        const result = await res.json();
        
        const ficha = result.ficha || {};
        const desc = result.descripciones?.[property.cod_ofer]?.[langId] || {};
        const fotosObj = result.fotos?.[property.cod_ofer] || {};
        
        const gallery = Object.values(fotosObj).filter((url): url is string => typeof url === 'string' && url.includes('http'));

        const finalData = {
          images: gallery.length > 0 ? gallery : (property.foto ? [property.foto] : []),
          detailedTitle: desc.titulo || ficha.titulo || property.poblacion || "Propiedad"
        };

        globalCache[cacheKey] = finalData;
        setExtraData({ ...finalData, loading: false });
      } catch (err) {
        setExtraData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDetails();
  }, [property.cod_ofer, i18n.language, property.poblacion, property.foto]);

  const isRental = Number(property.keyacci) === 2;
  const displayPrice = isRental ? property.precioalq : property.precioinmo;
  const hasImages = extraData.images.length > 0;

  return (
    <article
      className="group bg-white flex flex-col min-h-[700px] h-full relative transition-all duration-1000 border border-stone-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- SECTION VISUELLE (IMAGE OU PLACEHOLDER) --- */}
      <div className="relative h-[380px] w-full overflow-hidden bg-[#f1ece1] shrink-0">
        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.img
              key={extraData.images[index]}
              src={extraData.images[index]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#333333]">
              <span className="font-playfair italic text-4xl tracking-[0.2em] text-gold opacity-100">
                DEM
              </span>
            </div>
          )}
        </AnimatePresence>

        {/* Flèches Slider */}
        {extraData.images.length > 1 && isHovered && (
          <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex(prev => (prev - 1 + extraData.images.length) % extraData.images.length); }}
              className="w-10 h-10 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex(prev => (prev + 1) % extraData.images.length); }}
              className="w-10 h-10 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="absolute top-6 left-6 z-20">
          <span className="bg-stone-900 text-white px-4 py-1.5 font-oswald text-[9px] uppercase tracking-[0.2em]">
            {isRental ? t('property.operation.rent') : t('property.operation.sale')}
          </span>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onPreview(property); }} 
          className="absolute top-6 right-6 w-10 h-10 bg-white/90 flex items-center justify-center text-stone-900 hover:bg-[#C5A059] hover:text-white transition-all z-30"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* --- SECTION CONTENU --- */}
      <div className="flex flex-col flex-1 p-6 md:p-8 bg-white">
        <div className="mb-4">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-oswald text-[18px] leading-[1.3] uppercase tracking-tight text-stone-900 line-clamp-3 flex-1 min-h-[48px]">
              {extraData.detailedTitle}
            </h3>
            <span className="font-oswald text-[9px] text-stone-300 uppercase tracking-widest mt-1.5 shrink-0">
              {t('property.ref')} {property.ref}
            </span>
          </div>
          <p className="font-playfair italic text-stone-400 text-sm flex items-center gap-2 uppercase tracking-wider truncate">
            <span className="w-4 h-[1px] bg-[#C5A059]/40" />
            {property.ciudad || property.poblacion}
          </p>
        </div>

        <div className="flex justify-between border-y border-stone-100 py-6 mt-auto">
          <SpecItem icon={<Bed size={16} />} value={property.total_hab} label={t('property.specs.beds')} />
          <SpecItem icon={<Bath size={16} />} value={property.banyos} label={t('property.specs.baths')} />
          <SpecItem icon={<Ruler size={16} />} value={property.m_cons} label={t('property.specs.size')} />
        </div>

        <div className="flex justify-between items-end pt-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-oswald">
              {isRental ? 'INVERSIÓN' : t('property.price.label')}
            </span>
            {Number(displayPrice) === 0 ? (
              <div className="flex items-center gap-2 text-[#C5A059] font-oswald text-[10px] uppercase tracking-widest">
                <PhoneCall size={12} /> {t('property.price.onRequest')}
              </div>
            ) : (
              <p className="text-2xl font-playfair italic text-stone-900 leading-none">
                {Number(displayPrice).toLocaleString()} <span className="text-base font-serif">€</span>
                {isRental && <span className="text-[10px] ml-1 text-stone-400 font-oswald uppercase">/ mo.</span>}
              </p>
            )}
          </div>

          <button 
            onClick={() => navigate(`/properties/${property.cod_ofer}`)} 
            className="flex items-center gap-3 font-oswald text-[10px] uppercase tracking-[0.3em] text-stone-900 group/btn shrink-0"
          >
            <span className="relative pb-1">
              {t('property.actions.viewDetails')}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-100 group-hover/btn:bg-[#C5A059] transition-colors duration-500" />
            </span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

const SpecItem = ({ icon, value, label }: { icon: React.ReactNode; value: any; label: string }) => (
  <div className="flex flex-col items-center flex-1">
    <div className="text-[#C5A059]/70 mb-1.5">{icon}</div>
    <span className="font-playfair text-base text-stone-800 font-medium">{value && value !== "0" ? value : "-"}</span>
    <span className="font-oswald text-[7px] uppercase tracking-[0.15em] text-stone-300 mt-1">{label}</span>
  </div>
);

export default PropertyCard;