"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IntersectionDetailViewProps {
  intersectionData?: any
}

export function IntersectionDetailView({ intersectionData }: IntersectionDetailViewProps) {
  const [selectedIntersection, setSelectedIntersection] = useState<string>("bd-anfa-bd-zerktouni")
  const [intersections, setIntersections] = useState<any[]>([])

  // Update intersections when new data is received
  useEffect(() => {
    if (intersectionData) {
      // Check if this intersection already exists in our state
      const existingIndex = intersections.findIndex((i) => i.intersection_id === intersectionData.intersection_id)

      if (existingIndex >= 0) {
        // Update existing intersection
        const updatedIntersections = [...intersections]
        updatedIntersections[existingIndex] = intersectionData
        setIntersections(updatedIntersections)
      } else {
        // Add new intersection
        setIntersections((prev) => [...prev, intersectionData])
      }
    }
  }, [intersectionData, intersections])

  // Get the selected intersection data
  const selectedData = intersections.find((i) => i.intersection_id === selectedIntersection) || null

  // Helper function to get congestion color
  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Select value={selectedIntersection} onValueChange={setSelectedIntersection}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select Intersection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bd-anfa-bd-zerktouni">Anfa / Zerktouni</SelectItem>
            <SelectItem value="bd-zerktouni-bd-ghandi">Zerktouni / Ghandi</SelectItem>
            <SelectItem value="bd-anfa-bd-massira">Anfa / Massira</SelectItem>
            <SelectItem value="bd-zerktouni-bd-ibnsina">Zerktouni / Ibn Sina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedData ? (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Flow</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-medium">General Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Intersection ID:</div>
                      <div>{selectedData.intersection_id}</div>
                      <div>Sensor ID:</div>
                      <div>{selectedData.sensor_id}</div>
                      <div>Timestamp:</div>
                      <div>{new Date(selectedData.timestamp).toLocaleString()}</div>
                      <div>Congestion Level:</div>
                      <div>
                        <Badge className={getCongestionColor(selectedData.intersection_congestion_level)}>
                          {selectedData.intersection_congestion_level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Traffic Light</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Current Status:</div>
                      <div className="capitalize">{selectedData.traffic_light_status}</div>
                      <div>Compliance Rate:</div>
                      <div>{selectedData.traffic_light_compliance_rate}%</div>
                      <div>Light Impact:</div>
                      <div>{selectedData.traffic_light_impact}</div>
                      <div>Crossing Time:</div>
                      <div>{selectedData.intersection_crossing_time} sec</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Weather & Environment</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Weather:</div>
                      <div>{selectedData.local_weather_conditions}</div>
                      <div>Fog/Smoke:</div>
                      <div>{selectedData.fog_or_smoke_detected ? "Yes" : "No"}</div>
                      <div>Ambient Light:</div>
                      <div>{selectedData.ambient_light_level} lux</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Queue Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Lane 1 Queue:</div>
                      <div>{selectedData.queue_length_by_lane?.lane1 || 0} vehicles</div>
                      <div>Lane 2 Queue:</div>
                      <div>{selectedData.queue_length_by_lane?.lane2 || 0} vehicles</div>
                      <div>Lane 3 Queue:</div>
                      <div>{selectedData.queue_length_by_lane?.lane3 || 0} vehicles</div>
                      <div>Total Stopped:</div>
                      <div>{selectedData.stopped_vehicles_count} vehicles</div>
                      <div>Lane Occupancy:</div>
                      <div>{selectedData.lane_occupancy}%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Traffic Flow</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>North-South Speed:</div>
                      <div>{selectedData.average_speed_by_direction?.north_south || 0} km/h</div>
                      <div>East-West Speed:</div>
                      <div>{selectedData.average_speed_by_direction?.east_west || 0} km/h</div>
                      <div>Left Turns:</div>
                      <div>{selectedData.left_turn_count} vehicles</div>
                      <div>Right Turns:</div>
                      <div>{selectedData.right_turn_count} vehicles</div>
                      <div>Average Wait Time:</div>
                      <div>{selectedData.average_wait_time} sec</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Incidents</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Collisions:</div>
                      <div>{selectedData.collision_count}</div>
                      <div>Near Misses:</div>
                      <div>{selectedData.near_miss_incidents}</div>
                      <div>Sudden Braking:</div>
                      <div>{selectedData.sudden_braking_events}</div>
                      <div>Wrong Way Vehicles:</div>
                      <div>{selectedData.wrong_way_vehicles}</div>
                      <div>Risky Behavior:</div>
                      <div>{selectedData.risky_behavior_detected ? "Yes" : "No"}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Pedestrians & Cyclists</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Pedestrians Crossing:</div>
                      <div>{selectedData.pedestrians_crossing}</div>
                      <div>Jaywalking:</div>
                      <div>{selectedData.jaywalking_pedestrians}</div>
                      <div>Cyclists Crossing:</div>
                      <div>{selectedData.cyclists_crossing}</div>
                      <div>Illegal Parking:</div>
                      <div>{selectedData.illegal_parking_detected ? "Yes" : "No"}</div>
                      <div>Blocking Vehicles:</div>
                      <div>{selectedData.intersection_blocking_vehicles}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No data available for the selected intersection</div>
      )}
    </div>
  )
}

