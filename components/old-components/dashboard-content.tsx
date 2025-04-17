"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Car,
  Gauge,
  Info,
  Users,
  Zap,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrafficMap } from "@/components/old-components/traffic-map";
import { CongestionChart } from "@/components/old-components/congestion-chart";
import { VehicleDistribution } from "@/components/old-components/vehicle-distribution";
import { TrafficLightGrid } from "@/components/old-components/traffic-light-grid";
import { useToast } from "@/components/ui/use-toast";
import { DualMetricChart } from "@/components/old-components/dual-metric-chart";
import { QueueLengthChart } from "./queue-lenght-chart";
import { IntersectionPerformanceChart } from "./intersaction-performance-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Updated interface to match the new data structure
interface SensorData {
  sensor_id: string;
  timestamp: string;
  // Common fields that might be in any data type
  [key: string]: any;
}

interface TrafficData extends SensorData {
  congestion_level: string;
  density: number;
  speed: number;
  incident_detected?: boolean;
  pedestrian_count?: number;
  vehicle_type_distribution?: {
    cars: number;
    buses: number;
    motorcycles: number;
    trucks: number;
    [key: string]: number;
  };
}

interface IntersectionData extends SensorData {
  intersection_id: string;
  traffic_light_compliance_rate?: number;
  queue_length_by_lane?: {
    lane1: number;
    lane2: number;
    lane3: number;
    [key: string]: number;
  };
  traffic_light_status?: string;
  average_wait_time?: number;
  intersection_crossing_time?: number;
  stopped_vehicles_count?: number;
  average_speed_by_direction?: {
    [key: string]: number;
  };
  pedestrians_crossing?: number;
  jaywalking_pedestrians?: number;
  cyclists_crossing?: number;
  risky_behavior_detected?: boolean;
  intersection_congestion_level?: string;
  near_miss_incidents?: number;
  collision_count?: number;
  sudden_braking_events?: number;
}

interface VehicleData extends SensorData {
  vehicle_id?: string;
  speed_kmh?: number;
  vehicle_class?: string;
  length_dm?: number;
  status?: number;
}

interface SensorHealthData extends SensorData {
  battery_level?: number;
  temperature_c?: number;
  hw_fault?: boolean;
  low_voltage?: boolean;
  uptime_s?: number;
}

interface AlertData extends SensorData {
  type: string;
  severity: string;
  location_id?: string;
  description: string;
}

interface IntersectionPerformanceData {
  time: string;
  queueLength: number;
  waitTime: number;
  crossingTime: number;
  intersection_id?: string;
}

