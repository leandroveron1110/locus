// src/features/search/components/createBusinessIcon.tsx
import L from "leaflet";

export function createBusinessIcon(logoUrl?: string, name?: string) {
  if (logoUrl) {
    return L.icon({
      iconUrl: logoUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: "rounded-full border-2 border-white shadow-md",
    });
  }

  // Marcador genérico si no hay logo
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const html = `<div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md">${initial}</div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}
