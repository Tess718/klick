"use client";

import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Approximate coordinates for countries (using 2-letter codes or names).
// In a real app, you'd map the country names returned by Vercel/analytics to exact lat/lng.
// For this demo, let's use a small dictionary or just fallback to generic markers.
const countryCoordinates: Record<string, [number, number]> = {
  US: [-95.7129, 37.0902],
  GB: [-3.4359, 55.3781],
  FR: [2.2137, 46.2276],
  DE: [10.4515, 51.1657],
  IN: [78.9629, 20.5937],
  CA: [-106.3468, 56.1304],
  AU: [133.7751, -25.2744],
  BR: [-51.9253, -14.235],
  JP: [138.2529, 36.2048],
  CN: [104.1954, 35.8617],
  // Add more as needed or use a robust geocoding lookup
};

type CountryData = {
  country: string | null;
  _count: number;
};

export function WorldMapChart({ data }: { data: CountryData[] }) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d._count), 1);
  }, [data]);

  const sizeScale = scaleLinear().domain([1, maxValue]).range([4, 24]);

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#193497"
                className=""
                stroke="#193497"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none", opacity: 0.25 },
                  hover: { outline: "none", fill: "#193497", opacity: 0.1 },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {data.map(({ country, _count }) => {
          if (!country) return null;
          // Vercel returns ISO 3166-1 alpha-2 country codes (e.g., "US").
          const coords = countryCoordinates[country];
          if (!coords) return null;

          return (
            <Marker key={country} coordinates={coords}>
              <circle
                r={sizeScale(_count)}
                fill="#193497" // COBALT
                className=""
                fillOpacity={0.8}
                stroke="#F9F6EF" // PAPER
                strokeWidth={1.5}
              />
              <text
                textAnchor="middle"
                y={-sizeScale(_count) - 5}
                style={{ fontFamily: "system-ui", fill: "#282828", fontSize: "10px", fontWeight: "bold" }}
              >
                {_count}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
