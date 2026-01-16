import React from "react";
import { useTranslation } from "react-i18next";
// Ajout de l'icône Facebook ici
import { Instagram, Linkedin, Mail, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-[#1A1A1A] text-[#F5F5F3] py-24 px-6 overflow-hidden">
      {/* Texture de fond discrète */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-cover" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start mb-20">

          {/* COLONNE 1 : LOGO & VISION */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <a href="/" className="w-fit">
              <img
                src="/logo.webp"
                alt="DEM logo"
                className="w-44 md:w-52 h-auto object-contain"
              />
            </a>

            <p className="font-serif italic text-lg text-stone-400 max-w-sm leading-relaxed">
              {t("footer.vision")}
            </p>

            <div className="flex gap-5 text-stone-500">
              {/* Facebook ajouté en premier ou selon votre préférence */}
              <a
                href="https://www.facebook.com/share/1Znv4Qgm5Z/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#a5694f] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/dounia_elmoutii_properties_?igsh=dWtudnlreHlqYXdh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#a5694f] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/dounia-el-moutii-0423b79b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#a5694f] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:d.elmoutii@demproperties.es"
                className="hover:text-[#a5694f] transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* COLONNE 2 : NAVIGATION */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="font-oswald uppercase tracking-widest text-xs text-stone-500">{t('footer.menu.title')}</h4>
            <nav className="flex flex-col gap-4 font-oswald text-sm uppercase tracking-wider">
              <a href="/" className="hover:text-[#a5694f] transition-colors w-fit">{t('nav.home')}</a>
              <a href="/properties" className="hover:text-[#a5694f] transition-colors w-fit">{t('nav.properties')}</a>
              <a href="/about" className="hover:text-[#a5694f] transition-colors w-fit">{t('nav.about')}</a>
              <a href="/contact" className="hover:text-[#a5694f] transition-colors w-fit">{t('nav.contact')}</a>
            </nav>
          </div>

          {/* COLONNE 3 : CONTACT INFO */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <h4 className="font-oswald uppercase tracking-widest text-xs text-stone-500">Contact</h4>
            <div className="font-serif text-stone-300 space-y-2">
              <p className="text-lg italic">Marbella, Costa del Sol</p>
              <p className="text-stone-500 not-italic text-sm tracking-wide">+34 655 62 38 60</p>
              <p className="text-stone-500 not-italic text-sm tracking-wide">d.elmoutii@demproperties.es</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-stone-600 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} DEM Properties — {t('footer.rights')}
          </div>
          <div className="flex gap-8 text-[10px] text-stone-600 uppercase tracking-[0.2em]">
            <a href="/privacy-policy" className="hover:text-stone-400 transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;