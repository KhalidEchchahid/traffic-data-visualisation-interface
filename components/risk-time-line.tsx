"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface RiskEvent {
  id: string
  timestamp: string
  riskScore: number
  severity: "minor" | "major" | "critical"
  factors: string[]
}

export function RiskTimeline() {
  const [data, setData] = useState<RiskEvent[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/risk/timeline")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch risk timeline data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleString()}
          formatter={(value, name) => [value, name === "riskScore" ? "Risk Score" : name]}
        />
        <Bar dataKey="riskScore" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}