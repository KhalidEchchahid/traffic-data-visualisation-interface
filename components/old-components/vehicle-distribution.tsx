"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface VehicleDistributionProps {
  data: {
    cars: number
    buses: number
    motorcycles: number
    trucks: number
    [key: string]: number
  }
}

export function VehicleDistribution({ data }: VehicleDistributionProps) {
  // Transform the data for the pie chart
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Colors for different vehicle types
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value} vehicles`, "Count"]}
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #ccc" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

