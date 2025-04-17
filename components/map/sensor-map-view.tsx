"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEventSource } from "@/hooks/use-event-source"
import dynamic from "next/dynamic"

// Update the imports to include Polyline
const SensorMapComponent = dynamic(
  () => import("@/components/map/sensor-map-component").then((mod) => mod.SensorMapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-muted rounded-md">
        <p>Loading map...</p>
      </div>
    ),
  },
)

export function SensorMapView() {
  const [activeTab, setActiveTab] = useState("map")
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

  // Get real-time data from all sensors
  const trafficData = useEventSource("http://localhost:3001/api/traffic/stream")
  const intersectionData = useEventSource("http://localhost:3001/api/intersection/stream")
  const sensorData = useEventSource("http://localhost:3001/api/sensor/stream")
  const alertData = useEventSource("http://localhost:3001/api/alert/stream")

  // Combine all sensor data for display
  const [allSensors, setAllSensors] = useState<any[]>([])

  // Update sensors when new data is received
  useEffect(() => {
    // Process and combine sensor data
    const updateSensors = () => {
      // Create a map of existing sensors
      const sensorMap = new Map(allSensors.map((s) => [s.id, s]))

      // Update with new data if available
      if (sensorData && sensorData.sensor_id) {
        const id = sensorData.sensor_id
        sensorMap.set(id, {
          id,
          type: "sensor",
          name: `Sensor ${id.split("-")[1]}`,
          coordinates: getSensorCoordinates(id),
          status: sensorData.hw_fault ? "fault" : sensorData.low_voltage ? "warning" : "normal",
          battery: sensorData.battery_level,
          temperature: sensorData.temperature_c,
          lastUpdate: new Date().toISOString(),
          ...sensorData,
        })
      }

      if (intersectionData && intersectionData.intersection_id) {
        const id = intersectionData.intersection_id
        sensorMap.set(id, {
          id,
          type: "intersection",
          name: formatIntersectionName(id),
          coordinates: getIntersectionCoordinates(id),
          status: getIntersectionStatus(intersectionData),
          congestionLevel: intersectionData.intersection_congestion_level,
          trafficLight: intersectionData.traffic_light_status,
          lastUpdate: new Date().toISOString(),
          ...intersectionData,
        })
      }

      // Convert map back to array
      setAllSensors(Array.from(sensorMap.values()))
    }

    updateSensors()
  }, [sensorData, intersectionData, trafficData, alertData, allSensors])

  // Initialize with default sensors if none exist
  useEffect(() => {
    if (allSensors.length === 0) {
      setAllSensors([
        {
          id: "sensor-001",
          type: "sensor",
          name: "Sensor 001",
          coordinates: [33.5912, -7.6361],
          status: "normal",
          battery: 85,
          temperature: 28.5,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: "sensor-002",
          type: "sensor",
          name: "Sensor 002",
          coordinates: [33.5907, -7.6357],
          status: "normal",
          battery: 72,
          temperature: 29.2,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: "sensor-003",
          type: "sensor",
          name: "Sensor 003",
          coordinates: [33.5912, -7.6356],
          status: "warning",
          battery: 45,
          temperature: 31.5,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: "sensor-004",
          type: "sensor",
          name: "Sensor 004",
          coordinates: [33.5909, -7.6363],
          status: "fault",
          battery: 15,
          temperature: 35.8,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: "bd-anfa-bd-zerktouni",
          type: "intersection",
          name: "Anfa / Zerktouni",
          coordinates: [33.591, -7.6359],
          status: "normal",
          congestionLevel: "medium",
          trafficLight: "green",
          lastUpdate: new Date().toISOString(),
        },
      ])
    }
  }, [allSensors.length])

  // Handle sensor selection
  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensor(sensorId)
    setActiveTab("details")
  }

  // Get the selected sensor data
  const selectedSensorData = selectedSensor ? allSensors.find((s) => s.id === selectedSensor) : null

  return (
    <div className="space-y-4">
      <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="details">Sensor Details</TabsTrigger>
          <TabsTrigger value="list">Sensor List</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Map</CardTitle>
              <CardDescription>Geographic visualization of sensors and intersections</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[600px]">
              <SensorMapComponent sensors={allSensors} onSensorSelect={handleSensorSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Details</CardTitle>
              <CardDescription>
                {selectedSensorData ? selectedSensorData.name : "Select a sensor from the map"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSensorData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{selectedSensorData.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedSensorData.id}</p>
                    </div>
                    <Badge className={getStatusBadgeClass(selectedSensorData.status)}>
                      {formatStatus(selectedSensorData.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Location</h4>
                      <p>Coordinates: {selectedSensorData.coordinates.join(", ")}</p>
                      {selectedSensorData.type === "intersection" && <p>Intersection: {selectedSensorData.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Status</h4>
                      {selectedSensorData.type === "sensor" && (
                        <>
                          <p>Battery: {selectedSensorData.battery}%</p>
                          <p>Temperature: {selectedSensorData.temperature}°C</p>
                        </>
                      )}
                      {selectedSensorData.type === "intersection" && (
                        <>
                          <p>Congestion: {selectedSensorData.congestionLevel}</p>
                          <p>Traffic Light: {selectedSensorData.trafficLight}</p>
                        </>
                      )}
                      <p>Last Update: {new Date(selectedSensorData.lastUpdate).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedSensorData.type === "intersection" && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Traffic Data</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Stopped Vehicles:</div>
                        <div>{selectedSensorData.stopped_vehicles_count || 0}</div>
                        <div>Wait Time:</div>
                        <div>{selectedSensorData.average_wait_time || 0} sec</div>
                        <div>Compliance Rate:</div>
                        <div>{selectedSensorData.traffic_light_compliance_rate || 0}%</div>
                        <div>Pedestrians:</div>
                        <div>{selectedSensorData.pedestrians_crossing || 0}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a sensor from the map to view details
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor List</CardTitle>
              <CardDescription>All sensors and intersections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allSensors.map((sensor) => (
                  <Card
                    key={sensor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSensorSelect(sensor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{sensor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {sensor.type === "intersection" ? "Intersection" : "Sensor"}
                          </p>
                        </div>
                        <Badge className={getStatusBadgeClass(sensor.status)}>{formatStatus(sensor.status)}</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Coordinates: {sensor.coordinates.join(", ")}</p>
                        <p>Last Update: {new Date(sensor.lastUpdate).toLocaleTimeString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Update the getSensorCoordinates function with exact coordinates from the Rust code
function getSensorCoordinates(sensorId: string): [number, number] {
  // These coordinates are taken directly from the Rust code
  const coordinates: Record<string, [number, number]> = {
    "sensor-001": [33.5912, -7.6361], // bd-zerktouni-n
    "sensor-002": [33.5907, -7.6357], // bd-zerktouni-s
    "sensor-003": [33.5912, -7.6356], // bd-anfa-e
    "sensor-004": [33.5909, -7.6363], // bd-anfa-w
  }
  return coordinates[sensorId] || [33.591, -7.6359] // Default to intersection center
}

// Update the getIntersectionCoordinates function
function getIntersectionCoordinates(intersectionId: string): [number, number] {
  // For the bd-anfa-bd-zerktouni intersection, use the center point
  if (intersectionId === "bd-anfa-bd-zerktouni") {
    return [33.591, -7.6359]
  }

  // Other intersections (if needed in the future)
  const coordinates: Record<string, [number, number]> = {
    "bd-zerktouni-bd-ghandi": [33.5922, -7.6351],
    "bd-anfa-bd-massira": [33.5882, -7.6391],
    "bd-zerktouni-bd-ibnsina": [33.5862, -7.6411],
  }
  return coordinates[intersectionId] || [33.591, -7.6359]
}

// Update the formatIntersectionName function to make it more readable
function formatIntersectionName(id: string): string {
  // Special case for our main intersection
  if (id === "bd-anfa-bd-zerktouni") {
    return "Anfa & Zerktouni Intersection"
  }

  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ")
}

function getIntersectionStatus(data: any): "normal" | "warning" | "fault" {
  if (data.collision_count > 0) return "fault"
  if (data.near_miss_incidents > 0 || data.risky_behavior_detected) return "warning"
  return "normal"
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "fault":
      return "bg-destructive"
    case "warning":
      return "bg-yellow-500"
    default:
      return "bg-green-500"
  }
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

