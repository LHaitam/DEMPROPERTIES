const API_BASE =
  "https://lightslategrey-stork-838501.hostingersite.com/api/inmovilla";

export async function fetchAllProperties() {
  const res = await fetch(`${API_BASE}/properties.php`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function fetchPropertyById(
  cod_ofer: string,
  lang = 1
) {
  const res = await fetch(
    `${API_BASE}/property.php?cod_ofer=${cod_ofer}&lang=${lang}`
  );
  if (!res.ok) throw new Error("API error");
  return res.json();
}
