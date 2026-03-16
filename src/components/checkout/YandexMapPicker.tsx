"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

interface Props {
  apiKey: string;
  onSelect: (address: string, coords: [number, number]) => void;
  initialAddress?: string;
}

const YEREVAN: [number, number] = [40.1872, 44.5152];

export default function YandexMapPicker({ apiKey, onSelect, initialAddress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const placemarkRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loaded, setLoaded] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!apiKey) return;

    const scriptId = "yandex-maps-script";
    if (document.getElementById(scriptId)) {
      if (window.ymaps) initMap();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(initMap);
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  function initMap() {
    if (!containerRef.current || mapRef.current) return;

    const map = new window.ymaps.Map(containerRef.current, {
      center: YEREVAN,
      zoom: 13,
      controls: ["zoomControl", "searchControl"],
    });

    map.events.add("click", async (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const coords: [number, number] = e.get("coords");
      setHint("...");

      try {
        const res = await window.ymaps.geocode(coords, { results: 1 });
        const obj = res.geoObjects.get(0);
        const address: string = obj ? obj.getAddressLine() : `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;

        if (placemarkRef.current) map.geoObjects.remove(placemarkRef.current);
        const mark = new window.ymaps.Placemark(coords, { balloonContent: address }, { preset: "islands#goldDotIcon" });
        map.geoObjects.add(mark);
        placemarkRef.current = mark;

        setHint(address);
        onSelect(address, coords);
      } catch {
        const address = `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;
        setHint(address);
        onSelect(address, coords);
      }
    });

    mapRef.current = map;
    setLoaded(true);
  }

  if (!apiKey) return null;

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="w-full h-56 rounded-2xl overflow-hidden border border-cream-200 shadow-soft"
        style={{ minHeight: 224 }}
      />
      {hint && (
        <p className="text-xs text-ink-500 px-1 truncate">
          📍 {hint}
        </p>
      )}
      {!loaded && (
        <p className="text-[10px] text-ink-300 px-1">Քարտեզը բեռնվում է…</p>
      )}
    </div>
  );
}
