import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/properties/[id]";
import "leaflet/dist/leaflet.css";
import WhatsAppButton from "./components/layout/WhatsAppButton";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { PropertyErrorFallback } from "./components/properties/PropertyErrorFallback";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { i18n, t } = useTranslation();

  const seoData = {
    title: i18n.language === "es"
      ? "DEM Properties | Servicios Inmobiliarios y Selección de Viviendas"
      : "DEM Properties | Real Estate Services & Property Selection",
    description: i18n.language === "es"
      ? "Asesoramiento inmobiliario profesional. Encuentra tu próxima vivienda en nuestra selección de propiedades."
      : "Professional real estate advice. Find your next home in our property selection."
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
          <link rel="canonical" href="https://demproperties.es" />
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.description} />
        </Helmet>

        <ScrollToTop />
        <Header />
        <WhatsAppButton />

        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* CORRECTION : L'ErrorBoundary doit envelopper l'élément à l'intérieur de la Route */}
            <Route
              path="/properties"
              element={
                <ErrorBoundary fallback={<div className="py-40 text-center font-playfair italic text-stone-500">{t('errors.loading_properties', 'Error loading properties...')}</div>}>
                  <Properties />
                </ErrorBoundary>
              }
            />

            <Route
              path="/properties/:id"
              element={
                <ErrorBoundary fallback={<PropertyErrorFallback />}>
                  <PropertyDetails />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}