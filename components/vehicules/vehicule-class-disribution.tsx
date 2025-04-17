"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function VehicleClassDistribution() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/vehicles/class-distribution')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, use mock data
    const mockData = [
      { name: "Passenger Car", value: 65 },
      { name: "SUV", value: 15 },
      { name: "Pickup Truck", value: 8 },
      { name: "Motorcycle", value: 5 },
      { name: "Bus", value: 3 },
      { name: "Semi Truck", value: 2 },
      { name: "Delivery Van", value: 2 },
    ]

    setData(mockData)
  }, [])

  // Colors for different vehicle types
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFCCCB"]

  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <Tooltip formatter={(value: number) => [`${value}%`, "Percentage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