export function DashboardContent() {
  const [trafficData, setTrafficData] = useState<Map<string, TrafficData>>(
    new Map()
  );
  const [intersectionData, setIntersectionData] = useState<
    Map<string, IntersectionData>
  >(new Map());
  const [vehicleData, setVehicleData] = useState<Map<string, VehicleData[]>>(
    new Map()
  );
  const [sensorHealthData, setSensorHealthData] = useState<
    Map<string, SensorHealthData>
  >(new Map());
  const [alertData, setAlertData] = useState<AlertData[]>([]);

  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [selectedIntersection, setSelectedIntersection] = useState<string>("");

  const [congestionHistory, setCongestionHistory] = useState<
    { time: string; value: number; sensor_id: string }[]
  >([]);
  const [dualMetricData, setDualMetricData] = useState<
    {
      time: string;
      metric1: number;
      metric2: number;
      intersection_id: string;
    }[]
  >([]);
  const [intersectionPerformance, setIntersectionPerformance] = useState<
    IntersectionPerformanceData[]
  >([]);

  const { toast } = useToast();

  // Helper function to get the most recent data for a specific sensor
  const getSelectedTrafficData = (): TrafficData | null => {
    if (!selectedSensor) return null;
    return trafficData.get(selectedSensor) || null;
  };

  // Helper function to get the most recent data for a specific intersection
  const getSelectedIntersectionData = (): IntersectionData | null => {
    if (!selectedIntersection) return null;
    return intersectionData.get(selectedIntersection) || null;
  };

  useEffect(() => {
    // Function to connect to the SSE endpoints
    const connectToStreams = () => {
      // Connect to traffic data stream
      const trafficEventSource = new EventSource(
        "http://localhost:3001/api/traffic/stream"
      );
      trafficEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as TrafficData;

          // Update traffic data map
          setTrafficData((prev) => {
            const newMap = new Map(prev);
            newMap.set(data.sensor_id, data);
            return newMap;
          });

          // If this is the first sensor and no sensor is selected, select it
          setSelectedSensor((prev) => prev || data.sensor_id);

          // Add to congestion history
          const congestionValue = getCongestionValue(data.congestion_level);
          const now = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          setCongestionHistory((prev) => {
            const newHistory = [
              ...prev,
              { time: now, value: congestionValue, sensor_id: data.sensor_id },
            ];
            // Keep only the last 15 minutes of data per sensor
            return newHistory.filter(
              (item) =>
                item.sensor_id !== data.sensor_id ||
                prev.filter((p) => p.sensor_id === data.sensor_id).length < 15
            );
          });
        } catch (error) {
          console.error("Error parsing traffic SSE data:", error);
        }
      };

      // Connect to intersection data stream
      const intersectionEventSource = new EventSource(
        "http://localhost:3001/api/intersection/stream"
      );
      intersectionEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as IntersectionData;

          // Update intersection data map
          setIntersectionData((prev) => {
            const newMap = new Map(prev);
            newMap.set(data.intersection_id, data);
            return newMap;
          });

          // If this is the first intersection and no intersection is selected, select it
          setSelectedIntersection((prev) => prev || data.intersection_id);

          // Add to dual metric data - using the averageSpeedByDirection from the data
          if (data.average_speed_by_direction) {
            const now = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            setDualMetricData((prev) => {
              const newData = [
                ...prev,
                {
                  time: now,
                  metric1:
                    data.average_speed_by_direction["north_south"] ||
                    data.average_speed_by_direction["north-south"] ||
                    0,
                  metric2:
                    data.average_speed_by_direction["east_west"] ||
                    data.average_speed_by_direction["east-west"] ||
                    0,
                  intersection_id: data.intersection_id,
                },
              ];
              // Keep only the last 20 data points per intersection
              return newData.filter(
                (item) =>
                  item.intersection_id !== data.intersection_id ||
                  prev.filter((p) => p.intersection_id === data.intersection_id)
                    .length < 20
              );
            });
          }

          // Update intersection performance data
          if (
            data.queue_length_by_lane &&
            data.average_wait_time &&
            data.intersection_crossing_time
          ) {
            setIntersectionPerformance((prev) => {
              const newData = [
                ...prev,
                {
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  queueLength: Math.max(
                    ...Object.values(data.queue_length_by_lane)
                  ),
                  waitTime: data.average_wait_time,
                  crossingTime: data.intersection_crossing_time,
                  intersection_id: data.intersection_id,
                },
              ];
              // Keep only the last 10 data points per intersection
              return newData.filter(
                (item) =>
                  item.intersection_id !== data.intersection_id ||
                  prev.filter((p) => p.intersection_id === data.intersection_id)
                    .length < 10
              );
            });
          }
        } catch (error) {
          console.error("Error parsing intersection SSE data:", error);
        }
      };

      // Connect to vehicle data stream
      const vehicleEventSource = new EventSource(
        "http://localhost:3001/api/vehicle/stream"
      );
      vehicleEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as VehicleData;

          // Update vehicle data map
          setVehicleData((prev) => {
            const newMap = new Map(prev);
            const sensorVehicles = newMap.get(data.sensor_id) || [];
            // Add new vehicle data, limit to 100 vehicles per sensor
            newMap.set(data.sensor_id, [data, ...sensorVehicles].slice(0, 100));
            return newMap;
          });
        } catch (error) {
          console.error("Error parsing vehicle SSE data:", error);
        }
      };

      // Connect to sensor health data stream
      const sensorHealthEventSource = new EventSource(
        "http://localhost:3001/api/sensor/stream"
      );
      sensorHealthEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SensorHealthData;

          // Update sensor health data map
          setSensorHealthData((prev) => {
            const newMap = new Map(prev);
            newMap.set(data.sensor_id, data);
            return newMap;
          });
        } catch (error) {
          console.error("Error parsing sensor health SSE data:", error);
        }
      };

      // Connect to alert data stream
      const alertEventSource = new EventSource(
        "http://localhost:3001/api/alert/stream"
      );
      alertEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AlertData;

          // Add to alerts list
          setAlertData((prev) => {
            // Add new alert to the beginning of the array
            const newAlerts = [data, ...prev].slice(0, 50); // Keep only the last 50 alerts

            // Show toast notification for new alerts
            if (data.severity === "high" || data.severity === "critical") {
              toast({
                title: `${data.severity.toUpperCase()} Alert: ${data.type}`,
                description: data.description,
                variant: "destructive",
              });
            }

            return newAlerts;
          });
        } catch (error) {
          console.error("Error parsing alert SSE data:", error);
        }
      };

      // Handle errors and cleanup
      const handleError = (source: EventSource, name: string) => {
        source.onerror = () => {
          console.error(`${name} SSE connection error`);
          source.close();
          // Try to reconnect after 5 seconds
          setTimeout(() => connectToStreams(), 5000);
        };
      };

      handleError(trafficEventSource, "Traffic");
      handleError(intersectionEventSource, "Intersection");
      handleError(vehicleEventSource, "Vehicle");
      handleError(sensorHealthEventSource, "Sensor Health");
      handleError(alertEventSource, "Alert");

      // Return cleanup function
      return () => {
        trafficEventSource.close();
        intersectionEventSource.close();
        vehicleEventSource.close();
        sensorHealthEventSource.close();
        alertEventSource.close();
      };
    };

    const cleanup = connectToStreams();

    // Cleanup function
    return cleanup;
  }, [toast]);

  // Helper function to convert congestion level to numeric value
  const getCongestionValue = (level: string): number => {
    switch (level?.toLowerCase()) {
      case "low":
        return 25;
      case "medium":
        return 50;
      case "high":
        return 75;
      case "severe":
        return 100;
      default:
        return 0;
    }
  };

  // If no data yet, show loading state
  if (trafficData.size === 0 && intersectionData.size === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading traffic data...</h2>
          <p className="text-muted-foreground">
            Connecting to real-time data stream
          </p>
        </div>
      </div>
    );
  }

  // Get the selected data
  const selectedTraffic = getSelectedTrafficData();
  const selectedIntersectionData = getSelectedIntersectionData();

  // Filter history data for selected sensor/intersection
  const filteredCongestionHistory = congestionHistory.filter(
    (item) => item.sensor_id === selectedSensor
  );
  const filteredDualMetricData = dualMetricData.filter(
    (item) => item.intersection_id === selectedIntersection?.intersection_id
  );
  const filteredPerformanceData = intersectionPerformance.filter(
    (item) => item.intersection_id === selectedIntersection?.intersection_id
  );

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Traffic Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring of traffic conditions and metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sensor</p>
            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sensor" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(trafficData.keys()).map((sensorId) => (
                  <SelectItem key={sensorId} value={sensorId}>
                    {sensorId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Intersection</p>
            <Select
              value={selectedIntersection?.intersection_id || ""}
              onValueChange={(id) =>
                setSelectedIntersection(intersectionData.get(id) || null)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select intersection" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(intersectionData.keys()).map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Last updated:</span>
            <span id="last-updated" className="text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alertData.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
          <span className="font-semibold">Active Alerts:</span>
          {alertData.slice(0, 3).map((alert, index) => (
            <Badge
              key={index}
              variant={
                alert.severity === "critical" ? "destructive" : "outline"
              }
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              {alert.type}: {alert.description.substring(0, 30)}
              {alert.description.length > 30 ? "..." : ""}
            </Badge>
          ))}
          {alertData.length > 3 && (
            <Badge variant="outline">+{alertData.length - 3} more</Badge>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Traffic Density
            </CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedTraffic?.density || 0} vehicles/km
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedTraffic?.congestion_level
                ? selectedTraffic.congestion_level.charAt(0).toUpperCase() +
                  selectedTraffic.congestion_level.slice(1)
                : "Unknown"}{" "}
              congestion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedTraffic?.speed || 0} km/h
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedTraffic?.speed && selectedTraffic.speed > 40
                ? "Above"
                : "Below"}{" "}
              average for this time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intersection Status
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedIntersectionData?.intersection_congestion_level
                ? selectedIntersectionData.intersection_congestion_level
                    .charAt(0)
                    .toUpperCase() +
                  selectedIntersectionData.intersection_congestion_level.slice(
                    1
                  )
                : "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedIntersectionData?.stopped_vehicles_count || 0} vehicles
              stopped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedestrian Activity
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedTraffic?.pedestrian_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedIntersectionData?.pedestrians_crossing || 0} currently
              crossing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Incidents
            </CardTitle>
            <Info
              className={`h-4 w-4 ${
                selectedTraffic?.incident_detected
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedTraffic?.incident_detected ? "Yes" : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedIntersectionData?.collision_count || 0} collisions
              detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Signal Compliance
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedIntersectionData?.traffic_light_compliance_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedIntersectionData?.near_miss_incidents || 0} near misses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map and Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Traffic Map - Spans 4 columns */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Live Traffic Map</CardTitle>
            <CardDescription>
              Real-time traffic flow and incident monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TrafficMap
              trafficData={Array.from(trafficData.values())}
              intersectionData={Array.from(intersectionData.values())}
              selectedSensor={selectedSensor}
              selectedIntersection={selectedIntersection?.intersection_id || ""}
            />
          </CardContent>
        </Card>

        {/* Congestion Timeline - Spans 3 columns */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Congestion Timeline</CardTitle>
            <CardDescription>
              Traffic congestion levels over the last 15 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CongestionChart data={filteredCongestionHistory} />
          </CardContent>
        </Card>

        {/* Traffic Flow Comparison */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Traffic Flow Comparison</CardTitle>
            <CardDescription>
              Comparing North-South and East-West traffic flow over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DualMetricChart
              data={filteredDualMetricData}
              metric1Name="North-South Flow"
              metric2Name="East-West Flow"
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts and Grids */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IntersectionPerformanceChart data={filteredPerformanceData} />
        </div>

        {/* Vehicle Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of vehicle types in traffic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleDistribution
              data={
                selectedTraffic?.vehicle_type_distribution || {
                  cars: 0,
                  buses: 0,
                  motorcycles: 0,
                  trucks: 0,
                }
              }
            />
          </CardContent>
        </Card>

        {/* Queue Length Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Intersection Queue Length</CardTitle>
            <CardDescription>Current queue length by lane</CardDescription>
          </CardHeader>
          <CardContent>
            <QueueLengthChart
              data={
                selectedIntersectionData?.queue_length_by_lane || {
                  lane1: 0,
                  lane2: 0,
                  lane3: 0,
                }
              }
            />
          </CardContent>
        </Card>

        {/* Traffic Light Status */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Light Status</CardTitle>
            <CardDescription>
              Current status of monitored intersections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficLightGrid
              intersections={Array.from(intersectionData.values()).map(
                (data) => ({
                  id: data.intersection_id,
                  name: data.intersection_id.replace(/-/g, " "),
                  status: data.traffic_light_status || "unknown",
                  timeRemaining: Math.floor(Math.random() * 30) + 1, // Random time for demo
                })
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
