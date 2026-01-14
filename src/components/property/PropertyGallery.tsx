import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const PropertyGallery = ({ images }: { images: string[] }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
      <motion.div className="md:col-span-2 md:row-span-2 relative overflow-hidden group">
        <img
          src={images[0]}
          alt={t("property.gallery.main")}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {images.slice(1, 5).map((img, i) => (
        <div key={i} className="relative overflow-hidden group hidden md:block">
          <img
            src={img}
            alt={t("property.gallery.item", { index: i + 1 })}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
