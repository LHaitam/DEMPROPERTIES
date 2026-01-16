import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  ShieldCheck,
  PlayCircle,
  Info,
  List,
  Map as MapIcon,
} from "lucide-react";

import PropertyGallery from "@/components/property/PropertyGallery";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyMap from "@/components/property/PropertyMap";
import PropertyContactForm from "@/components/property/PropertyContactForm";

import type { Property } from "@/hooks/useProperties";

interface PropertyExtended
  extends Omit<
    Property,
    "zona" | "nbtipo" | "ciudad" | "precioinmo" | "total_hab" | "banyos" | "m_cons" | "precioalq"
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
  precioalq?: string | number;

  total_hab?: string | number;
  banyos?: string | number;
  m_cons?: string | number;

  ref: string;
  lat?: number;
  lng?: number;

  // Inmovilla renvoie video = 1 ou 0 (flag)
  video?: number | string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [property, setProperty] = useState<PropertyExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Video player states
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFallbackTried, setVideoFallbackTried] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setVideoSrc(null);
      setVideoFallbackTried(false);

      try {
        const apiLang = i18n.language.startsWith("en") ? "2" : "1";
        const url = `https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=detail&id=${id}&lang=${apiLang}`;

        const res = await fetch(url);
        const result = await res.json();

        if (result?.ficha?.[1]) {
          const ficha = result.ficha[1];
          const descData = result.descripciones?.[id];
          const translation = descData?.[apiLang] || descData?.["1"] || {};

          setProperty({
            ...ficha,
            ref: ficha.ref || id,
            titulo: translation.titulo || ficha.nbtipo || t("property.gallery.default_title"),
            descrip: translation.descrip || "",
            fotos_list: result.fotos?.[id] || [],
            zona: ficha.zona || "",
            nbtipo: ficha.nbtipo || "Residence",
            ciudad: ficha.ciudad || "",
            lat: ficha.latitud ? parseFloat(ficha.latitud) : undefined,
            lng: ficha.altitud ? parseFloat(ficha.altitud) : undefined,
            video: ficha.video,
          });

          // IMPORTANT :
          // CORS empêche de tester les fichiers vidéo avec fetch()
          // Donc on génère l'URL et on laisse le <video> tenter de lire.
          if (Number(ficha.video) === 1) {
            const agency = ficha.numagencia || 11931;
            const base = `https://media.inmovilla.com/videos/${agency}/${ficha.cod_ofer}`;

            // on tente mp4 en premier (le plus compatible)
            setVideoSrc(`${base}.mp4`);
          }
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

  const hasVideoFlag = useMemo(() => {
    return Number(property?.video) === 1;
  }, [property?.video]);

  // Tabs: afficher Video si video=1
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: "overview", label: t("propertyDetail.tabs.description"), icon: Info },
      { id: "details", label: t("propertyDetail.tabs.details"), icon: List },
    ];

    if (hasVideoFlag) {
      baseTabs.push({ id: "video", label: t("propertyDetail.tabs.video"), icon: PlayCircle });
    }

    baseTabs.push({ id: "location", label: t("propertyDetail.tabs.location"), icon: MapIcon });
    return baseTabs;
  }, [t, hasVideoFlag]);

  const priceInfo = useMemo(() => {
    if (!property) return { formatted: "", raw: 0 };

    const salePrice = String(property.precioinmo || "").replace(/\D/g, "");
    const rentPrice = String(property.preciorent || property.precioalq || "").replace(/\D/g, "");

    const nSale = parseInt(salePrice, 10);
    const nRent = parseInt(rentPrice, 10);

    if (!isNaN(nSale) && nSale > 0) return { formatted: `${nSale.toLocaleString()} €`, raw: nSale };
    if (!isNaN(nRent) && nRent > 0)
      return { formatted: `${nRent.toLocaleString()} € ${t("property.price.perMonth")}`, raw: nRent };

    return { formatted: t("property.price.onRequest"), raw: 0 };
  }, [property, t]);

  const defaultMessage = useMemo(() => {
    if (!property) return "";
    return t("contact.form.defaultMessage", { ref: property.ref, price: priceInfo.formatted });
  }, [property, priceInfo, t]);

  // si user est sur video mais pas de flag -> retour overview
  useEffect(() => {
    if (activeTab === "video" && !hasVideoFlag) {
      setActiveTab("overview");
    }
  }, [activeTab, hasVideoFlag]);

  if (loading || !property) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCFCFB]">
        <div className="font-playfair italic text-stone-400 tracking-[0.3em] uppercase text-[10px]">
          {t("home.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-stone-900 font-light">
      <Helmet>
        <title>{`${property.titulo} | DEM Properties`}</title>
      </Helmet>

      <nav className="fixed top-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-stone-100 p-4 md:p-6 flex justify-between items-center px-4 md:px-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-oswald text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} /> {t("nav.properties")}
        </button>

        <div className="flex items-center gap-4 md:gap-8">
          <Share2 size={16} className="text-stone-300 hover:text-stone-900 cursor-pointer hidden sm:block" />
          <button
            onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-stone-900 text-white px-6 md:px-8 py-2.5 text-[9px] font-oswald uppercase tracking-[0.2em] hover:bg-[#a5694f] transition-all"
          >
            {t("propertyDetail.contact")}
          </button>
        </div>
      </nav>

      <main className="pt-24 md:pt-32 pb-32 max-w-[1400px] mx-auto px-4 md:px-12">
        <header className="mb-12 md:mb-16 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-[#a5694f] font-oswald text-[10px] uppercase tracking-[0.5em] font-bold">
            <span>
              {t("property.ref")} {property.ref}
            </span>
            <span className="w-8 h-[1px] bg-stone-200"></span>
            <span>{property.nbtipo}</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-playfair italic text-stone-900 leading-[1.2] md:leading-[1.1] mb-6 md:mb-8">
            {property.titulo}
          </h1>

          <div className="flex items-center justify-center gap-2 text-stone-400 font-playfair italic text-lg md:text-xl">
            <MapPin size={18} className="text-[#a5694f]/60" />
            <span>
              {property.zona}, {property.ciudad}
            </span>
          </div>
        </header>

        <section className="mb-12 md:mb-20">
          <PropertyGallery property={property as any} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-stone-100 mb-12 md:mb-16">
              <QuickStat icon={Bed} value={property.total_hab} label={t("property.specs.beds")} />
              <QuickStat icon={Bath} value={property.banyos} label={t("property.specs.baths")} />
              <QuickStat icon={Ruler} value={`${property.m_cons} m²`} label={t("propertyDetail.builtSurface")} />
              <QuickStat icon={ShieldCheck} value={property.nbconservacion} label={t("propertyDetail.conservation")} />
            </div>

            {/* TABS */}
            <div className="mb-12">
              <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap border-b border-stone-100 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 py-4 md:py-6 px-3 md:px-0 font-oswald uppercase transition-all duration-300
                      ${activeTab === tab.id
                        ? "text-stone-900"
                        : "text-stone-400 hover:text-stone-700"
                      }`}
                  >
                    <tab.icon
                      size={14}
                      className={activeTab === tab.id ? "text-[#a5694f]" : "text-stone-300"}
                    />

                    <span className="text-[10px] md:text-[11px] tracking-[0.35em]">
                      {tab.label}
                    </span>

                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabLine"
                        className="absolute bottom-0 left-2 right-2 md:left-0 md:right-0 h-[2px] bg-[#a5694f]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>


            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="prose prose-stone max-w-none text-stone-500 font-serif italic text-lg md:text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: property.descrip || "" }}
                  />
                )}

                {activeTab === "details" && (
                  <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <PropertySpecs property={property as any} />
                  </motion.div>
                )}

                {activeTab === "video" && hasVideoFlag && (
                  <motion.div key="video" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* si video=1 mais pas d'url -> message */}
                    {!videoSrc && (
                      <div className="p-10 bg-white border border-stone-100 rounded-sm text-center">
                        <p className="font-playfair italic text-stone-500 text-lg md:text-xl">
                          {t("propertyDetail.videoNotAvailable", "Aucune vidéo disponible pour ce bien.")}
                        </p>
                      </div>
                    )}

                    {/* player */}
                    {videoSrc && (
                      <div className="relative aspect-video w-full bg-stone-100 rounded-sm overflow-hidden shadow-2xl">
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => {
                            // fallback: si mp4 fail -> mov
                            if (!videoFallbackTried && videoSrc.endsWith(".mp4")) {
                              setVideoFallbackTried(true);
                              setVideoSrc(videoSrc.replace(".mp4", ".mov"));
                              return;
                            }

                            // si mov fail aussi -> plus rien
                            setVideoSrc(null);
                          }}
                        >
                          <source
                            src={videoSrc}
                            type={videoSrc.endsWith(".mov") ? "video/quicktime" : "video/mp4"}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {/* message si mp4+mov échouent */}
                    {!videoSrc && (
                      <div className="mt-6 p-10 bg-white border border-stone-100 rounded-sm text-center">
                        <p className="font-playfair italic text-stone-500 text-lg md:text-xl">
                          {t("propertyDetail.videoNotAvailable", "Aucune vidéo disponible pour ce bien.")}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "location" && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[400px] md:h-[550px] rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-inner"
                  >
                    <PropertyMap property={property as any} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-4" id="contact-section">
            <div className="lg:sticky lg:top-32">
              <div className="p-6 md:p-10 bg-white border border-stone-100 shadow-sm rounded-sm">
                <div className="mb-8 md:mb-10 pb-6 md:pb-8 border-b border-stone-50">
                  <span className="font-oswald text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-3">
                    {t("property.price.label")}
                  </span>
                  <p className="text-3xl md:text-4xl font-playfair italic text-stone-900">{priceInfo.formatted}</p>
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

const QuickStat = ({ icon: Icon, value, label }: { icon: any; value: any; label: string }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="text-[#a5694f]/40 transition-transform group-hover:scale-110">
      <Icon size={22} strokeWidth={1} />
    </div>
    <div>
      <span className="block text-lg md:text-xl font-playfair text-stone-800 mb-1">{value || "—"}</span>
      <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold whitespace-nowrap">
        {label}
      </span>
    </div>
  </div>
);

export default PropertyDetails;
