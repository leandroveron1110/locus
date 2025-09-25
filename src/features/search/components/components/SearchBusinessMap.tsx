// src/features/search/components/SearchBusinessMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SearchResultBusiness } from "@/features/search/types/search";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { BusinessMapPopup } from "./BusinessMapPopup";
import { createBusinessIcon } from "./createBusinessIcon";
import { defaultLeafletIconOptions } from "./defaultLeafletIconOptions";

// Fix para los íconos de Leaflet en Next.js
defaultLeafletIconOptions();

interface SearchBusinessMapProps {
  businesses: SearchResultBusiness[];
}

const MapViewAdjuster = ({ businesses }: SearchBusinessMapProps) => {
  const map = useMap();

  useEffect(() => {
    if (businesses.length > 0) {
      const locations = businesses.map(
        (b) => [b.latitude as number, b.longitude as number] as L.LatLngTuple
      );
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [businesses, map]);

  return null;
};

const SearchBusinessMap = ({ businesses }: SearchBusinessMapProps) => {
  const defaultPosition: L.LatLngTuple = useMemo(() => [40.7128, -74.006], []);

  const validBusinesses = useMemo(
    () => businesses.filter((b) => b.latitude && b.longitude),
    [businesses]
  );

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={defaultPosition}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validBusinesses.length > 0 && (
          <MapViewAdjuster businesses={validBusinesses} />
        )}

        {validBusinesses.map((business) => {
          const icon = createBusinessIcon(business.logoUrl, business.name);
          return (
            <Marker
              key={business.id}
              position={[business.latitude!, business.longitude!]}
              icon={icon}
            >
              <Popup>
                <BusinessMapPopup business={business} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SearchBusinessMap;
