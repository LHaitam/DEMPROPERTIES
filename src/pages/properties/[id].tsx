import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  ChevronLeft,
  X,
  Heart,
  Share2,
  Ruler,
  Bed,
  Bath,
  MapPin,
  Info,
  Zap,
  ArrowRight,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Property } from "@/types/property";
import { mapInmovillaToProperty } from "@/lib/property-mapper";
import { fetchPropertyById } from "@/services/inmovillaApi";

/* =========================================================
   HELPERS
========================================================= */
function cleanDescription(description?: string) {
  if (!description || description === "No description available.") return "";
  return description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/* =========================================================
   PAGE
========================================================= */
export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<number | null>(null);

  /* CONTACT FORM */
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  /* HERO ANIMATION */
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smooth, [0, 0.3], [1, 1.08]);
  const heroOpacity = useTransform(smooth, [0, 0.35], [1, 0]);
  const textY = useTransform(smooth, [0, 0.35], [0, 90]);

  /* LOAD PROPERTY */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPropertyById(id, 1);
        const raw = data?.ficha?.[1];
        if (!raw) {
          setProperty(null);
          return;
        }
        setProperty(mapInmovillaToProperty(raw, data.descripciones, 1));
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    load();
    window.scrollTo({ top: 0 });
  }, [id]);

  /* FORM SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSending(true);
    try {
      await fetch("/api/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          reference: property.reference,
        }),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      alert(t("contact.form.error"));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="w-12 h-12 border border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center font-oswald uppercase tracking-widest text-stone-400">
        Property not found
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [property.mainImage];

  return (
    <main className="bg-[#FDFCFB] min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden bg-black">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src={property.mainImage}
            className="w-full h-full object-cover"
            alt={property.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </motion.div>

        <div className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-white font-oswald text-[10px] uppercase tracking-[0.4em]"
          >
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
              <ChevronLeft size={16} />
            </div>
            {t("back", "Retour")}
          </button>
          <div className="flex gap-6">
            <Share2 className="text-white/80" size={18} />
            <Heart className="text-white/80" size={18} />
          </div>
        </div>

        <motion.div
          style={{ y: textY }}
          className="absolute bottom-24 left-0 w-full px-8 md:px-24 z-20"
        >
          <p className="text-[#A47C3B] font-oswald tracking-[0.4em] uppercase text-xs mb-6">
            {property.location}
          </p>
          <h1 className="text-5xl md:text-8xl font-oswald uppercase text-white leading-[0.9] mb-6">
            {property.title}
          </h1>
          <p className="text-4xl md:text-6xl italic font-playfair text-[#A47C3B]">
            €{property.price.toLocaleString("fr-FR")}
          </p>
        </motion.div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-[1600px] mx-auto px-8 md:px-24 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-24">
          {/* STATS */}
          <div className="flex flex-wrap gap-x-20 gap-y-10 border-b pb-16">
            <Stat icon={<Ruler />} label="Surface" value={`${property.specs.size} m²`} />
            <Stat icon={<Bed />} label="Bedrooms" value={property.specs.beds} />
            <Stat icon={<Bath />} label="Bathrooms" value={property.specs.baths} />
            <Stat icon={<Zap />} label="Operation" value={property.operationLabel} />
          </div>

          {/* DESCRIPTION */}
          {cleanDescription(property.description) && (
            <p className="font-playfair italic text-2xl leading-relaxed text-stone-800">
              {cleanDescription(property.description)}
            </p>
          )}

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <Detail icon={<Building2 />} label="Property type" value={property.propertyType} />
            <Detail icon={<Info />} label="Reference" value={property.reference} />
            <Detail icon={<MapPin />} label="Location" value={property.location} />
            <Detail icon={<ShieldCheck />} label="Status" value={property.status} />
          </div>

          {/* GALLERY */}
          <div className="grid grid-cols-2 gap-8">
            {images.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`relative overflow-hidden ${
                  i === 0 ? "col-span-2 h-[600px]" : "h-[400px]"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                />
                {i === 0 && (
                  <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur px-6 py-3 text-white font-oswald text-[10px] tracking-[0.4em] uppercase">
                    {images.length} photos
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* RIGHT – FORM */}
        <div className="lg:col-span-5">
          <div className="sticky top-16 bg-white border p-14 shadow-sm">
            <h3 className="font-oswald text-2xl uppercase tracking-widest mb-10">
              Contact
            </h3>

            <form onSubmit={handleSubmit} className="space-y-10">
              <input
                required
                placeholder={t("contact.form.fields.name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b py-3 outline-none"
              />

              <input
                required
                type="email"
                placeholder={t("contact.form.fields.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b py-3 outline-none"
              />

              <textarea
                rows={3}
                placeholder={t("contact.form.fields.message")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border-b py-3 outline-none resize-none"
              />

              <button
                disabled={sending}
                className="w-full bg-black text-white py-6 uppercase font-oswald tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-[#A47C3B] transition"
              >
                {sending ? "…" : t("contact.form.submit")}
                <ArrowRight size={14} />
              </button>

              {sent && (
                <p className="text-sm italic text-green-700">
                  {t("contact.form.success")}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImg !== null && (
          <motion.div
            className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-8 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white">
              <X size={40} />
            </button>
            <motion.img
              src={images[selectedImg]}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================================
   SUB COMPONENTS
========================================================= */
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[#A47C3B]">{icon}</div>
      <p className="text-[9px] tracking-widest uppercase text-stone-400">{label}</p>
      <p className="font-oswald uppercase">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex justify-between border-b py-4">
      <div className="flex items-center gap-3 text-stone-400">
        {icon}
        <span className="font-oswald text-[10px] uppercase tracking-widest">
          {label}
        </span>
      </div>

      <span className="font-playfair italic text-lg text-stone-800">
        {value ?? "—"}
      </span>
    </div>
  );
}

