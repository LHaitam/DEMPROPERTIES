import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight, Loader2 } from "lucide-react";

interface PropertyContactFormProps {
  propertyRef: string;
  propertyPrice: string;
  defaultMessage: string;
}

const PropertyContactForm: React.FC<PropertyContactFormProps> = ({ propertyRef, propertyPrice, defaultMessage }) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(formRef.current!);
    const payload = {
      nombre: formData.get("user_name"),
      email: formData.get("user_email"),
      mensaje: message,
      ref: propertyRef,
    };

    try {
      await fetch("https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
    } catch (err) {
      setStatus("idle"); // Simplifié pour le widget produit
    }
  };

  return (
    <div className="relative bg-white p-1">
      <AnimatePresence mode="wait">
        {status !== "success" ? (
          <motion.form key="f-prop" ref={formRef} onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="space-y-4">
              <div className="group">
                <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1">{t('contact.form.fields.name')}</label>
                <input name="user_name" type="text" required className="w-full bg-transparent border-b border-stone-200 py-2 text-sm outline-none focus:border-[#C5A059] transition-all font-light" />
              </div>

              <div className="group">
                <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1">{t('contact.form.fields.email')}</label>
                <input name="user_email" type="email" required className="w-full bg-transparent border-b border-stone-200 py-2 text-sm outline-none focus:border-[#C5A059] transition-all font-light" />
              </div>

              <div className="group">
                <label className="block font-oswald text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-1">{t('contact.form.fields.message')}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} required className="w-full bg-transparent border-b border-stone-200 py-2 text-sm outline-none focus:border-[#C5A059] transition-all resize-none font-light" />
              </div>
            </div>

            <button type="submit" disabled={status === "loading"} className="w-full bg-stone-900 text-white font-oswald uppercase tracking-[0.4em] text-[9px] py-4 mt-2 hover:bg-[#C5A059] transition-all flex justify-center items-center">
              {status === "loading" ? <Loader2 className="animate-spin" size={14} /> : t('contact.form.submit')}
            </button>

            <div className="pt-6 mt-4 border-t border-stone-50 text-center">
               <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-oswald text-stone-900 uppercase tracking-[0.2em]">REF: {propertyRef}</span>
                 <span className="text-[8px] text-[#C5A059] uppercase tracking-widest italic font-medium">{propertyPrice}</span>
               </div>
            </div>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto">
              <Check size={24} />
            </div>
            <h3 className="font-playfair italic text-xl">{t('contact.success.title')}</h3>
            <button onClick={() => setStatus("idle")} className="flex items-center gap-2 font-oswald text-[8px] uppercase tracking-[0.3em] text-[#C5A059] mx-auto">
              {t('contact.success.back')} <ArrowRight size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyContactForm;