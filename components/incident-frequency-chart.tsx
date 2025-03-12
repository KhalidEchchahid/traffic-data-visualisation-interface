"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface IncidentFrequencyChartProps {
  timeRange: { start: Date; end: Date }
}

export function IncidentFrequencyChart({ timeRange }: IncidentFrequencyChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch data based on timeRange
    // This is a placeholder. Replace with actual API call.
    const fetchData = async () => {
      // Simulating API call
      const response = await fetch(
        `http://localhost:3001/api/historical/incidents?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
      )
      const result = await response.json()
      setData(result)
    }

    fetchData()
  }, [timeRange])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="frequency" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

