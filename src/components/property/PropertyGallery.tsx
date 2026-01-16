import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // 1. Import i18n
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, Parallax } from "swiper/modules";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "@/hooks/useProperties";
import type { Swiper as SwiperType } from "swiper";

interface PropertyGalleryProps {
  property: Property & {
    fotos_list?: string[];
    titulo?: string;
  };
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ property }) => {
  const { t } = useTranslation(); // 2. Hook de traduction
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [fsSwiper, setFsSwiper] = useState<SwiperType | null>(null);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const fsPrevRef = useRef<HTMLButtonElement | null>(null);
  const fsNextRef = useRef<HTMLButtonElement | null>(null);

  const images = useMemo(() => {
    const list = property.fotos_list && property.fotos_list.length > 0
        ? property.fotos_list
        : [property.foto];
    return list.filter(Boolean);
  }, [property.fotos_list, property.foto]);

  useEffect(() => {
    if (!isFullscreen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    if (isFullscreen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  // Navigation Logic
  useEffect(() => {
    if (mainSwiper && prevRef.current && nextRef.current) {
      // @ts-expect-error navigation params
      mainSwiper.params.navigation.prevEl = prevRef.current;
      // @ts-expect-error navigation params
      mainSwiper.params.navigation.nextEl = nextRef.current;
      mainSwiper.navigation.init();
      mainSwiper.navigation.update();
    }
  }, [mainSwiper]);

  useEffect(() => {
    if (fsSwiper && fsPrevRef.current && fsNextRef.current) {
      // @ts-expect-error navigation params
      fsSwiper.params.navigation.prevEl = fsPrevRef.current;
      // @ts-expect-error navigation params
      fsSwiper.params.navigation.nextEl = fsNextRef.current;
      fsSwiper.navigation.init();
      fsSwiper.navigation.update();
    }
  }, [fsSwiper]);

  return (
    <>
      <div className="relative group w-full h-[52vh] md:h-[75vh] bg-stone-100 overflow-hidden rounded-2xl border border-stone-100/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.55)]">
        <Swiper
          modules={[Navigation, Autoplay, EffectFade, Parallax]}
          onSwiper={setMainSwiper}
          effect="fade"
          speed={1100}
          parallax
          autoplay={{ delay: 5200, disableOnInteraction: false }}
          loop={images.length > 1}
          className="h-full w-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={property.titulo || "Property"}
                className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-[2800ms] ease-out"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <div className="hidden md:block">
            <button ref={prevRef} className="absolute left-6 top-1/2 -translate-y-1/2 z-[10] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#a5694f] opacity-0 group-hover:opacity-100 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button ref={nextRef} className="absolute right-6 top-1/2 -translate-y-1/2 z-[10] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#a5694f] opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-6 right-6 z-[10] w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#a5694f] transition-all"
        >
          <Maximize2 size={18} />
        </button>

        <div className="absolute bottom-6 left-6 z-[10]">
          <div className="px-4 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-white text-[9px] font-oswald uppercase tracking-[0.35em]">
            {/* 3. Traduction dynamique du compteur */}
            {images.length} {t('property.gallery.photos')}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120]">
            <div className="absolute inset-0 bg-black/95" onClick={() => setIsFullscreen(false)} />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative z-[130] w-full h-full flex items-center justify-center px-6 md:px-12 pointer-events-none">
              <div className="w-full max-w-6xl relative pointer-events-auto">
                
                <button onClick={() => setIsFullscreen(false)} className="absolute -top-16 right-0 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-[#a5694f] transition-all">
                  <X size={20} />
                </button>

                <Swiper modules={[Navigation]} onSwiper={setFsSwiper} loop={images.length > 1} className="w-full">
                  {images.map((img, idx) => (
                    <SwiperSlide key={`fs-${idx}`}>
                      <div className="w-full flex items-center justify-center">
                        <img src={img} className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl" alt="Full View" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {images.length > 1 && (
                  <>
                    <button ref={fsPrevRef} className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#a5694f] transition-all">
                      <ChevronLeft size={24} />
                    </button>
                    <button ref={fsNextRef} className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#a5694f] transition-all">
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="mt-8 text-center">
                  <p className="text-white/60 font-playfair italic text-xl">
                    {property.titulo || t('property.gallery.default_title')}
                  </p>
                  <p className="mt-2 text-white/30 font-oswald text-[10px] uppercase tracking-[0.4em]">
                    {/* 4. Traduction instruction ESC */}
                    {t('property.gallery.esc_to_close')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyGallery;