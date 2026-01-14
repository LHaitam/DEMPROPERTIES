import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-charcoal text-cream py-32 px-6 md:px-12 lg:px-20 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col items-center text-center gap-20">
        <a href="/" className="flex items-center gap-6 group">
          <div className="w-16 h-16 border border-gold/60 flex items-center justify-center">
            <img src="/logo-blanc.webp" alt="DEM logo" className="w-10 h-10" />
          </div>

          <div>
            <span className="block font-oswald uppercase tracking-[0.30em] text-sm">
              DEM
            </span>
            <span className="block font-oswald uppercase tracking-[0.18em] text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg,#A47C3B,#CFA670,#8C6A30)" }}>
              PROPERTIES
            </span>
          </div>
        </a>

        <p className="font-playfair italic text-cream/70 text-xl max-w-2xl">
          Exceptional properties. Tailored guidance. A discreet real estate experience in Marbella.
        </p>

        <div className="text-xs text-cream/30 uppercase tracking-[0.30em]">
          © {new Date().getFullYear()} DEM Properties — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
