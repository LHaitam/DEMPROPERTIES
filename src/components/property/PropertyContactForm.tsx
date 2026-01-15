import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";

interface PropertyContactFormProps {
  propertyRef?: string;
  propertyPrice?: string | number;
}

const PropertyContactForm: React.FC<PropertyContactFormProps> = ({ propertyRef, propertyPrice }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Envoi du lead pour:", propertyRef, formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour nettoyer le prix venant de l'API (ex: "1.500.000" -> 1500000)
  const getValidPrice = (price: string | number | undefined) => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    // Supprime tout ce qui n'est pas un chiffre
    const cleaned = price.replace(/\D/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const numericPrice = getValidPrice(propertyPrice);

  // Formatage du prix pour l'affichage discret
  const displayPrice = numericPrice > 0 
    ? `${numericPrice.toLocaleString()} €` 
    : t('property.priceOnRequest', 'P.O.R.');

  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {/* NAME */}
            <div className="group">
              <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1 group-focus-within:text-[#C5A059] transition-colors">
                {t('contact.form.fields.name')}
              </label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:border-[#C5A059] transition-all outline-none font-light" 
                placeholder={t('contact.form.placeholders.name', 'Full Name')}
              />
            </div>

            {/* EMAIL */}
            <div className="group">
              <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1 group-focus-within:text-[#C5A059] transition-colors">
                {t('contact.form.fields.email')}
              </label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:border-[#C5A059] transition-all outline-none font-light" 
                placeholder="email@luxury.com"
              />
            </div>

            {/* PHONE */}
            <div className="group">
              <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1 group-focus-within:text-[#C5A059] transition-colors">
                {t('contact.form.fields.phone')}
              </label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:border-[#C5A059] transition-all outline-none font-light" 
                placeholder="+34 --- --- ---"
              />
            </div>

            {/* MESSAGE */}
            <div className="group">
              <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1 group-focus-within:text-[#C5A059] transition-colors">
                {t('contact.form.fields.message')}
              </label>
              <textarea 
                name="message"
                rows={3}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:border-[#C5A059] transition-all outline-none resize-none font-light" 
                placeholder={t('propertyPreview.explore')}
              />
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-stone-900 text-white font-oswald uppercase tracking-[0.4em] text-[9px] py-4 mt-6 transition-all hover:bg-[#C5A059]"
            >
              {t('contact.form.submit')}
            </motion.button>

            <div className="pt-4 text-center">
              <p className="text-[7px] text-stone-300 uppercase tracking-widest italic">
                {t('property.ref', 'Ref')}: {propertyRef} — {displayPrice}
              </p>
            </div>
          </motion.form>
        ) : (
          /* MESSAGE DE SUCCÈS */
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059]"
            >
              <Check size={30} strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-2">
              <h3 className="font-playfair italic text-2xl text-stone-900">
                {t('contact.success.title', 'Thank You')}
              </h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed max-w-[240px]">
                {t('contact.success.message', 'Your enquiry has been received.')}
                <br />
                <span className="text-stone-900 font-medium text-[10px] uppercase tracking-wider mt-2 block">
                   Ref: {propertyRef}
                </span>
              </p>
            </div>

            <button 
              onClick={() => setIsSubmitted(false)}
              className="flex items-center gap-2 font-oswald text-[9px] uppercase tracking-[0.3em] text-[#C5A059] hover:text-stone-900 transition-colors pt-4"
            >
              {t('contact.success.back', 'Send another message')} <ArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyContactForm;