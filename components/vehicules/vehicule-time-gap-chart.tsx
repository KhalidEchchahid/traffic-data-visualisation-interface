"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function VehicleTimeGapChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/vehicles/time-gap')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, generate mock data
    const mockData = Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: 1 + Math.random() * 5,
    }))

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Time Gap (seconds)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

