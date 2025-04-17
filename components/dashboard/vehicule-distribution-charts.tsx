"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface VehicleDistributionChartProps {
  data?: {
    cars: number
    buses: number
    motorcycles: number
    trucks: number
  }
}

export function VehicleDistributionChart({ data }: VehicleDistributionChartProps) {
  // Default data if none provided
  const chartData = data
    ? [
        { name: "Cars", value: data.cars || 0 },
        { name: "Buses", value: data.buses || 0 },
        { name: "Motorcycles", value: data.motorcycles || 0 },
        { name: "Trucks", value: data.trucks || 0 },
      ]
    : [
        { name: "Cars", value: 0 },
        { name: "Buses", value: 0 },
        { name: "Motorcycles", value: 0 },
        { name: "Trucks", value: 0 },
      ]

  // Colors for different vehicle types
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
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
          <Tooltip formatter={(value: number) => [`${value} vehicles`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

