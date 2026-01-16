import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight, Loader2 } from "lucide-react";
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
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // SEO
  useEffect(() => {
    document.title = "DEM Properties | Contact";
  }, []);

  const scrollToForm = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || status === "loading") return;

    setStatus("loading");
    const data = new FormData(formRef.current);

    // Formatage pour le script PHP qui envoie à Inmovilla
    const payload = {
      nombre: data.get("user_name"),
      apellidos: data.get("user_lastname") || "",
      email: data.get("user_email"),
      telefono: data.get("user_phone"),
      mensaje: data.get("message"),
      ref: "WEB_CONTACT", // Référence générique pour la page contact
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

          <div className="space-y-8">
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
              <a href="mailto:d.elmoutii@demproperties.es" className="block text-xl font-playfair hover:text-gold transition">d.elmoutii@demproperties.es</a>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="relative">
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
                    <label className="font-oswald uppercase tracking-[0.25em] text-xs">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      placeholder={field.label}
                      className="bg-transparent border-b border-charcoal/30 py-3 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="font-oswald uppercase tracking-[0.25em] text-xs">{t("contact.form.fields.message")}</label>
                  <textarea
                    rows={5}
                    name="message"
                    required
                    className="bg-transparent border-b border-charcoal/30 py-3 focus:border-gold outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative w-full px-12 py-5 bg-charcoal text-cream font-oswald uppercase tracking-[0.25em] overflow-hidden disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : t("contact.form.submit")}
                  </span>
                  <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 bg-gold" />
                </button>

                {status === "error" && (
                  <p className="text-red-600 font-playfair text-sm">{t("contact.form.error")}</p>
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
                <h3 className="font-playfair text-3xl italic">{t("contact.form.success")}</h3>
                <button
                  onClick={() => setStatus("idle")}
                  className="font-oswald text-xs uppercase tracking-widest text-gold flex items-center gap-2 mx-auto"
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