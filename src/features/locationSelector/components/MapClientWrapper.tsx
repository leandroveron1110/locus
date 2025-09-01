// src/components/MapClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Usamos dynamic para importar el componente del mapa del lado del cliente
const MapComponent = dynamic(() => import("./Map/LocationSelector"), {
  ssr: false, // Deshabilita el Server-Side Rendering
});

export default function MapClientWrapper() {
  return <MapComponent />;
}