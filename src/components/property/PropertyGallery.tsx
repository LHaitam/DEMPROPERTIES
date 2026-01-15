import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  Parallax,
} from "swiper/modules";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "@/hooks/useProperties";

interface PropertyGalleryProps {
  property: Property & {
    fotos_list?: string[];
    titulo?: string;
  };
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ property }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const images =
    property.fotos_list && property.fotos_list.length > 0
      ? property.fotos_list
      : [property.foto];

  return (
    <>
      {/* =========================
          MAIN GALLERY
      ========================= */}
      <div className="relative group w-full h-[62vh] md:h-[78vh] bg-stone-100 overflow-hidden rounded-2xl border border-stone-100/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.45)]">
        {/* Subtle luxury overlays */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />
          <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax]}
          effect="fade"
          speed={1200}
          parallax={true}
          autoplay={{ delay: 5200, disableOnInteraction: false }}
          loop={images.length > 1}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet !w-1.5 !h-1.5 !bg-white/50 !opacity-100",
            bulletActiveClass: "!bg-[#C5A059] !w-6 !rounded-full",
          }}
          navigation={{
            prevEl: ".pg-prev",
            nextEl: ".pg-next",
          }}
          className="h-full w-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={img}
                  alt={property.titulo || "Property image"}
                  data-swiper-parallax="-18%"
                  className="w-full h-full object-cover
                             scale-[1.02] group-hover:scale-[1.06]
                             transition-transform duration-[2500ms] ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/1600x900?text=Property";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}

          {/* Top label */}
          <div className="absolute top-6 left-6 z-[5]">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-oswald text-[9px] uppercase tracking-[0.35em] text-white/90">
                Exclusive Selection
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                className="pg-prev absolute left-5 top-1/2 -translate-y-1/2 z-[6]
                           w-11 h-11 rounded-full border border-white/20
                           bg-white/10 backdrop-blur-md text-white
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100
                           hover:bg-[#C5A059] hover:border-[#C5A059]
                           transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                className="pg-next absolute right-5 top-1/2 -translate-y-1/2 z-[6]
                           w-11 h-11 rounded-full border border-white/20
                           bg-white/10 backdrop-blur-md text-white
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100
                           hover:bg-[#C5A059] hover:border-[#C5A059]
                           transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Bottom actions */}
          <div className="absolute bottom-6 right-6 z-[6] flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(true)}
              className="w-11 h-11 rounded-full
                         bg-white/10 backdrop-blur-md border border-white/15
                         text-white flex items-center justify-center
                         hover:bg-[#C5A059] hover:border-[#C5A059]
                         transition-all duration-300"
              aria-label="Open fullscreen gallery"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* Bottom-left counter */}
          <div className="absolute bottom-6 left-6 z-[6]">
            <div className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
              <span className="font-oswald text-[9px] uppercase tracking-[0.35em] text-white/80">
                {images.length} Photos
              </span>
            </div>
          </div>
        </Swiper>
      </div>

      {/* =========================
          FULLSCREEN MODAL
      ========================= */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[120] bg-black/95"
          >
            {/* Close */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-8 right-8 z-[130]
                         w-12 h-12 rounded-full
                         bg-white/10 border border-white/15 backdrop-blur-md
                         text-white flex items-center justify-center
                         hover:bg-[#C5A059] hover:border-[#C5A059]
                         transition-all"
              aria-label="Close fullscreen"
            >
              <X size={20} />
            </button>

            {/* Fullscreen swiper */}
            <div className="h-full w-full flex items-center justify-center px-6 md:px-12">
              <div className="w-full max-w-6xl">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: ".pgf-prev",
                    nextEl: ".pgf-next",
                  }}
                  pagination={{ clickable: true }}
                  loop={images.length > 1}
                  className="w-full"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full flex items-center justify-center"
                      >
                        <img
                          src={img}
                          alt="Fullscreen"
                          className="max-h-[85vh] w-full object-contain rounded-xl"
                        />
                      </motion.div>
                    </SwiperSlide>
                  ))}

                  {/* Fullscreen nav */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="pgf-prev absolute left-0 top-1/2 -translate-y-1/2 z-[140]
                                   w-12 h-12 rounded-full
                                   bg-white/10 border border-white/15 backdrop-blur-md
                                   text-white flex items-center justify-center
                                   hover:bg-[#C5A059] hover:border-[#C5A059]
                                   transition-all"
                        aria-label="Previous fullscreen image"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        className="pgf-next absolute right-0 top-1/2 -translate-y-1/2 z-[140]
                                   w-12 h-12 rounded-full
                                   bg-white/10 border border-white/15 backdrop-blur-md
                                   text-white flex items-center justify-center
                                   hover:bg-[#C5A059] hover:border-[#C5A059]
                                   transition-all"
                        aria-label="Next fullscreen image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </Swiper>

                {/* Caption */}
                <div className="mt-6 text-center">
                  <p className="font-oswald text-[9px] uppercase tracking-[0.35em] text-white/55">
                    {property.titulo || "Exclusive Residence"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyGallery;
