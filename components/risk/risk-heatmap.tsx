"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface RiskHeatmapProps {
  timeRange: { start: Date; end: Date };
}

interface RiskZone {
  id: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  incidents: number;
  primaryFactor: string;
  location: string;
  congestionLevel?: string;
}

// Dynamically import MapContainer with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export function RiskHeatmap({ timeRange }: RiskHeatmapProps) {
  const [loading, setLoading] = useState(true);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  useEffect(() => {
    const fetchRiskData = async () => {
      console.log("trying to fetch data here ")
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/risk/heatmap?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`
        );
        console.log(response);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        setRiskZones(await response.json());
      } catch (error) {
        console.error("Failed to fetch risk data:", error);
        setRiskZones(generateMockRiskZones());
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [timeRange]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return "#ef4444";
    if (score >= 60) return "#f97316";
    if (score >= 40) return "#facc15";
    if (score >= 20) return "#84cc16";
    return "#22c55e";
  };

  const generateMockRiskZones = (): RiskZone[] => {
    const baseLat = 37.7749;
    const baseLng = -122.4194;
    return Array.from({ length: 15 }, (_, i) => ({
      id: `zone-${i}`,
      latitude: baseLat + (Math.random() - 0.5) * 0.1,
      longitude: baseLng + (Math.random() - 0.5) * 0.1,
      riskScore: Math.floor(Math.random() * 100),
      incidents: Math.floor(Math.random() * 20),
      primaryFactor: ["Congestion", "Incident", "Near Miss", "Collision", "Risky Behavior"][
        Math.floor(Math.random() * 5)
      ],
      location: `Intersection ${i + 1}`,
    }));
  };

  if (typeof window === "undefined" || loading) {
    return <Skeleton className="w-full h-full rounded-md" />;
  }

  const center = riskZones.length > 0
    ? [riskZones.reduce((a, b) => a.riskScore > b.riskScore ? a : b).latitude,
       riskZones.reduce((a, b) => a.riskScore > b.riskScore ? a : b).longitude]
    : [37.7749, -122.4194];

  return (
    <div className="w-full h-[500px] rounded-md">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {riskZones.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={[zone.latitude, zone.longitude]}
            radius={10 + zone.riskScore / 10}
            pathOptions={{
              color: getRiskColor(zone.riskScore),
              fillColor: getRiskColor(zone.riskScore),
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold mb-2">{zone.location}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span>Risk:</span>
                  <span 
                    className="px-2 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: getRiskColor(zone.riskScore) }}
                  >
                    {zone.riskScore}
                  </span>
                </div>
                <p className="mb-1">Factor: {zone.primaryFactor}</p>
                <p>Incidents: {zone.incidents}</p>
                {zone.congestionLevel && (
                  <p className="mt-1">Congestion: {zone.congestionLevel}</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}