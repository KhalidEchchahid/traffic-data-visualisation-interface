"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function IntersectionComplianceChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    // const fetchData = async () => {
    //   const response = await fetch('/api/intersections/compliance-analysis')
    //   const data = await response.json()
    //   setData(data)
    // }

    // For demo purposes, generate mock data
    const mockData = [
      { name: "bd-anfa-bd-zerktouni", compliance: 88, violations: 12 },
      { name: "bd-zerktouni-bd-ghandi", compliance: 92, violations: 8 },
      { name: "bd-anfa-bd-massira", compliance: 85, violations: 15 },
      { name: "bd-zerktouni-bd-ibnsina", compliance: 90, violations: 10 },
    ]

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="compliance" name="Compliance Rate" fill="#82ca9d" />
        <Bar dataKey="violations" name="Violation Rate" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  )
}

