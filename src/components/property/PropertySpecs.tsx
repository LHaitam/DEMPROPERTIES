import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Hash, Sparkles, Home, MapPin, Maximize, Check,
  Shield, Calendar, Sun, Landmark, FileText, Zap 
} from "lucide-react";

interface PropertySpecsProps {
  property: any;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PropertySpecs: React.FC<PropertySpecsProps> = ({ property }) => {
  const { t } = useTranslation();

  // Mapping direct avec les clés API Inmovilla (Table x_entorno & viviendas)
  const AMENITIES_MAP = [
    { key: "aire_con", label: "property.amenities.airCond" },
    { key: "parking_inc", label: "property.amenities.garage" },
    { key: "m_terraza", label: "property.amenities.terrace" },
    { key: "ascensor", label: "property.amenities.elevator" },
    { key: "armarios", label: "property.amenities.wardrobes" },
    { key: "trastero", label: "property.amenities.storage" },
    { key: "puerta_blindada", label: "property.amenities.armoredDoor" },
    { key: "muebles", label: "property.amenities.furniture" },
    { key: "videoportero", label: "property.amenities.videoIntercom" },
    { key: "piscina_com", label: "property.amenities.pool" },
    { key: "luz", label: "property.amenities.light" },
    { key: "agua", label: "property.amenities.water" },
    { key: "parking", label: "property.amenities.parking" },
    { key: "barbacoa", label: "property.amenities.barbecue" },
    { key: "tv", label: "property.amenities.tv" },
    { key: "sala_juegos", label: "property.amenities.gamesRoom" },
    { key: "jardin", label: "property.amenities.garden" },
    { key: "adaptado_pmr", label: "property.amenities.adaptedPmr" },
    { key: "bomba_frio_calor", label: "property.amenities.heatPump" },
    { key: "vistas_despejadas", label: "property.amenities.clearViews" },
    { key: "zona_verde", label: "property.amenities.greenArea" },
    { key: "vigilancia_24h", label: "property.amenities.surveillance" },
    { key: "arboles", label: "property.amenities.trees" },
    { key: "centros_comerciales", label: "property.amenities.shopping" },
    { key: "zona_costera", label: "property.amenities.coastal" },
    { key: "golf", label: "property.amenities.golf" },
  ];

  const specGroups = [
    {
      title: t('propertyDetail.features'),
      items: [
        { label: t('propertyDetail.reference'), value: property.ref, icon: <Hash size={16} /> },
        { label: t('propertyDetail.operation'), value: property.acciones, icon: <Sparkles size={16} /> },
        { label: t('propertyDetail.type'), value: property.nbtipo, icon: <Home size={16} /> },
        { label: t('propertyDetail.zone'), value: property.zona ? `${property.zona} / ${property.ciudad}` : property.ciudad, icon: <MapPin size={16} /> },
      ]
    },
    {
      title: "Detalles Técnicos",
      items: [
        { label: t('propertyDetail.builtSurface'), value: property.m_cons ? `${property.m_cons} m²` : '-', icon: <Maximize size={16} /> },
        { label: t('propertyDetail.conservation'), value: property.nbconservacion, icon: <Shield size={16} /> },
        { label: t('propertyDetail.antiquity'), value: property.antiguedad ? `${property.antiguedad} ${t('property.specs.years')}` : '-', icon: <Calendar size={16} /> },
        { label: t('propertyDetail.exteriorType'), value: property.tipo_ext || 'Exterior', icon: <Sun size={16} /> },
      ]
    },
    {
      title: "Administración",
      items: [
        { label: t('propertyDetail.ibi'), value: property.ibi ? `${property.ibi} €` : '-', icon: <Landmark size={16} /> },
        { label: t('propertyDetail.regime'), value: property.nbestatuto || 'Libre', icon: <FileText size={16} /> },
      ]
    }
  ];

  // Vérifie si la valeur de l'API est positive ou égale à "S"
  const checkAmenity = (val: any) => {
    if (!val) return false;
    return val === "S" || val === 1 || val === "1" || (typeof val === 'number' && val > 0);
  };

  return (
    <div className="space-y-24">
      {/* Sections Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
        {specGroups.map((group, idx) => (
          <motion.div key={idx} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            <h4 className="font-oswald text-[11px] uppercase tracking-[0.3em] text-[#C5A059] border-b border-stone-100 pb-3 font-bold">
              {group.title}
            </h4>
            <ul className="space-y-4">
              {group.items.map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2 transition-colors group">
                  <div className="flex items-center gap-3 text-stone-400 group-hover:text-stone-600 transition-colors">
                    <span className="text-[#C5A059]/60">{item.icon}</span>
                    <span className="font-oswald text-[10px] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="font-medium text-stone-900">{item.value || "-"}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Grid des Checkboxes (Amenities) */}
      <section className="space-y-10">
        <h4 className="font-oswald text-[11px] uppercase tracking-[0.3em] text-stone-900 font-bold border-l-4 border-[#C5A059] pl-4">
          {t('property.amenitiesTitle')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
          {AMENITIES_MAP.map((item, index) => {
            const isAvailable = checkAmenity(property[item.key]);
            return (
              <div key={index} className={`flex items-center gap-3 transition-all duration-500 ${isAvailable ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isAvailable ? 'bg-[#C5A059] border-[#C5A059]' : 'border-stone-200'}`}>
                  {isAvailable && <Check size={12} className="text-white" />}
                </div>
                <span className={`font-oswald text-[10px] uppercase tracking-widest ${isAvailable ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
                  {t(item.label)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificat Énergie */}
      <motion.div variants={itemVariants} initial="hidden" whileInView="visible" className="bg-stone-50 p-8 rounded-sm border border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Zap size={20} className="text-[#C5A059]" />
          </div>
          <div>
            <h5 className="font-oswald text-[10px] uppercase tracking-widest text-stone-400">{t('propertyDetail.energyCert')}</h5>
            <p className="text-stone-600 text-sm italic">{t('property.energy_desc')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letra) => (
            <div key={letra} className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-sm transition-all ${property.energialetra?.toUpperCase() === letra ? 'bg-stone-900 text-white scale-110 shadow-md ring-2 ring-[#C5A059]' : 'bg-white text-stone-300'}`}>
              {letra}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PropertySpecs;