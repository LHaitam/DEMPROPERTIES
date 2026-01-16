import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

import HeroContact from "@/components/contact/HeroContact";
import Header from "@/components/layout/Header";

type Status = "idle" | "loading" | "success" | "error";

type FieldConfig = {
  label: string;
  name: string;
  type: string;
  required: boolean;
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isES = i18n.language === "es";

  const scrollToForm = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || status === "loading") return;

    setStatus("loading");
    const data = new FormData(formRef.current);

    const payload = {
      nombre: data.get("user_name"),
      apellidos: data.get("user_lastname") || "",
      email: data.get("user_email"),
      telefono: data.get("user_phone"),
      mensaje: data.get("message"),
      ref: "WEB_CONTACT",
    };

    try {
      const res = await fetch("https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lead failed");

      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("Lead error:", err);
      setStatus("error");
    }
  };

  const fields: FieldConfig[] = [
    { label: t("contact.form.fields.name"), name: "user_name", type: "text", required: true },
    { label: t("contact.form.fields.lastname"), name: "user_lastname", type: "text", required: false },
    { label: t("contact.form.fields.email"), name: "user_email", type: "email", required: true },
    { label: t("contact.form.fields.phone"), name: "user_phone", type: "tel", required: true },
  ];

  return (
    <div className="relative min-h-screen w-full bg-cream text-charcoal overflow-hidden">
      <Helmet>
        <title>
          {isES ? "Contacto | DEM Properties Marbella" : "Contact Us | DEM Properties Marbella"}
        </title>
        <meta 
          name="description" 
          content={isES 
            ? "Póngase en contacto con DEM Properties para cualquier consulta inmobiliaria en Marbella. Estamos aquí para asesorarle." 
            : "Get in touch with DEM Properties for any real estate inquiries in Marbella. We are here to advise you."} 
        />
        <link rel="canonical" href="https://demproperties.es/contact" />
        
        {/* Schema.org pour le support client */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "RealEstateAgent",
              "name": "DEM Properties",
              "telephone": "+34655623860",
              "email": "d.elmoutii@demproperties.es",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Marbella",
                "addressCountry": "ES"
              }
            }
          })}
        </script>
      </Helmet>

      <Header />

      <HeroContact onScrollClick={scrollToForm} />

      {/* SECTION INTRODUCTION */}
      <section className="relative z-10 py-20 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="block font-oswald uppercase tracking-[0.4em] text-gold text-xs mb-6"
        >
          {t("contact.intro.eyebrow")}
        </motion.span>
        <motion.p className="font-playfair italic text-xl md:text-2xl text-charcoal/80 leading-relaxed">
          {t("contact.intro.text")}
        </motion.p>
      </section>

      {/* SECTION FORMULAIRE & INFO */}
      <section ref={sectionRef} className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* COLONNE GAUCHE : INFOS */}
        <div className="space-y-12">
          <div>
            <h3 className="font-oswald text-4xl md:text-5xl uppercase">{t("contact.info.name")}</h3>
            <p className="font-playfair italic text-xl text-charcoal/70">{t("contact.info.role")}</p>
          </div>

          <div className="space-y-8 border-t border-charcoal/10 pt-10">
            <div>
              <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">{t("contact.info.locationLabel")}</h4>
              <p className="text-xl font-playfair text-charcoal/80">{t("contact.info.location")}</p>
            </div>
            <div>
              <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">{t("contact.info.phoneLabel")}</h4>
              <a href="tel:+34655623860" className="text-xl font-playfair hover:text-gold transition">+34 655 62 38 60</a>
            </div>
            <div>
              <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">{t("contact.info.emailLabel")}</h4>
              <a href="mailto:d.elmoutii@demproperties.es" className="block text-xl font-playfair hover:text-gold transition break-all">d.elmoutii@demproperties.es</a>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="relative bg-white/50 p-8 md:p-12 backdrop-blur-sm border border-charcoal/5">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.form
                key="contact-form"
                ref={formRef}
                onSubmit={submitLead}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {fields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="font-oswald uppercase tracking-[0.25em] text-[10px] text-charcoal/60">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      className="bg-transparent border-b border-charcoal/20 py-3 focus:border-gold outline-none transition-colors font-playfair text-lg"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="font-oswald uppercase tracking-[0.25em] text-[10px] text-charcoal/60">{t("contact.form.fields.message")}</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    className="bg-transparent border-b border-charcoal/20 py-3 focus:border-gold outline-none transition-colors resize-none font-playfair text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative w-full px-12 py-5 bg-charcoal text-cream font-oswald uppercase tracking-[0.3em] text-xs overflow-hidden disabled:opacity-70 transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : t("contact.form.submit")}
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 bg-gold" />
                </button>

                {status === "error" && (
                  <p className="text-red-500 font-playfair italic text-center">{t("contact.form.error")}</p>
                )}
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full border border-gold flex items-center justify-center text-gold mx-auto">
                  <Check size={40} />
                </div>
                <h3 className="font-playfair text-3xl italic text-charcoal">{t("contact.form.success")}</h3>
                <button
                  onClick={() => setStatus("idle")}
                  className="font-oswald text-[10px] uppercase tracking-[0.3em] text-gold flex items-center gap-2 mx-auto hover:gap-4 transition-all"
                >
                  {t("contact.success.back")} <ArrowRight size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}