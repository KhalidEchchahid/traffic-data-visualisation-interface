"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, BatteryLow, BatteryWarning, Clock, Cpu, MessageSquare, Thermometer } from "lucide-react"

interface SensorDetailViewProps {
  sensorData?: any
}

export function SensorDetailView({ sensorData }: SensorDetailViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<string>("sensor-001")
  const [sensors, setSensors] = useState<any[]>([])

  // Update sensors when new data is received
  useEffect(() => {
    if (sensorData) {
      // Check if this sensor already exists in our state
      const existingIndex = sensors.findIndex((s) => s.sensor_id === sensorData.sensor_id)

      if (existingIndex >= 0) {
        // Update existing sensor
        const updatedSensors = [...sensors]
        updatedSensors[existingIndex] = sensorData
        setSensors(updatedSensors)
      } else {
        // Add new sensor
        setSensors((prev) => [...prev, sensorData])
      }
    }
  }, [sensorData, sensors])

  // Get the selected sensor data
  const selectedData = sensors.find((s) => s.sensor_id === selectedSensor) || null

  // Helper function to get battery icon
  const getBatteryIcon = (level: number) => {
    if (level < 20) return <BatteryLow className="h-5 w-5 text-red-500" />
    if (level < 50) return <BatteryWarning className="h-5 w-5 text-yellow-500" />
    return <Battery className="h-5 w-5 text-green-500" />
  }

  // Helper function to get battery color
  const getBatteryColor = (level: number) => {
    if (level < 20) return "bg-red-500"
    if (level < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-4">
      <div>
        <Select value={selectedSensor} onValueChange={setSelectedSensor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Sensor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sensor-001">Sensor 001</SelectItem>
            <SelectItem value="sensor-002">Sensor 002</SelectItem>
            <SelectItem value="sensor-003">Sensor 003</SelectItem>
            <SelectItem value="sensor-004">Sensor 004</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedData ? (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">General Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Sensor ID:</div>
                      <div>{selectedData.sensor_id}</div>
                      <div>Last Update:</div>
                      <div>{new Date(selectedData.timestamp).toLocaleString()}</div>
                      <div>Status:</div>
                      <div>
                        {selectedData.hw_fault ? (
                          <Badge variant="destructive">Hardware Fault</Badge>
                        ) : selectedData.low_voltage ? (
                          <Badge variant="destructive">Low Voltage</Badge>
                        ) : selectedData.battery_level < 20 ? (
                          <Badge variant="destructive">Low Battery</Badge>
                        ) : (
                          <Badge variant="outline">Healthy</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Battery Status</h3>
                    <div className="flex items-center gap-2">
                      {getBatteryIcon(selectedData.battery_level)}
                      <div className="flex-1">
                        <Progress
                          value={selectedData.battery_level}
                          className={getBatteryColor(selectedData.battery_level)}
                        />
                      </div>
                      <span>{selectedData.battery_level?.toFixed(1) || 0}%</span>
                    </div>

                    <h3 className="font-medium">Temperature</h3>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      <span>{selectedData.temperature_c?.toFixed(1) || 0}°C</span>
                      {selectedData.temperature_c > 40 && <Badge variant="destructive">High</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Health Metrics</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Battery Level:</div>
                      <div>{selectedData.battery_level?.toFixed(1) || 0}%</div>
                      <div>Temperature:</div>
                      <div>{selectedData.temperature_c?.toFixed(1) || 0}°C</div>
                      <div>Hardware Fault:</div>
                      <div>{selectedData.hw_fault ? "Yes" : "No"}</div>
                      <div>Low Voltage:</div>
                      <div>{selectedData.low_voltage ? "Yes" : "No"}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Operational Metrics</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Uptime:</div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatUptime(selectedData.uptime_s || 0)}
                      </div>
                      <div>Message Count:</div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {selectedData.message_count || 0}
                      </div>
                      <div>Processor:</div>
                      <div className="flex items-center">
                        <Cpu className="mr-2 h-4 w-4" />
                        Healthy
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Message Rate</div>
                      <div className="text-2xl">
                        {(selectedData.message_count / (selectedData.uptime_s / 3600)).toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">messages per hour</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Battery Drain Rate</div>
                      <div className="text-2xl">0.42</div>
                      <div className="text-muted-foreground">% per hour</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Estimated Battery Life</div>
                      <div className="text-2xl">{Math.floor(selectedData.battery_level / 0.42)}</div>
                      <div className="text-muted-foreground">hours remaining</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Data Quality</div>
                      <div className="text-2xl">98.7%</div>
                      <div className="text-muted-foreground">valid readings</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No data available for the selected sensor</div>
      )}
    </div>
  )
}

// Helper function to format uptime
function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m ${seconds % 60}s`
}

