import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-oswald text-8xl md:text-[12rem] text-stone-200 leading-none mb-4"
          >
            404
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-playfair italic text-2xl md:text-4xl text-stone-800 mb-6">
              {t('404.title', 'Page introuvable')}
            </h2>
            <p className="font-oswald uppercase tracking-widest text-xs text-stone-500 mb-10">
              {t('404.message', "Le chemin que vous cherchez n'existe pas ou a été déplacé.")}
            </p>
            
            <Link 
              to="/" 
              className="inline-block px-10 py-4 bg-stone-900 text-white font-oswald text-xs uppercase tracking-[0.2em] hover:bg-[#A47C3B] transition-colors duration-500"
            >
              {t('404.backHome', 'Retour à l\'accueil')}
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;