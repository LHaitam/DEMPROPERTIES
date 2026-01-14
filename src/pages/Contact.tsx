import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import HeroContact from "@/components/contact/HeroContact";

type Status = "idle" | "success" | "error";

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

  /* ----------------------------------
     SEO
  ---------------------------------- */
  useEffect(() => {
    document.title = "DEM Properties | Contact";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Contact DEM Properties in Marbella for personalised real estate advisory and discreet property opportunities.";
    document.head.appendChild(meta);

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://demproperties.es/contact";
    document.head.appendChild(canonical);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(canonical);
    };
  }, []);

  /* ----------------------------------
     SCROLL HERO → FORM
  ---------------------------------- */
  const scrollToForm = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ----------------------------------
     SUBMIT LEAD → BACKEND PHP → INMOVILLA
  ---------------------------------- */
  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    if (!formRef.current) return;

    const data = new FormData(formRef.current);

    const payload = {
      nombre: data.get("user_name"),
      apellidos: data.get("user_lastname") || "",
      email: data.get("user_email"),
      telefono: data.get("user_phone"),
      mensaje: data.get("message"),
      ref: "WEB",
    };

    try {
      const res = await fetch(
        "https://demproperties.es/api/inmovilla/lead.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Lead failed");

      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("Lead error:", err);
      setStatus("error");
    }
  };

  /* ----------------------------------
     FORM FIELDS (TS SAFE)
  ---------------------------------- */
  const fields: FieldConfig[] = [
    { label: t("contact.form.fields.name"), name: "user_name", type: "text", required: true },
    { label: t("contact.form.fields.lastname"), name: "user_lastname", type: "text", required: false },
    { label: t("contact.form.fields.email"), name: "user_email", type: "email", required: true },
    { label: t("contact.form.fields.phone"), name: "user_phone", type: "tel", required: true },
  ];


  return (
    <div className="relative min-h-screen w-full bg-cream text-charcoal overflow-hidden">
      {/* HERO */}
      <HeroContact onScrollClick={scrollToForm} />

      {/* INTRO */}
      <section className="relative z-10 py-20 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="block font-oswald uppercase tracking-[0.4em] text-gold text-xs mb-6"
        >
          {t("contact.intro.eyebrow")}
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-playfair italic text-xl md:text-2xl text-charcoal/80 leading-relaxed"
        >
          {t("contact.intro.text")}
        </motion.p>
      </section>

      {/* FORM SECTION */}
      <section
        ref={sectionRef}
        className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20"
      >
        {/* CONTACT INFO */}
        <div className="space-y-12">
          <div>
            <h3 className="font-oswald text-4xl md:text-5xl uppercase">
              {t("contact.info.name")}
            </h3>
            <p className="font-playfair italic text-xl text-charcoal/70">
              {t("contact.info.role")}
            </p>
          </div>

          <div>
            <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">
              {t("contact.info.locationLabel")}
            </h4>
            <p className="text-xl font-playfair text-charcoal/80">
              {t("contact.info.location")}
            </p>
          </div>

          <div>
            <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">
              {t("contact.info.phoneLabel")}
            </h4>
            <a
              href="tel:+34655623860"
              className="text-xl font-playfair hover:text-gold transition"
            >
              +34 655 62 38 60
            </a>
          </div>

          <div>
            <h4 className="font-oswald uppercase text-xs tracking-[0.25em] text-gold mb-2">
              {t("contact.info.emailLabel")}
            </h4>
            <a
              href="mailto:d.elmoutii@demproperties.es"
              className="block text-xl font-playfair hover:text-gold transition"
            >
              d.elmoutii@demproperties.es
            </a>
          </div>
        </div>

        {/* FORM */}
        <motion.form
          ref={formRef}
          onSubmit={submitLead}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="font-oswald uppercase tracking-[0.25em] text-xs">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                className="bg-transparent border-b border-charcoal/30 py-3 focus:border-gold outline-none"
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label className="font-oswald uppercase tracking-[0.25em] text-xs">
              {t("contact.form.fields.message")}
            </label>
            <textarea
              rows={5}
              name="message"
              required
              className="bg-transparent border-b border-charcoal/30 py-3 focus:border-gold outline-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="group relative w-full px-12 py-5 bg-charcoal text-cream font-oswald uppercase tracking-[0.25em] overflow-hidden"
          >
            <span className="relative z-10">
              {t("contact.form.submit")}
            </span>
            <div
              className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"
              style={{
                background:
                  "linear-gradient(90deg,#A47C3B,#CFA670,#8C6A30)",
              }}
            />
          </button>

          {/* SUCCESS */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gold/30 bg-gold/10 px-6 py-4"
            >
              <p className="font-playfair text-charcoal text-lg">
                {t("contact.form.success")}
              </p>
            </motion.div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-700 font-playfair"
            >
              {t("contact.form.error")}
            </motion.p>
          )}
        </motion.form>
      </section>
    </div>
  );
}
