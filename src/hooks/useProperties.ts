import { useState, useEffect } from 'react';

export interface Property {
  cod_ofer: number;
  id?: string; // Optionnel pour la compatibilité
  ref: string;
  nbtipo: string;
  poblacion: string;
  zona: string;
  ciudad: string;
  foto: string;
  precioinmo: number;
  precioalq: number;
  keyacci: number;
  total_hab: number;
  banyos: number;
  m_cons: number;
  m_terraza?: number;
  vistasalmar?: number;
  descrip?: string;      // Ajouté pour TypeScript
  descripcion?: string;  // Ajouté pour TypeScript
}

export const useProperties = (lang: string) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProps = async () => {
    setLoading(true);
    // Inmovilla lang mapping: es=1, fr=2, en=3 (ajustez selon votre API)
    const langId = lang === 'es' ? '1' : lang === 'en' ? '3' : '2';
    try {
      const response = await fetch(`https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=list&lang=${langId}`);
      const data = await response.json();
      if (data.paginacion && Array.isArray(data.paginacion)) {
        // On retire le premier élément qui est souvent l'objet de pagination/meta
        setProperties(data.paginacion.slice(1));
      }
    } catch (error) {
      console.error("Erreur API Liste:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, [lang]);

  return { properties, loading };
};