"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TrafficDensitySpeedChartProps {
  timeRange: { start: Date; end: Date }
}

export function TrafficDensitySpeedChart({ timeRange }: TrafficDensitySpeedChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch data based on timeRange
    // This is a placeholder. Replace with actual API call.
    const fetchData = async () => {
      // Simulating API call
      const response = await fetch(
        `http://localhost:3001/api/historical/traffic?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
      )
      const result = await response.json()
      setData(result)
    }

    fetchData()
  }, [timeRange])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="timestamp" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Line yAxisId="left" type="monotone" dataKey="density" stroke="#8884d8" />
        <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

