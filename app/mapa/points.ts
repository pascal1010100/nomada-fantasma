// app/mapa/points.ts
export type Category = "wifi" | "hospedaje" | "cowork" | "banco" | "puerto";

export type Point = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  isGhost?: boolean;
  townSlug?: string; // Link to town detail page
};

export const samplePoints: Point[] = [
  // ——— Panajachel ———
  { id: "pana-cowork-1", name: "Selina Panajachel", category: "cowork", lat: 14.744, lng: -91.159, townSlug: "panajachel" },
  { id: "pana-wifi-1", name: "Café Loco", category: "wifi", lat: 14.741, lng: -91.156, townSlug: "panajachel" },
  { id: "pana-banco-1", name: "Banco Industrial", category: "banco", lat: 14.742, lng: -91.155, townSlug: "panajachel" },
  { id: "pana-puerto-1", name: "Embarcadero Tzanjuyu", category: "puerto", lat: 14.745, lng: -91.160, townSlug: "panajachel" },
  { id: "pana-ghost-1", name: "Jardín Secreto", category: "wifi", lat: 14.746, lng: -91.158, isGhost: true, townSlug: "panajachel" },

  // ——— San Pedro La Laguna ———
  { id: "sp-cowork-1", name: "Mikaso Hotel & Cowork", category: "cowork", lat: 14.6930, lng: -91.2720, townSlug: "san-pedro-la-laguna" },
  { id: "sp-wifi-1", name: "La Terraza", category: "wifi", lat: 14.6910, lng: -91.2700, townSlug: "san-pedro-la-laguna" },
  { id: "sp-banco-1", name: "Banrural", category: "banco", lat: 14.6920, lng: -91.2710, townSlug: "san-pedro-la-laguna" },
  { id: "sp-puerto-1", name: "Muelle Principal", category: "puerto", lat: 14.6950, lng: -91.2690, townSlug: "san-pedro-la-laguna" },
  { id: "sp-ghost-1", name: "Playa Escondida", category: "puerto", lat: 14.6980, lng: -91.2740, isGhost: true, townSlug: "san-pedro-la-laguna" },

  // ——— San Marcos La Laguna ———
  { id: "sm-cowork-1", name: "Lush Atitlán", category: "cowork", lat: 14.723, lng: -91.258, townSlug: "san-marcos-la-laguna" },
  { id: "sm-wifi-1", name: "Circles Café", category: "wifi", lat: 14.722, lng: -91.257, townSlug: "san-marcos-la-laguna" },
  { id: "sm-puerto-1", name: "Muelle San Marcos", category: "puerto", lat: 14.724, lng: -91.256, townSlug: "san-marcos-la-laguna" },
  { id: "sm-ghost-1", name: "Altar Maya Oculto", category: "hospedaje", lat: 14.726, lng: -91.259, isGhost: true, townSlug: "san-marcos-la-laguna" },

  // ——— San Juan La Laguna ———
  { id: "sj-wifi-1", name: "Café Las Marias", category: "wifi", lat: 14.695, lng: -91.285, townSlug: "san-juan-la-laguna" },
  { id: "sj-puerto-1", name: "Muelle San Juan", category: "puerto", lat: 14.697, lng: -91.283, townSlug: "san-juan-la-laguna" },

  // ——— Santiago Atitlán ———
  { id: "sa-banco-1", name: "BAM Santiago", category: "banco", lat: 14.635, lng: -91.228, townSlug: "santiago-atitlan" },
  { id: "sa-puerto-1", name: "Muelle Santiago", category: "puerto", lat: 14.638, lng: -91.230, townSlug: "santiago-atitlan" },

  // ——— Santa Cruz La Laguna ———
  { id: "sc-cowork-1", name: "La Iguana Perdida", category: "cowork", lat: 14.748, lng: -91.205, townSlug: "santa-cruz-la-laguna" },
  { id: "sc-puerto-1", name: "Muelle Santa Cruz", category: "puerto", lat: 14.749, lng: -91.205, townSlug: "santa-cruz-la-laguna" },
  { id: "sc-ghost-1", name: "Cueva del Pescador", category: "puerto", lat: 14.750, lng: -91.208, isGhost: true, townSlug: "santa-cruz-la-laguna" },
];
