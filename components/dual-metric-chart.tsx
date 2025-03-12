"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface DualMetricChartProps {
  data: {
    time: string
    metric1: number
    metric2: number
  }[]
  metric1Name?: string
  metric2Name?: string
}

export function DualMetricChart({
  data,
  metric1Name = "North-South Flow",
  metric2Name = "East-West Flow",
}: DualMetricChartProps) {
  const [chartData, setChartData] = useState(data)

  // Update chart data when props change
  useEffect(() => {
    setChartData(data)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
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
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{metric1Name}</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col col-start-2">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{metric2Name}</span>
                      <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              )
            }

            return null
          }}
        />
        <Legend />
        <Line
          name={metric1Name}
          type="monotone"
          dataKey="metric1"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#ff6b84", opacity: 0.8 },
          }}
          style={{
            stroke: "#ff6b84",
          }}
        />
        <Line
          name={metric2Name}
          type="monotone"
          dataKey="metric2"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#36a2eb", opacity: 0.8 },
          }}
          style={{
            stroke: "#36a2eb",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

