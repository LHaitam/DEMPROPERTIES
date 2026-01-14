import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroContactProps {
  onScrollClick: () => void;
}

const HeroContact: React.FC<HeroContactProps> = ({ onScrollClick }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const ySoft = useTransform(scrollY, [0, 600], [0, 120]);
  const yReverse = useTransform(scrollY, [0, 600], [0, -90]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-4 pt-24 pb-12 bg-cream">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ y: reduceMotion ? 0 : ySoft }}
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[75vh] bg-sand/25 rounded-bl-[12rem] blur-3xl"
        />
        <motion.div
          style={{ y: reduceMotion ? 0 : yReverse }}
          className="absolute bottom-[-10%] left-[-10%] w-[65vw] h-[60vh] bg-gold/30 rounded-tr-[14rem] blur-3xl"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 mb-20">
            <motion.h1 className="font-oswald text-[clamp(72px,11vw,180px)] uppercase">
              {t("contact.hero.title1")}
            </motion.h1>
            <motion.h1 className="font-oswald text-transparent bg-clip-text bg-gradient-to-r from-[#8A6930] via-[#CFA670] to-[#6F5327] text-[clamp(72px,11vw,180px)] uppercase lg:ml-[20vw]">
              {t("contact.hero.title2")}
            </motion.h1>
          </div>

          <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-10">
            <p className="font-playfair italic text-xl border-l-2 border-gold pl-6">
              {t("contact.hero.subtitle")}
            </p>

            <button
              onClick={onScrollClick}
              className="group px-12 py-5 bg-charcoal text-cream font-oswald uppercase tracking-widest"
            >
              <span className="flex items-center gap-3">
                {t("contact.hero.cta")}
                <ArrowDown className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <span className="font-oswald text-xs uppercase writing-vertical-rl rotate-180 text-charcoal/40">
          {t("contact.hero.signature")}
        </span>
      </div>
    </section>
  );
};

export default HeroContact;
