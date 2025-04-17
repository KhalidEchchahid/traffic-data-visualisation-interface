"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Car, Gauge, Users } from "lucide-react"
import { TrafficMetricCard } from "@/components/dashboard/traffic-metric-card"
import { TrafficMap } from "@/components/dashboard/traffic-map"
import { TrafficDensityChart } from "@/components/dashboard/traffic-density-chart"
import { IntersectionStatusGrid } from "@/components/dashboard/intersection-status-grid"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { SensorStatusGrid } from "@/components/dashboard/sensor-status-grid"
import { useEventSource } from "@/hooks/use-event-source"
import { VehicleDistributionChart } from "./vehicule-distribution-charts"

export function DashboardOverview() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Use custom hook to connect to SSE endpoints
  const trafficData = useEventSource("http://localhost:3001/api/traffic/stream")
  const vehicleData = useEventSource("http://localhost:3001/api/vehicle/stream")
  const intersectionData = useEventSource("http://localhost:3001/api/intersection/stream")
  const alertData = useEventSource("http://localhost:3001/api/alert/stream")

  console.log(trafficData, vehicleData, intersectionData, alertData)
  // Update the useEffect for alertData to handle null values properly
  useEffect(() => {
    if (alertData && alertData.type) {
      toast({
        title: `New Alert: ${alertData.type.replace(/-/g, " ")}`,
        description: `Detected at ${new Date(alertData.timestamp).toLocaleTimeString()}`,
        variant: "destructive",
      })
    }
  }, [alertData, toast])

  return (
    <div className="container space-y-4 py-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Traffic Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time traffic monitoring and analysis system</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="intersections">Intersections</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TrafficMetricCard
              title="Traffic Density"
              value={trafficData?.density || 0}
              unit="vehicles/km"
              icon={<Car className="h-4 w-4 text-muted-foreground" />}
              description={trafficData?.congestion_level || "Unknown"}
              trend={10}
            />
            <TrafficMetricCard
              title="Average Speed"
              value={trafficData?.speed || 0}
              unit="km/h"
              icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
              description="Current average"
              trend={-5}
            />
            <TrafficMetricCard
              title="Pedestrian Count"
              value={trafficData?.pedestrian_count || 0}
              unit="people"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="Active pedestrians"
              trend={2}
            />
            <TrafficMetricCard
              title="Active Incidents"
              value={trafficData?.incident_detected ? 1 : 0}
              unit="incidents"
              icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
              description={trafficData?.incident_detected ? "Incident detected" : "No incidents"}
              trend={0}
              trendDirection="none"
            />
          </div>

          {/* Map and Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Live Traffic Map</CardTitle>
                <CardDescription>Real-time traffic conditions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TrafficMap trafficData={trafficData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Distribution</CardTitle>
                <CardDescription>Current vehicle types</CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleDistributionChart data={trafficData?.vehicle_type_distribution} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest traffic incidents and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentAlerts latestAlert={alertData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Density Over Time</CardTitle>
                <CardDescription>Last 30 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <TrafficDensityChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weather Conditions</CardTitle>
                <CardDescription>Current weather impact on traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Weather:</span>
                    <span className="font-medium">{trafficData?.weather_conditions || "Unknown"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{trafficData?.temperature?.toFixed(1) || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Humidity:</span>
                    <span className="font-medium">{trafficData?.humidity || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wind Speed:</span>
                    <span className="font-medium">{trafficData?.wind_speed || 0} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Road Condition:</span>
                    <span className="font-medium">{trafficData?.road_condition || "Unknown"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visibility:</span>
                    <span className="font-medium">{trafficData?.visibility || "Unknown"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Details</CardTitle>
              <CardDescription>Current traffic conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium">General</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Density:</div>
                    <div>{trafficData?.density || 0} vehicles/km</div>
                    <div>Speed:</div>
                    <div>{trafficData?.speed || 0} km/h</div>
                    <div>Travel Time:</div>
                    <div>{trafficData?.travel_time || 0} min</div>
                    <div>Vehicle Count:</div>
                    <div>{trafficData?.vehicle_number || 0}</div>
                    <div>Flow Direction:</div>
                    <div>{trafficData?.traffic_flow_direction || "Unknown"}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Participants</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Pedestrians:</div>
                    <div>{trafficData?.pedestrian_count || 0}</div>
                    <div>Bicycles:</div>
                    <div>{trafficData?.bicycle_count || 0}</div>
                    <div>Heavy Vehicles:</div>
                    <div>{trafficData?.heavy_vehicle_count || 0}</div>
                    <div>Red Light Violations:</div>
                    <div>{trafficData?.red_light_violations || 0}</div>
                    <div>Illegal Parking:</div>
                    <div>{trafficData?.illegal_parking_cases || 0}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Safety</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Incident Detected:</div>
                    <div>{trafficData?.incident_detected ? "Yes" : "No"}</div>
                    <div>Near Miss Events:</div>
                    <div>{trafficData?.near_miss_events || 0}</div>
                    <div>Accident Severity:</div>
                    <div>{trafficData?.accident_severity || "None"}</div>
                    <div>Roadwork:</div>
                    <div>{trafficData?.roadwork_detected ? "Yes" : "No"}</div>
                    <div>Air Quality:</div>
                    <div>{trafficData?.air_quality_index || 0} AQI</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intersections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intersection Status</CardTitle>
              <CardDescription>Current status of monitored intersections</CardDescription>
            </CardHeader>
            <CardContent>
              <IntersectionStatusGrid latestData={intersectionData} />
            </CardContent>
          </Card>

          {intersectionData && (
            <Card>
              <CardHeader>
                <CardTitle>Intersection Details</CardTitle>
                <CardDescription>{intersectionData.intersection_id || "Unknown Intersection"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-medium">Traffic Flow</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Stopped Vehicles:</div>
                      <div>{intersectionData.stopped_vehicles_count || 0}</div>
                      <div>Wait Time:</div>
                      <div>{intersectionData.average_wait_time || 0} sec</div>
                      <div>Left Turns:</div>
                      <div>{intersectionData.left_turn_count || 0}</div>
                      <div>Right Turns:</div>
                      <div>{intersectionData.right_turn_count || 0}</div>
                      <div>Lane Occupancy:</div>
                      <div>{intersectionData.lane_occupancy || 0}%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Speed & Direction</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>North-South Speed:</div>
                      <div>{intersectionData.average_speed_by_direction?.north_south || 0} km/h</div>
                      <div>East-West Speed:</div>
                      <div>{intersectionData.average_speed_by_direction?.east_west || 0} km/h</div>
                      <div>Crossing Time:</div>
                      <div>{intersectionData.intersection_crossing_time || 0} sec</div>
                      <div>Traffic Light:</div>
                      <div>{intersectionData.traffic_light_status || "Unknown"}</div>
                      <div>Light Impact:</div>
                      <div>{intersectionData.traffic_light_impact || "Unknown"}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Safety & Compliance</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Light Compliance:</div>
                      <div>{intersectionData.traffic_light_compliance_rate || 0}%</div>
                      <div>Pedestrians:</div>
                      <div>{intersectionData.pedestrians_crossing || 0}</div>
                      <div>Jaywalking:</div>
                      <div>{intersectionData.jaywalking_pedestrians || 0}</div>
                      <div>Cyclists:</div>
                      <div>{intersectionData.cyclists_crossing || 0}</div>
                      <div>Risky Behavior:</div>
                      <div>{intersectionData.risky_behavior_detected ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Status</CardTitle>
              <CardDescription>Health status of all sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorStatusGrid />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

