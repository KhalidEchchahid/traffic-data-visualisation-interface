"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useEventSource } from "@/hooks/use-event-source"

export function TrafficDensityChart() {
  const [densityData, setDensityData] = useState<{ time: string; value: number }[]>([])
  const trafficData = useEventSource("http://localhost:3001/api/traffic/stream")

  // Update chart data when new traffic data is received
  useEffect(() => {
    if (trafficData && trafficData.density !== undefined) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

      setDensityData((prev) => {
        const newData = [...prev, { time: now, value: trafficData.density }]
        // Keep only the last 30 data points
        return newData.slice(-30)
      })
    }
  }, [trafficData])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={densityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: "Vehicles/km", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload.time}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Density</span>
                        <span className="font-bold text-muted-foreground">{payload[0].value} vehicles/km</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--primary)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--primary)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

