"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function VehicleSpeedDistribution() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/vehicles/speed-distribution')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, use mock data
    const mockData = [
      { range: "0-20", count: 5 },
      { range: "21-40", count: 15 },
      { range: "41-60", count: 35 },
      { range: "61-80", count: 25 },
      { range: "81-100", count: 15 },
      { range: "101+", count: 5 },
    ]

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" label={{ value: "Speed (km/h)", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Vehicle Count", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

