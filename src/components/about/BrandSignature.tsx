import React from "react";
import { useTranslation } from "react-i18next";

export const BrandSignature: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-36 px-6 bg-cream">
      <p
        className="
          max-w-4xl mx-auto text-center
          font-playfair italic
          text-2xl md:text-3xl lg:text-[2.2rem]
          leading-relaxed
          text-charcoal/80
        "
      >
        {t("brand.signature.line1")}
        <br className="hidden sm:block" />
        {t("brand.signature.line2")}
      </p>
    </section>
  );
};

export default BrandSignature;
