import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Share2, MapPin, Bed, Bath, Ruler,
  ShieldCheck, ExternalLink, Printer
} from "lucide-react";

import PropertyGallery from "@/components/property/PropertyGallery";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyMap from "@/components/property/PropertyMap";
import PropertyContactForm from "@/components/property/PropertyContactForm";

import type { Property } from "@/hooks/useProperties";

// Extension de l'interface pour matcher l'API Inmovilla
interface PropertyExtended extends Omit<Property, 'zona' | 'nbtipo' | 'ciudad' | 'precioinmo' | 'total_hab' | 'banyos' | 'm_cons'> {
  titulo?: string;
  descrip?: string;
  fotos_list?: string[];
  nbconservacion?: string;
  zona: string;
  nbtipo: string;
  ciudad: string;
  antiguedad?: number;
  ibi?: string | number;
  energialetra?: string;
  acciones?: string;
  precioinmo?: string | number;
  total_hab?: string | number;
  banyos?: string | number;
  m_cons?: string | number;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [property, setProperty] = useState<PropertyExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const langId = i18n.language.startsWith('en') ? '2' : '1';
        const res = await fetch(`https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=detail&id=${id}&lang=${langId}`);
        const result = await res.json();
        
        if (result?.ficha?.[1]) {
          const ficha = result.ficha[1];
          const descData = result.descripciones?.[id];
          const translation = descData?.[langId] || descData?.['1'] || {};

          setProperty({
            ...ficha,
            titulo: translation.titulo || "Exclusive Property",
            descrip: translation.descrip || "",
            fotos_list: result.fotos?.[id] || [],
            zona: ficha.zona || "",
            nbtipo: ficha.nbtipo || "Residence",
            ciudad: ficha.ciudad || ""
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id, i18n.language]);

  
  // Définition des onglets traduits
  const tabs = useMemo(() => [
    { id: "overview", label: t('propertyDetail.tabs.description', 'Description') },
    { id: "details", label: t('propertyDetail.tabs.details', 'Details') },
    { id: "location", label: t('propertyDetail.tabs.location', 'Location') },
  ], [t]);

  if (loading || !property) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCFCFB]">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-playfair italic text-stone-400 tracking-[0.3em] uppercase text-[10px]"
        >
          Loading Experience...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-stone-900 font-light">
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-stone-100 p-6 flex justify-between items-center px-8 md:px-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-oswald text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} /> {t('nav.home')}
        </button>
        <div className="flex items-center gap-8">
          <Share2 size={16} className="text-stone-300 hover:text-stone-900 cursor-pointer transition-colors" />
          <button className="bg-stone-900 text-white px-8 py-2.5 text-[9px] font-oswald uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all">
            {t('propertyDetail.contact', 'Enquire')}
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 md:px-12">

        {/* --- HEADER RAFFINÉ --- */}
        <header className="mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6 text-[#C5A059] font-oswald text-[10px] uppercase tracking-[0.5em] font-bold"
          >
            <span>Ref. {property.ref}</span>
            <span className="w-8 h-[1px] bg-stone-200"></span>
            <span>{property.nbtipo}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-playfair italic text-stone-900 leading-[1.1] mb-8"
          >
            {property.titulo}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-stone-400 font-playfair italic text-xl"
          >
            <MapPin size={18} className="text-[#C5A059]/60" />
            <span>{property.zona}, {property.ciudad}</span>
          </motion.div>
        </header>

        {/* --- GALLERY --- */}
        <section className="mb-20">
          <PropertyGallery property={property as any} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* --- COLONNE GAUCHE: CONTENU --- */}
          <div className="lg:col-span-8">

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 py-10 border-y border-stone-100 mb-16">
              <QuickStat icon={Bed} value={property.total_hab} label={t('property.beds', 'Beds')} />
              <QuickStat icon={Bath} value={property.banyos} label={t('property.baths', 'Baths')} />
              <QuickStat icon={Ruler} value={`${property.m_cons} m²`} label={t('property.built', 'Area')} />
              <QuickStat icon={ShieldCheck} value={property.nbconservacion} label={t('property.status', 'Status')} />
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-12 border-b border-stone-100 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-6 font-oswald text-[11px] uppercase tracking-[0.4em] transition-all relative ${activeTab === tab.id ? "text-stone-900" : "text-stone-300 hover:text-stone-500"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    key="overview"
                    className="prose prose-stone max-w-none text-stone-500 font-serif italic text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: property.descrip || "" }}
                  />
                )}

                {activeTab === "details" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="details">
                    <PropertySpecs property={property as any} />
                  </motion.div>
                )}

                {activeTab === "location" && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="location"
                    className="h-[550px] rounded-sm overflow-hidden border border-stone-100 grayscale hover:grayscale-0 transition-all duration-700 contrast-[1.05]"
                  >
                    <PropertyMap property={property as any} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --- COLONNE DROITE: SIDEBAR --- */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-10">

              {/* Price Box */}
              <div className="p-10 bg-white border border-stone-100 shadow-[20px_20px_60px_rgba(0,0,0,0.02)]">
                <div className="mb-10 pb-8 border-b border-stone-50">
                  <span className="font-oswald text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-3">
                    {t('property.investment', 'Investment')}
                  </span>
                  <p className="text-4xl font-playfair italic text-stone-900">
                    {property.precioinmo && Number(property.precioinmo) > 0
                      ? `${Number(property.precioinmo).toLocaleString()} €`
                      : t('property.priceOnRequest', 'Price on Request')}
                  </p>
                </div>

                {/* Formulaire avec injection de la Ref et du Prix */}
                <PropertyContactForm
                  propertyRef={property.ref}
                  propertyPrice={property.precioinmo}
                />
              </div>

              {/* Secondary Actions */}
              <div className="space-y-3">
                <SidebarAction icon={Printer} label={t('propertyDetail.print', 'Print Fact Sheet')} />
                <SidebarAction icon={ExternalLink} label={t('propertyDetail.virtualTour', 'Virtual Tour 360°')} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// --- SOUS-COMPOSANTS INTERNES ---

const QuickStat = ({ icon: Icon, value, label }: { icon: any, value: any, label: string }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="text-[#C5A059]/40">
      <Icon size={22} strokeWidth={1} />
    </div>
    <div>
      <span className="block text-xl font-playfair text-stone-800 mb-1">{value || "—"}</span>
      <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold">{label}</span>
    </div>
  </div>
);

const SidebarAction = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center justify-between p-5 border border-stone-100 text-[9px] font-oswald uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 hover:bg-white transition-all group">
    <span className="flex items-center gap-4">
      <Icon size={14} className="group-hover:text-[#C5A059] transition-colors" />
      {label}
    </span>
    <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
      <ArrowLeft size={12} className="rotate-180 opacity-30" />
    </motion.div>
  </button>
);

export default PropertyDetails;