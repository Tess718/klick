"use client";

import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { countryCoordinates } from "@/lib/country-coordinates";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

          let fullName = country;
          try {
            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
            fullName = regionNames.of(country) || country;
          } catch (e) {}

          return (
            <Marker key={country} coordinates={coords}>
              <title>{fullName}: {_count} click{_count === 1 ? '' : 's'}</title>
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
