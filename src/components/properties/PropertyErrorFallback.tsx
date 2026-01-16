import { useTranslation } from 'react-i18next';

export const PropertyErrorFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h2 className="font-playfair italic text-3xl text-stone-800 mb-4">
        {t('errors.property_not_found_title', 'Propiedad no disponible')}
      </h2>
      <p className="font-oswald uppercase tracking-widest text-xs text-stone-500 mb-8 max-w-md">
        {t('errors.property_not_found_text', 'No pudimos cargar los detalles de esta propiedad. Puede que ya no esté disponible o haya un problema técnico.')}
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.href = '/properties'}
          className="px-8 py-3 border border-stone-200 font-oswald text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-colors"
        >
          {t('nav.properties', 'Ver catálogo')}
        </button>
        <button 
          onClick={() => window.location.href = '/contact'}
          className="px-8 py-3 bg-stone-900 text-white font-oswald text-[10px] uppercase tracking-widest hover:bg-[#A47C3B] transition-colors"
        >
          {t('nav.contact', 'Contactar')}
        </button>
      </div>
    </div>
  );
};