"use client";

import { useEffect, useState } from "react";
import { useEventSource } from "@/hooks/use-event-source";
import { Polyline, Circle } from "react-leaflet";

interface TrafficFlowOverlayProps {
  visible: boolean;
}

export function TrafficFlowOverlay({ visible }: TrafficFlowOverlayProps) {
  const [flowData, setFlowData] = useState<any>(null);
  const trafficData = useEventSource(
    "http://localhost:3001/api/traffic/stream"
  );
  const intersectionData = useEventSource(
    "http://localhost:3001/api/intersection/stream"
  );

  // Update flow data when new traffic data is received
  useEffect(() => {
    if (!visible) return;

    // Combine traffic and intersection data
    if (trafficData || intersectionData) {
      setFlowData({
        speed: trafficData?.speed || 0,
        congestionLevel: trafficData?.congestion_level || "low",
        northSouthSpeed:
          intersectionData?.average_speed_by_direction?.north_south || 0,
        eastWestSpeed:
          intersectionData?.average_speed_by_direction?.east_west || 0,
        trafficLightStatus: intersectionData?.traffic_light_status || "green",
      });
    }
  }, [trafficData, intersectionData, visible]);

  if (!visible || !flowData) return null;

  // Get color based on congestion level
  const getFlowColor = (speed: number) => {
    if (speed < 20) return "red";
    if (speed < 40) return "orange";
    return "green";
  };

  // Get line width based on speed (thicker = more traffic)
  const getLineWidth = (speed: number) => {
    return Math.max(2, Math.min(10, (100 - speed) / 10));
  };

  // Get traffic light color
  const getTrafficLightColor = (status: string) => {
    switch (status) {
      case "red":
        return "red";
      case "yellow":
        return "yellow";
      case "green":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <>
      {/* North-South flow (Boulevard Mohamed Zerktouni) - perfectly aligned with the map */}
      <Polyline
        positions={[
          [33.594, -7.6359],
          [33.588, -7.6359],
        ]}
        pathOptions={{
          color: getFlowColor(flowData.northSouthSpeed),
          weight: getLineWidth(flowData.northSouthSpeed),
          opacity: 0.7,
          dashArray: "10, 10",
        }}
      />

      {/* East-West flow (Boulevard d'Anfa) - perfectly aligned with the map */}
      <Polyline
        positions={[
          [33.591, -7.639],
          [33.591, -7.633],
        ]}
        pathOptions={{
          color: getFlowColor(flowData.eastWestSpeed),
          weight: getLineWidth(flowData.eastWestSpeed),
          opacity: 0.7,
          dashArray: "10, 10",
        }}
      />

      {/* Traffic light indicator */}
      <Circle
        center={[33.591, -7.6359]}
        radius={5}
        pathOptions={{
          color: getTrafficLightColor(flowData.trafficLightStatus),
          fillColor: getTrafficLightColor(flowData.trafficLightStatus),
          fillOpacity: 0.8,
        }}
      />
    </>
  );
}
