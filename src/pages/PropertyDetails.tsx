import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronLeft,
  ArrowRight,
  Bed,
  Bath,
  Ruler,
  Share2,
} from "lucide-react";

import type { Property } from "@/types/property";
import { fetchPropertyById } from "@/services/inmovillaApi";
import { mapInmovillaToProperty } from "@/lib/property-mapper";

type Section = "story" | "specs" | "gallery" | "location";

/* =========================================================
   HELPERS
========================================================= */
function cleanDescription(description?: string) {
  if (!description) {
    return "This property offers a refined lifestyle opportunity with strong investment value.";
  }

  return description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   COMPONENT
========================================================= */
export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("story");
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PROPERTY ================= */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPropertyById(id);

        const raw = data?.ficha?.[1] ?? null;

        if (!raw) {
          setProperty(null);
          return;
        }

        setProperty(
          mapInmovillaToProperty(
            raw,
            data.descripciones, // ✅ DESCRIPTIONS INMOVILLA
            1
          )
        );
      } catch (error) {
        console.error("Property detail error:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    load();
    window.scrollTo({ top: 0 });
  }, [id]);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0F0F]">
        <span className="font-oswald tracking-[0.4em] text-[#C5A059] uppercase text-[10px]">
          Loading property
        </span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center font-oswald uppercase tracking-widest text-gray-400">
        Property not found
      </div>
    );
  }

  const images =
    property.images.length > 0
      ? property.images
      : property.mainImage
      ? [property.mainImage]
      : [];

  const sections = [
    { id: "story", label: "The Story" },
    { id: "specs", label: "Details" },
    { id: "gallery", label: "Collection" },
    { id: "location", label: "Lifestyle" },
  ];

  /* ================= VIEW ================= */
  return (
    <div className="h-screen w-full bg-[#0F0F0F] flex overflow-hidden pt-[80px]">

      {/* LEFT – IMMERSIVE VISUAL */}
      <section className="relative w-[60%] h-full hidden lg:block overflow-hidden border-r border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={images[currentImg]}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-12 left-12">
          <h1 className="text-white font-oswald text-7xl uppercase leading-none mb-4">
            {property.title}
          </h1>
          <div className="flex items-center gap-3 text-white/60 italic">
            <MapPin size={18} className="text-[#C5A059]" />
            {property.location}
          </div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className={`w-12 h-12 border-2 transition ${
                currentImg === i
                  ? "border-[#C5A059] scale-110"
                  : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* RIGHT – CONTENT */}
      <aside className="w-full lg:w-[40%] bg-white h-full flex flex-col">

        {/* NAV */}
        <nav className="flex border-b border-gray-100">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as Section)}
              className={`flex-1 py-8 font-oswald text-[10px] uppercase tracking-[0.3em] ${
                activeSection === s.id
                  ? "text-[#C5A059]"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12">

          {/* STORY */}
          {activeSection === "story" && (
            <div className="space-y-6">
              <h2 className="text-4xl font-playfair italic">
                A residence that redefines the art of living
              </h2>
              <p className="font-playfair text-xl text-gray-500 leading-relaxed">
                {cleanDescription(property.description)}
              </p>
            </div>
          )}

          {/* SPECS */}
          {activeSection === "specs" && (
            <div className="grid gap-8">
              {[
                { icon: <Bed />, label: "Bedrooms", value: property.specs.beds },
                { icon: <Bath />, label: "Bathrooms", value: property.specs.baths },
                { icon: <Ruler />, label: "Surface", value: `${property.specs.size} m²` },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-[#C5A059]">
                    {s.icon}
                    <span className="uppercase text-xs tracking-widest text-gray-600">
                      {s.label}
                    </span>
                  </div>
                  <span className="font-oswald text-2xl">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* GALLERY */}
          {activeSection === "gallery" && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-40 w-full object-cover cursor-pointer"
                  onClick={() => setCurrentImg(i)}
                />
              ))}
            </div>
          )}

          {/* LOCATION */}
          {activeSection === "location" && (
            <div className="text-center space-y-4">
              <MapPin size={48} className="mx-auto text-[#C5A059]" />
              <h3 className="font-oswald uppercase text-2xl">
                {property.location}
              </h3>
              <p className="italic text-gray-500">
                Discover the exclusive surroundings of this prestigious property.
              </p>
            </div>
          )}

        </div>

        {/* CTA */}
        <div className="p-8 border-t bg-gray-50">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Price
              </p>
              <p className="text-4xl font-playfair italic text-[#C5A059]">
                € {property.price.toLocaleString()}
              </p>
            </div>
            <Share2 className="text-gray-400 hover:text-[#C5A059]" />
          </div>

          <button className="w-full bg-black text-white py-5 font-oswald uppercase tracking-[0.3em] hover:bg-[#C5A059] transition">
            Book a private showing
            <ArrowRight className="inline ml-3" size={16} />
          </button>
        </div>

      </aside>

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-8 bg-black/30 text-white p-4 rounded-full hover:bg-[#C5A059] transition"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
}
