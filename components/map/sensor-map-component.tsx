"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrafficFlowOverlay } from "@/components/map/traffic-flow-overlay";

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  // Fix the default icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Custom marker icons
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Update the MapUpdater component to handle zoom level
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);

  return null;
}

// Update the SensorMapComponent props to include more data
interface SensorMapComponentProps {
  sensors: any[];
  onSensorSelect: (sensorId: string) => void;
}

// Add visualization controls to the component
export function SensorMapComponent({
  sensors,
  onSensorSelect,
}: SensorMapComponentProps) {
  // Use the exact coordinates from the Rust code for the intersection
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    33.591, -7.6359,
  ]); // Center of the intersection
  const [mapZoom, setMapZoom] = useState(18); // Higher zoom level for better detail
  const [mapReady, setMapReady] = useState(false);
  const [showTrafficFlow, setShowTrafficFlow] = useState(true);

  // Fix Leaflet icon issue on component mount
  useEffect(() => {
    fixLeafletIcon();
    setMapReady(true);
  }, []);

  // Create custom icons
  const sensorIcon = createCustomIcon("blue");
  const warningIcon = createCustomIcon("orange");
  const faultIcon = createCustomIcon("red");
  const intersectionIcon = createCustomIcon("green");

  // Get icon based on sensor status
  const getIcon = (sensor: any) => {
    if (sensor.type === "intersection") return intersectionIcon;

    switch (sensor.status) {
      case "fault":
        return faultIcon;
      case "warning":
        return warningIcon;
      default:
        return sensorIcon;
    }
  };

  // Get circle color based on congestion level
  const getCircleColor = (level: string) => {
    switch (level) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      default:
        return "green";
    }
  };

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-md">
        <p>Initializing map...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map visualization controls */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTrafficFlow}
              onChange={() => setShowTrafficFlow(!showTrafficFlow)}
              className="h-4 w-4"
            />
            Traffic Flow
          </label>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-md z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {/* Traffic visualization layers */}
        <TrafficFlowOverlay visible={showTrafficFlow} />

        {/* Draw the intersection roads */}
        {sensors.some((s) => s.type === "intersection") && (
          <>
            {/* Horizontal road (Boulevard d'Anfa) - aligned exactly with the map */}
            <Polyline
              positions={[
                [33.591, -7.639],
                [33.591, -7.633],
              ]}
              pathOptions={{ color: "gray", weight: 20 }}
            />

            {/* Vertical road (Boulevard Mohamed Zerktouni) - aligned exactly with the map */}
            <Polyline
              positions={[
                [33.594, -7.6359],
                [33.588, -7.6359],
              ]}
              pathOptions={{ color: "gray", weight: 20 }}
            />

            {/* Road markings - updated to match new road positions */}
            <Polyline
              positions={[
                [33.591, -7.639],
                [33.591, -7.633],
              ]}
              pathOptions={{ color: "white", weight: 1, dashArray: "5, 10" }}
            />

            <Polyline
              positions={[
                [33.594, -7.6359],
                [33.588, -7.6359],
              ]}
              pathOptions={{ color: "white", weight: 1, dashArray: "5, 10" }}
            />
          </>
        )}

        {/* Render intersection circles */}
        {sensors
          .filter((s) => s.type === "intersection")
          .map((intersection) => (
            <Circle
              key={`circle-${intersection.id}`}
              center={intersection.coordinates}
              radius={20}
              pathOptions={{
                color: getCircleColor(intersection.congestionLevel || "low"),
                fillColor: getCircleColor(
                  intersection.congestionLevel || "low"
                ),
                fillOpacity: 0.4,
              }}
            />
          ))}

        {/* Render all markers */}
        {sensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={sensor.coordinates}
            icon={getIcon(sensor)}
            eventHandlers={{
              click: () => {
                onSensorSelect(sensor.id);
                setMapCenter(sensor.coordinates);
              },
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold">{sensor.name}</h3>
                <p className="text-sm">
                  Type:{" "}
                  {sensor.type === "intersection" ? "Intersection" : "Sensor"}
                </p>
                {sensor.type === "sensor" && (
                  <>
                    <p className="text-sm">Battery: {sensor.battery}%</p>
                    <p className="text-sm">
                      Status: {formatStatus(sensor.status)}
                    </p>
                    <p className="text-sm">
                      Location:{" "}
                      {sensor.id.includes("anfa")
                        ? "Anfa Blvd"
                        : "Zerktouni Blvd"}
                    </p>
                  </>
                )}
                {sensor.type === "intersection" && (
                  <>
                    <p className="text-sm">
                      Congestion: {sensor.congestionLevel}
                    </p>
                    <p className="text-sm">
                      Traffic Light: {sensor.trafficLight}
                    </p>
                    <p className="text-sm">
                      Waiting Vehicles:{" "}
                      {sensor.queue_length_by_lane
                        ? Object.values(
                            sensor.queue_length_by_lane as Record<
                              string,
                              number
                            >
                          ).reduce((a, b) => a + b, 0)
                        : "Unknown"}
                    </p>
                  </>
                )}
                <button
                  className="mt-2 text-xs text-blue-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSensorSelect(sensor.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
