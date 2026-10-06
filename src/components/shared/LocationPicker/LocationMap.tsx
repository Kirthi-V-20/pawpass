"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { COLORS } from "@/styles/colors";

type Position = [number, number];

interface LocationMapProps {
  position: Position;
  selectedPosition: Position | null;
}

const locationIcon = L.divIcon({
  className: "pawpass-location-marker",

  html: `
    <div
      style="
        width: 34px;
        height: 34px;
        background: ${COLORS.primary.DEFAULT};
        border: 3px solid ${COLORS.neutral.white};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          background: ${COLORS.neutral.white};
          border-radius: 50%;
        "
      ></div>
    </div>
  `,

  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapController({ position }: { position: Position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 17, {
      animate: true,
      duration: 1,
    });
  }, [map, position]);

  return null;
}

export default function LocationMap({
  position,
  selectedPosition,
}: LocationMapProps) {
  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController position={position} />

      {selectedPosition && (
        <Marker position={selectedPosition} icon={locationIcon} />
      )}
    </MapContainer>
  );
}
