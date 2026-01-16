import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Share2, MapPin, Bed, Bath, Ruler,
  ShieldCheck
} from "lucide-react";

import PropertyGallery from "@/components/property/PropertyGallery";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyMap from "@/components/property/PropertyMap";
import PropertyContactForm from "@/components/property/PropertyContactForm";

import type { Property } from "@/hooks/useProperties";

// Interface étendue pour inclure les champs dynamiques de l'API
// Ajoutez 'precioalq' dans le Omit pour lever le conflit
interface PropertyExtended extends Omit<Property, 
  'zona' | 'nbtipo' | 'ciudad' | 'precioinmo' | 'total_hab' | 'banyos' | 'm_cons' | 'precioalq'
> {
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
  preciorent?: string | number;
  // Maintenant vous pouvez définir precioalq comme vous le souhaitez
  precioalq?: string | number; 
  total_hab?: string | number;
  banyos?: string | number;
  m_cons?: string | number;
  ref: string;
  lat?: number;
  lng?: number;
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
        const apiLang = i18n.language.startsWith('en') ? '2' : '1';
        const url = `https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=detail&id=${id}&lang=${apiLang}`;
        const res = await fetch(url);
        const result = await res.json();
        
        if (result?.ficha?.[1]) {
          const ficha = result.ficha[1];
          const descData = result.descripciones?.[id];
          const translation = descData?.[apiLang] || descData?.['1'] || {};

          setProperty({
            ...ficha,
            ref: ficha.ref || id, 
            titulo: translation.titulo || ficha.nbtipo || t('property.gallery.default_title'),
            descrip: translation.descrip || "",
            fotos_list: result.fotos?.[id] || [],
            zona: ficha.zona || "",
            nbtipo: ficha.nbtipo || "Residence",
            ciudad: ficha.ciudad || "",
            lat: ficha.latitud ? parseFloat(ficha.latitud) : undefined, 
            lng: ficha.altitud ? parseFloat(ficha.altitud) : undefined
          });
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id, i18n.language, t]);

  const priceInfo = useMemo(() => {
    if (!property) return { formatted: "", raw: 0 };
    const salePrice = String(property.precioinmo || "").replace(/\D/g, "");
    const rentPrice = String(property.preciorent || property.precioalq || "").replace(/\D/g, "");
    const nSale = parseInt(salePrice, 10);
    const nRent = parseInt(rentPrice, 10);

    if (!isNaN(nSale) && nSale > 0) return { formatted: `${nSale.toLocaleString()} €`, raw: nSale };
    if (!isNaN(nRent) && nRent > 0) return { formatted: `${nRent.toLocaleString()} € ${t('property.price.perMonth')}`, raw: nRent };
    return { formatted: t('property.price.onRequest'), raw: 0 };
  }, [property, t]);

  const defaultMessage = useMemo(() => {
    if (!property) return "";
    return t('contact.form.defaultMessage', { ref: property.ref, price: priceInfo.formatted });
  }, [property, priceInfo, t]);

  const tabs = useMemo(() => [
    { id: "overview", label: t('propertyDetail.tabs.description') },
    { id: "details", label: t('propertyDetail.tabs.details') },
    { id: "location", label: t('propertyDetail.tabs.location') },
  ], [t]);

  if (loading || !property) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCFCFB]">
        <div className="font-playfair italic text-stone-400 tracking-[0.3em] uppercase text-[10px]">
          {t('home.loading')}
        </div>
      </div>
    );
  }

  const seoTitle = `${property.titulo} | Ref: ${property.ref} | Marbella Real Estate`;
  const seoDescription = `${property.nbtipo} à ${property.zona}, ${property.ciudad}. ${property.total_hab} chambres, ${property.banyos} sdb, ${property.m_cons} m². Découvrez cette opportunité exclusive.`;

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-stone-900 font-light">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://demproperties.es/properties/${id}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:image" content={property.fotos_list?.[0]} />
      </Helmet>

      <nav className="fixed top-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-stone-100 p-6 flex justify-between items-center px-8 md:px-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-oswald text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors">
          <ArrowLeft size={14} /> {t('nav.properties')}
        </button>
        <div className="flex items-center gap-8">
          <Share2 size={16} className="text-stone-300 hover:text-stone-900 cursor-pointer transition-colors" />
          <button 
            onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-stone-900 text-white px-8 py-2.5 text-[9px] font-oswald uppercase tracking-[0.2em] hover:bg-[#a5694f] transition-all"
          >
            {t('propertyDetail.contact')}
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 md:px-12">
        <header className="mb-16 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6 text-[#a5694f] font-oswald text-[10px] uppercase tracking-[0.5em] font-bold">
            <span>{t('property.ref')} {property.ref}</span>
            <span className="w-8 h-[1px] bg-stone-200"></span>
            <span>{property.nbtipo}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair italic text-stone-900 leading-[1.1] mb-8">{property.titulo}</h1>
          <div className="flex items-center justify-center gap-2 text-stone-400 font-playfair italic text-xl">
            <MapPin size={18} className="text-[#a5694f]/60" />
            <span>{property.zona}, {property.ciudad}</span>
          </div>
        </header>

        <section className="mb-20">
          <PropertyGallery property={property as any} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-10 border-y border-stone-100 mb-16">
              <QuickStat icon={Bed} value={property.total_hab} label={t('property.specs.beds')} />
              <QuickStat icon={Bath} value={property.banyos} label={t('property.specs.baths')} />
              <QuickStat icon={Ruler} value={`${property.m_cons} m²`} label={t('propertyDetail.builtSurface')} />
              <QuickStat icon={ShieldCheck} value={property.nbconservacion} label={t('propertyDetail.conservation')} />
            </div>

            <div className="flex gap-12 border-b border-stone-100 mb-12 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-6 font-oswald text-[11px] uppercase tracking-[0.4em] transition-all whitespace-nowrap relative ${activeTab === tab.id ? "text-stone-900" : "text-stone-300 hover:text-stone-500"}`}>
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#a5694f]" />}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="prose prose-stone max-w-none text-stone-500 font-serif italic text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: property.descrip || "" }} />
                )}
                {activeTab === "details" && <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PropertySpecs property={property as any} /></motion.div>}
                {activeTab === "location" && <motion.div key="location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[550px] rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"><PropertyMap property={property as any} /></motion.div>}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-4" id="contact-section">
            <div className="sticky top-32">
              <div className="p-10 bg-white border border-stone-100 shadow-sm">
                <div className="mb-10 pb-8 border-b border-stone-50">
                  <span className="font-oswald text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-3">{t('property.price.label')}</span>
                  <p className="text-4xl font-playfair italic text-stone-900">{priceInfo.formatted}</p>
                </div>
                <PropertyContactForm 
                  propertyRef={property.ref} 
                  propertyPrice={priceInfo.formatted} 
                  defaultMessage={defaultMessage}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const QuickStat = ({ icon: Icon, value, label }: { icon: any, value: any, label: string }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="text-[#a5694f]/40"><Icon size={22} strokeWidth={1} /></div>
    <div>
      <span className="block text-xl font-playfair text-stone-800 mb-1">{value || "—"}</span>
      <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold">{label}</span>
    </div>
  </div>
);

export default PropertyDetails;