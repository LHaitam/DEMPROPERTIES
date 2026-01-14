import type { Property } from "@/types/property";

export function mapInmovillaToProperty(
  raw: any,
  descripciones?: Record<string, any>,
  lang: number = 1
): Property {
  const id = raw.cod_ofer?.toString() ?? "";

  /* ================= TITRE & DESCRIPTION ================= */
  const descBlock = descripciones?.[raw.cod_ofer]?.[lang];

  const title =
    descBlock?.titulo ||
    raw.nbtipo ||
    "Property";

  const description =
    descBlock?.descrip ||
    raw.descrip ||
    "No description available.";

  /* ================= OPERATION ================= */
  const operation: "sale" | "rent" =
    raw.keyacci === 1 ? "sale" : "rent";

  const operationLabel =
    raw.keyacci === 1
      ? "Vender"
      : raw.keyacci === 2
      ? "Alquilar"
      : "Otro";

  /* ================= PRICE ================= */
  const price =
    operation === "sale"
      ? Number(raw.precioinmo) || 0
      : Number(raw.precioalq) || 0;

  /* ================= STATUS ================= */
  const status =
    raw.estadoficha === 0 || raw.nodispo === 1
      ? "unavailable"
      : "available";

  /* ================= IMAGES ================= */
  const images =
    raw.numfotos && raw.fotoletra && raw.srvfotos
      ? Array.from({ length: raw.numfotos }, (_, i) =>
          `https://fotos${raw.srvfotos}.apinmo.com/${raw.numagencia}/${raw.cod_ofer}/${raw.fotoletra}-${i + 1}.jpg`
        )
      : raw.foto
      ? [raw.foto]
      : [];

  /* ================= PROPERTY TYPE ================= */
  const propertyType = raw.nbtipo || "";

  /* ================= SPECS ================= */
  const specs = {
    size: raw.m_cons || raw.m_uties || raw.m_parcela || 0,
    beds: raw.total_hab || 0,
    baths: raw.banyos || raw.aseos || 0,

    conservation: raw.conservacion_txt || undefined,
    year: raw.antiguedad || undefined,
    ibi: raw.ibi || undefined,
    exterior: raw.todoext === 1,
  };

  /* ================= ENERGY ================= */
  const energy = {
    letter: raw.energialetra || null,
    consumption: raw.energiavalor || null,
    emissionsLetter: raw.emisionesletra || null,
    emissionsValue: raw.emisionesvalor || null,
  };

  return {
    id,
    reference: raw.ref || "",
    title,
    description,

    price,
    operation,
    operationLabel,
    status,

    location: [raw.zona, raw.ciudad].filter(Boolean).join(" / "),
    propertyType,

    mainImage: images[0] || "",
    images,

    specs,
    energy,

    features: [],
  };
}
