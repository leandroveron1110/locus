// src/components/SearchControl.tsx
"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

interface SearchControlProps {
  onSearchResult: (position: [number, number]) => void;
}

const SearchControl = ({ onSearchResult }: SearchControlProps) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const GeoSearchControl = require("leaflet-geosearch").GeoSearchControl;

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      autoClose: true,
      keepResult: true,
      showMarker: false, // Asegura que el buscador no agregue un marcador propio
    });

    map.addControl(searchControl);

    // Escuchamos el evento de búsqueda
    map.on("geosearch/showlocation", (e: any) => {
      // Usamos flyTo para centrar el mapa suavemente en la nueva ubicación
      map.flyTo([e.location.y, e.location.x], 16, {
        animate: true,
        duration: 0.5,
      });

      // Le pasamos la nueva posición al componente padre para que actualice el marcador arrastrable
      onSearchResult([e.location.y, e.location.x]);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSearchResult]);

  return null;
};

export default SearchControl;