"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface RiskData {
  id: string
  timestamp: string
  riskScore: number
  location: [number, number]
}

export function RiskHeatmap() {
  const [data, setData] = useState<RiskData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/risk/heatmap")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch risk heatmap data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((item) => (
        <CircleMarker
          key={item.id}
          center={item.location}
          radius={10}
          fillColor={`hsl(0, 100%, ${100 - item.riskScore}%)`}
          fillOpacity={0.7}
          stroke={false}
        >
          <Popup>
            Risk Score: {item.riskScore}<br />
            Time: {new Date(item.timestamp).toLocaleString()}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}