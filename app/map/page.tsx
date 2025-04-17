import { SensorMapView } from "@/components/map/sensor-map-view";

export default function MapPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sensor Map</h1>
        <p className="text-muted-foreground">
          Geographic visualization of traffic sensors and intersections
        </p>
      </div>

      <SensorMapView />
    </div>
  );
}
