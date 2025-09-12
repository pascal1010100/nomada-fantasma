export type Category = "wifi" | "hospedaje" | "cowork" | "banco" | "puerto";

export type Point = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
};

export const samplePoints: Point[] = [
  { id: "wifi-gua-1", name: "Wi-Fi — Centro Histórico", category: "wifi", lat: 14.621, lng: -90.513 },
  { id: "cowork-gua-1", name: "Cowork — Nodo Z4",        category: "cowork", lat: 14.615, lng: -90.516 },
  { id: "hotel-antigua-1", name: "Hospedaje — Antigua Norte", category: "hospedaje", lat: 14.574, lng: -90.733 },
  { id: "atm-mixco-1", name: "Banco/ATM — Mixco",        category: "banco", lat: 14.644, lng: -90.607 },
  { id: "puerto-pm-1", name: "Puerto Quetzal",           category: "puerto", lat: 13.924, lng: -90.785 },
];
