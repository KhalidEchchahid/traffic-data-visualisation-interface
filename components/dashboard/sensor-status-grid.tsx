"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Battery, BatteryLow, BatteryWarning, Thermometer } from "lucide-react"
import { useEventSource } from "@/hooks/use-event-source"

export function SensorStatusGrid() {
  const [sensors, setSensors] = useState<any[]>([])
  const sensorData = useEventSource("http://localhost:3001/api/sensor/stream")

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

  // Helper function to get battery icon
  const getBatteryIcon = (level: number) => {
    if (level < 20) return <BatteryLow className="h-4 w-4 text-red-500" />
    if (level < 50) return <BatteryWarning className="h-4 w-4 text-yellow-500" />
    return <Battery className="h-4 w-4 text-green-500" />
  }

  // Helper function to get status badge
  const getStatusBadge = (sensor: any) => {
    if (sensor.hw_fault) {
      return <Badge variant="destructive">Hardware Fault</Badge>
    }

    if (sensor.low_voltage) {
      return <Badge variant="outline">Low Voltage</Badge>
    }

    if (sensor.battery_level < 20) {
      return <Badge variant="outline">Low Battery</Badge>
    }

    if (sensor.temperature_c > 40) {
      return <Badge variant="outline">High Temperature</Badge>
    }

    return <Badge variant="outline">Healthy</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sensor ID</TableHead>
          <TableHead>Battery</TableHead>
          <TableHead>Temperature</TableHead>
          <TableHead>Uptime</TableHead>
          <TableHead>Messages</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sensors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No sensor data available
            </TableCell>
          </TableRow>
        ) : (
          sensors.map((sensor) => (
            <TableRow key={sensor.sensor_id}>
              <TableCell className="font-medium">{sensor.sensor_id}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getBatteryIcon(sensor.battery_level)}
                  <span className="ml-2">{sensor.battery_level?.toFixed(1) || 0}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  {sensor.temperature_c?.toFixed(1) || 0}°C
                </div>
              </TableCell>
              <TableCell>{formatUptime(sensor.uptime_s || 0)}</TableCell>
              <TableCell>{sensor.message_count || 0}</TableCell>
              <TableCell>{getStatusBadge(sensor)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
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

