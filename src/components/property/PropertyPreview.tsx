import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  X, ChevronLeft, ChevronRight, 
  Bed, Bath, Ruler, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "@/hooks/useProperties";

const globalCache: Record<string, { images: string[]; detailedTitle: string; fullDescription: string }> = {};

interface PropertyPreviewProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export const PropertyPreview: React.FC<PropertyPreviewProps> = ({ property, isOpen, onClose, lang }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  
  const [extraData, setExtraData] = useState({
    images: [] as string[],
    detailedTitle: property.poblacion || "Propiedad",
    fullDescription: "",
    loading: true
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchDetails = async () => {
      const langId = lang === 'es' ? '1' : '2';
      const cacheKey = `${property.cod_ofer}_${langId}`;

      if (globalCache[cacheKey]) {
        setExtraData({ ...globalCache[cacheKey], loading: false });
        return;
      }

      setExtraData(prev => ({ ...prev, loading: true }));

      try {
        const res = await fetch(`https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=detail&id=${property.cod_ofer}&lang=${langId}`);
        const result = await res.json();
        
        const ficha = result.ficha || {};
        const descObj = result.descripciones?.[property.cod_ofer]?.[langId] || {};
        const fotosObj = result.fotos?.[property.cod_ofer] || {};
        
        let gallery = Object.values(fotosObj).filter((url): url is string => 
          typeof url === 'string' && url.includes('http')
        );

        const finalData = {
          images: gallery,
          detailedTitle: descObj.titulo || ficha.titulo || property.poblacion || "Propiedad",
          fullDescription: descObj.descrip || ""
        };

        globalCache[cacheKey] = finalData;
        setExtraData({ ...finalData, loading: false });
      } catch (err) {
        setExtraData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDetails();
    // Reset index when opening new property
    setIndex(0);
  }, [isOpen, property.cod_ofer, lang]);

  if (!isOpen) return null;

  const isRental = Number(property.keyacci) === 2;
  const displayPrice = isRental ? property.precioalq : property.precioinmo;
  const hasImages = extraData.images.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Overlay - Ferme au clic */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm cursor-zoom-out"
      />
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FDFCFB] w-full max-w-7xl h-full md:h-auto max-h-[95vh] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 rounded-sm"
      >
        {/* Bouton Fermer */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] p-2 bg-white/10 backdrop-blur-md text-white md:text-stone-900 md:bg-white hover:bg-[#a5694f] hover:text-white transition-all rounded-full"
        >
          <X size={20} />
        </button>

        {/* SECTION GAUCHE : GALERIE OU FALLBACK */}
        <div className="relative lg:col-span-7 h-[35vh] md:h-[45vh] lg:h-[80vh] bg-[#f7f7f7] overflow-hidden">
          {extraData.loading ? (
            <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center">
              <div className="w-12 h-[1px] bg-[#a5694f]/30" />
            </div>
          ) : hasImages ? (
            <AnimatePresence mode="wait">
              <motion.img 
                key={extraData.images[index]}
                src={extraData.images[index]} 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover" 
                alt={extraData.detailedTitle} 
              />
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f7f7f7]">
              <span className="font-playfair italic text-6xl tracking-[0.2em] text-[#a5694f] opacity-30 select-none">
                DEM
              </span>
            </div>
          )}

          {/* Navigation Galerie */}
          {!extraData.loading && extraData.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 z-20">
              <button onClick={() => setIndex(prev => (prev - 1 + extraData.images.length) % extraData.images.length)} className="w-10 h-10 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setIndex(prev => (prev + 1) % extraData.images.length)} className="w-10 h-10 bg-black/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="absolute top-6 left-6 z-20">
            <span className="bg-stone-900 text-white px-4 py-1 font-oswald text-[8px] uppercase tracking-[0.2em]">
              {isRental ? t('property.operation.rent') : t('property.operation.sale')}
            </span>
          </div>
        </div>

        {/* SECTION DROITE : CONTENU */}
        <div className="lg:col-span-5 p-6 md:p-10 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-oswald text-[9px] text-[#a5694f] uppercase tracking-[0.3em]">
                  {t('property.ref')} {property.ref}
                </span>
                <h2 className="font-oswald text-2xl uppercase tracking-tight text-stone-900 leading-tight">
                  {extraData.loading ? "..." : extraData.detailedTitle}
                </h2>
                <p className="font-playfair italic text-stone-400 text-base">
                  {property.ciudad || property.poblacion}
                </p>
              </div>

              <div className="grid grid-cols-3 border-y border-stone-100 py-6">
                <SpecItemDetail icon={<Bed size={16} />} value={property.total_hab} label={t('property.specs.beds')} />
                <SpecItemDetail icon={<Bath size={16} />} value={property.banyos} label={t('property.specs.baths')} />
                <SpecItemDetail icon={<Ruler size={16} />} value={property.m_cons} label={t('property.specs.size')} />
              </div>

              {/* Description avec traduction dynamique */}
              <div className="text-stone-500 font-light leading-relaxed text-sm prose prose-stone">
                {extraData.loading ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-stone-50 w-full" />
                    <div className="h-3 bg-stone-50 w-5/6" />
                    <div className="h-3 bg-stone-50 w-4/6" />
                  </div>
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: extraData.fullDescription || t('property.preview.fallback_desc') 
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer fixe */}
          <div className="mt-6 pt-6 border-t border-stone-100 bg-white">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-oswald mb-1">
                  {isRental ? t('property.price.label') : t('property.price.label')}
                </span>
                <p className="text-3xl font-playfair italic text-stone-900 leading-none">
                  {Number(displayPrice) > 0 
                    ? `${Number(displayPrice).toLocaleString()} €` 
                    : t('property.price.onRequest')}
                  {isRental && Number(displayPrice) > 0 && (
                    <span className="text-xs ml-1 text-stone-400 font-oswald uppercase">
                      {t('property.price.perMonth')}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/properties/${property.cod_ofer}`)}
              className="w-full flex items-center justify-center gap-4 bg-stone-900 text-white py-5 font-oswald text-[10px] uppercase tracking-[0.3em] hover:bg-[#a5694f] transition-all group"
            >
              {t('property.actions.viewDetails')} 
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SpecItemDetail = ({ icon, value, label }: { icon: React.ReactNode; value: any; label: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-[#a5694f] mb-1.5">{icon}</div>
    <span className="font-playfair text-base text-stone-800 font-medium">{value && value !== "0" ? value : "-"}</span>
    <span className="font-oswald text-[7px] uppercase tracking-[0.1em] text-stone-300 mt-1">{label}</span>
  </div>
);