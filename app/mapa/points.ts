// app/mapa/points.ts
export type Category = "wifi" | "hospedaje" | "cowork" | "banco" | "puerto";

export type Point = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
};

export const samplePoints: Point[] = [
  // ——— Centro (Ciudad de Guatemala) ———
  { id: "wifi-gua-1", name: "Wi-Fi — Centro Histórico", category: "wifi", lat: 14.621, lng: -90.513 },
  { id: "cowork-gua-1", name: "Cowork — Nodo Z4",       category: "cowork", lat: 14.615, lng: -90.516 },
  { id: "hotel-gua-1", name: "Hospedaje — Z1 Norte",    category: "hospedaje", lat: 14.628, lng: -90.510 },
  { id: "atm-gua-1",  name: "Banco/ATM — Obelisco",     category: "banco", lat: 14.586, lng: -90.510 },
  { id: "wifi-gua-2", name: "Wi-Fi — Z10",              category: "wifi", lat: 14.604, lng: -90.510 },
  { id: "wifi-gua-3", name: "Wi-Fi — Z15",              category: "wifi", lat: 14.596, lng: -90.488 },
  { id: "cowork-gua-2", name: "Cowork — Z10",           category: "cowork", lat: 14.603, lng: -90.515 },
  { id: "wifi-gua-4", name: "Wi-Fi — Z4 (2)",           category: "wifi", lat: 14.616, lng: -90.512 },
  { id: "wifi-gua-5", name: "Wi-Fi — Z4 (3)",           category: "wifi", lat: 14.617, lng: -90.513 },

  // ——— Mixco / Periferia ———
  { id: "atm-mixco-1", name: "Banco/ATM — Mixco",       category: "banco", lat: 14.644, lng: -90.607 },
  { id: "wifi-mixco-1", name: "Wi-Fi — Mixco",          category: "wifi", lat: 14.656, lng: -90.607 },

  // ——— Antigua ———
  { id: "hotel-antigua-1", name: "Hospedaje — Antigua Norte", category: "hospedaje", lat: 14.574, lng: -90.733 },
  { id: "cowork-antigua-1", name: "Cowork — Antigua",    category: "cowork", lat: 14.563, lng: -90.734 },
  { id: "banco-antigua-1", name: "Banco/ATM — Antigua",  category: "banco", lat: 14.560, lng: -90.733 },
  { id: "hotel-antigua-2", name: "Hospedaje — Antigua Sur", category: "hospedaje", lat: 14.552, lng: -90.737 },

  // ——— Costa / Puerto ———
  { id: "puerto-pm-1", name: "Puerto Quetzal",          category: "puerto", lat: 13.924, lng: -90.785 },
  { id: "puerto-pm-2", name: "Muelle Secundario",       category: "puerto", lat: 13.925, lng: -90.780 },
];
