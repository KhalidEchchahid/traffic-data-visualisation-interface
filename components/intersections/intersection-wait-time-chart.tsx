"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function IntersectionWaitTimeChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/intersections/wait-time-analysis')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, generate mock data
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      "bd-anfa-bd-zerktouni": 20 + Math.random() * 40,
      "bd-zerktouni-bd-ghandi": 15 + Math.random() * 35,
      "bd-anfa-bd-massira": 10 + Math.random() * 30,
    }))

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" label={{ value: "Hour of Day", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Wait Time (seconds)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="bd-anfa-bd-zerktouni"
          name="Anfa/Zerktouni"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="bd-zerktouni-bd-ghandi" name="Zerktouni/Ghandi" stroke="#82ca9d" />
        <Line type="monotone" dataKey="bd-anfa-bd-massira" name="Anfa/Massira" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}

