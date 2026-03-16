"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onSelect: (address: string, coords: [number, number]) => void;
}

// Yerevan centre
const YEREVAN: [number, number] = [40.1872, 44.5152];

export default function MapPicker({ onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import so Leaflet never runs on the server
    import("leaflet").then((L) => {
      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl; // eslint-disable-line @typescript-eslint/no-explicit-any
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: YEREVAN,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        const coords: [number, number] = [lat, lng];

        // Reverse geocode with Nominatim (free, no key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "hy,en" } }
          );
          const data = await res.json();
          const address: string = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          updateMarker(L, map, coords, address);
        } catch {
          const address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          updateMarker(L, map, coords, address);
        }
      });

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function updateMarker(
    L: typeof import("leaflet"),
    map: import("leaflet").Map,
    coords: [number, number],
    address: string
  ) {
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker(coords).addTo(map).bindPopup(address).openPopup();
    setHint(address);
    onSelect(address, coords);
  }

  return (
    <div className="space-y-2">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden border border-cream-200 shadow-soft"
        style={{ height: 240 }}
      />
      {hint ? (
        <p className="text-xs text-ink-500 px-1 line-clamp-2">📍 {hint}</p>
      ) : (
        <p className="text-[10px] text-ink-300 px-1">Սեղմեք քարտեզի վրա՝ հասցեն ընտրելու համար</p>
      )}
    </div>
  );
}
