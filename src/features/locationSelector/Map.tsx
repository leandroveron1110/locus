// src/components/Map.tsx
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SearchControl from "./SearchControl";
import DraggableMarker from "./DraggableMarker";
import { Map, LocateFixed } from "lucide-react"; // Iconos de Lucide React

const RecenterControl = ({ onClick }: { onClick: () => void }) => {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={onClick}
          title="Centrar en mi ubicación"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            border: 'none',
            padding: '0',
            background: 'white',
          }}
        >
          <LocateFixed size={20} />
        </button>
      </div>
    </div>
  );
};

const MapComponent = () => {
  const [position, setPosition] = useState<[number, number]>([-32.484, -58.232]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    console.log("Coordenadas finales para guardar:", newPosition);
  };

  const recenterMap = () => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es compatible con este navegador.");
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePositionChange([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        setError("No se pudo obtener la ubicación. Por favor, revisa los permisos del navegador.");
        setLoading(false);
        console.error(err);
      }
    );
  };

  useEffect(() => {
    recenterMap(); // Centra el mapa al cargar
  }, []);

  if (loading) {
    return (
      <div style={{ height: "600px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" }}>
        <p>Cargando su ubicación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: "600px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px", color: "red" }}>
        <p>{error}</p>
        <button onClick={recenterMap}>Volver a intentar</button>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={16} // Aumenta el zoom para mayor detalle
      scrollWheelZoom={false}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterControl onClick={recenterMap} />
      <SearchControl onSearchResult={handlePositionChange} />
      <DraggableMarker
        initialPosition={position}
        onPositionChange={handlePositionChange}
      />
    </MapContainer>
  );
};

export default MapComponent;