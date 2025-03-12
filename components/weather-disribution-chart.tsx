"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface WeatherDistributionChartProps {
  timeRange: { start: Date; end: Date }
}

export function WeatherDistributionChart({ timeRange }: WeatherDistributionChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch data based on timeRange
    // This is a placeholder. Replace with actual API call.
    const fetchData = async () => {
      // Simulating API call
      const response = await fetch(
        `http://localhost:3001/api/historical/weather?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
      )
      const result = await response.json()
      setData(result)
    }

    fetchData()
  }, [timeRange])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

