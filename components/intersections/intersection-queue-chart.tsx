"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function IntersectionQueueChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/intersections/queue-analysis')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, generate mock data
    const mockData = [
      { name: "bd-anfa-bd-zerktouni", lane1: 12, lane2: 10, lane3: 8 },
      { name: "bd-zerktouni-bd-ghandi", lane1: 8, lane2: 15, lane3: 12 },
      { name: "bd-anfa-bd-massira", lane1: 5, lane2: 7, lane3: 9 },
      { name: "bd-zerktouni-bd-ibnsina", lane1: 10, lane2: 8, lane3: 6 },
    ]

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Queue Length (vehicles)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="lane1" name="Lane 1" fill="#8884d8" />
        <Bar dataKey="lane2" name="Lane 2" fill="#82ca9d" />
        <Bar dataKey="lane3" name="Lane 3" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

