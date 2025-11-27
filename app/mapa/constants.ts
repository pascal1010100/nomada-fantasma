import { Wifi, Bed, Coffee, CreditCard, Anchor } from "lucide-react";

export const HOME_CENTER: [number, number] = [14.6907, -91.2025];
export const HOME_ZOOM = 12;

export const CATEGORIES = [
  { key: "wifi" as const, label: "Wi-Fi", icon: Wifi, color: "#00E5FF" },     // azul neón
  { key: "hospedaje" as const, label: "Hospedaje", icon: Bed, color: "#FACC15" }, // dorado farol
  { key: "cowork" as const, label: "Cowork", icon: Coffee, color: "#E879F9" }, // magenta
  { key: "banco" as const, label: "Banco/ATM", icon: CreditCard, color: "#34D399" }, // verde tesoro
  { key: "puerto" as const, label: "Puerto", icon: Anchor, color: "#EF4444" }, // rojo faro/peligro
] as const;

export type CategoryKey = typeof CATEGORIES[number]["key"];

export const WORLD_BOUNDS = {
  southWest: [-85, -180] as [number, number], // [lat, lng]
  northEast: [85, 180] as [number, number]    // [lat, lng]
} as const;

export const TILE_URLS = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
} as const;

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const PIN_STYLES = {
  container: "position:relative;width:16px;height:16px;transform:translate(-50%,-50%);",
  pulseAnimation: "@keyframes nfPulse { 0%{transform:scale(.9);opacity:.9} 70%{transform:scale(1.35);opacity:0} 100%{opacity:0} }"
} as const;
