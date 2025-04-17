"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SensorHealthChart() {
  const [data, setData] = useState<any[]>([])
  const [metric, setMetric] = useState<"battery" | "temperature">("battery")

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch(`/api/sensors/health?metric=${metric}`)
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, generate mock data
    const mockData = Array.from({ length: 24 }, (_, i) => {
      const hour = i

      // Generate realistic battery levels (decreasing over time)
      const batteryBase = 100 - i * 1.5

      // Generate realistic temperatures (following a daily cycle)
      const tempBase = 20 + Math.sin(((i - 6) * Math.PI) / 12) * 10

      return {
        hour,
        "sensor-001":
          metric === "battery" ? Math.max(0, batteryBase + Math.random() * 5) : tempBase + Math.random() * 3,
        "sensor-002":
          metric === "battery" ? Math.max(0, batteryBase - 5 + Math.random() * 5) : tempBase - 2 + Math.random() * 3,
        "sensor-003":
          metric === "battery" ? Math.max(0, batteryBase - 10 + Math.random() * 5) : tempBase + 2 + Math.random() * 3,
        "sensor-004":
          metric === "battery" ? Math.max(0, batteryBase - 15 + Math.random() * 5) : tempBase - 4 + Math.random() * 3,
      }
    })

    setData(mockData)
  }, [metric])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Select value={metric} onValueChange={(value: "battery" | "temperature") => setMetric(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="battery">Battery Level</SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: "Hour of Day", position: "insideBottom", offset: -5 }} />
            <YAxis
              label={{
                value: metric === "battery" ? "Battery Level (%)" : "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sensor-001" name="Sensor 001" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="sensor-002" name="Sensor 002" stroke="#82ca9d" />
            <Line type="monotone" dataKey="sensor-003" name="Sensor 003" stroke="#ffc658" />
            <Line type="monotone" dataKey="sensor-004" name="Sensor 004" stroke="#ff8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

