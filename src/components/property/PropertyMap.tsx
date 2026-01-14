import { useTranslation } from "react-i18next";

export const PropertyMap = ({ location }: { location: string }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="font-oswald text-2xl uppercase">
        {t("property.map.title")}
      </h3>

      <div className="...">
        <p className="font-playfair italic text-[#121212]/60 mb-2">
          {t("property.map.area")}
        </p>
        <p className="font-oswald text-xl uppercase tracking-widest">
          {location}
        </p>
      </div>
    </div>
  );
};
