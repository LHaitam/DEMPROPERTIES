import { useState, useEffect } from 'react';

export interface Property {
  cod_ofer: number;
  id?: string;
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
  descrip?: string;
  descripcion?: string;
  piscina_com?: number;
  piscina_prop?: number;
  parking?: number;
  terraza?: number;
}

export const useProperties = (lang: string) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProps = async () => {
    setLoading(true);
    const langId = lang === 'es' ? '1' : '2';
    
    try {
      const response = await fetch(
        `https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla/api_v1.php?action=list&lang=${langId}`
      );

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      
      if (data && data.paginacion && Array.isArray(data.paginacion)) {
        const rawList = data.paginacion;

        // LOGIQUE DE DÉTECTION : 
        // Si le premier élément n'a pas de 'ref' ou de 'cod_ofer', c'est l'objet de pagination.
        // Sinon, c'est déjà une propriété, on garde tout.
        const firstItem = rawList[0];
        const hasNoData = !firstItem.ref && !firstItem.cod_ofer;
        
        const finalData = hasNoData ? rawList.slice(1) : rawList;
        
        console.log("Propriétés filtrées pour le state:", finalData);
        setProperties(finalData);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Erreur API Liste:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, [lang]);

  return { properties, loading };
};