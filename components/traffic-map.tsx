"use client"

import { useEffect, useRef } from "react"

interface TrafficMapProps {
  trafficData: any
}

export function TrafficMap({ trafficData }: TrafficMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // In a real implementation, this would initialize a map library like Leaflet or Mapbox
    // and update the map with real-time data

    // For this example, we'll create a simple canvas visualization
    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = 400
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw roads
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 20

    // Horizontal road
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Vertical road
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()

    // Draw road markings
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.setLineDash([20, 20])

    // Horizontal road markings
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Vertical road markings
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()

    ctx.setLineDash([])

    // Draw traffic congestion indicators
    const congestionColor = getCongestionColor(trafficData.trafficData.congestionLevel)

    // Horizontal congestion
    ctx.fillStyle = congestionColor
    ctx.globalAlpha = 0.5
    ctx.fillRect(0, canvas.height / 2 - 10, canvas.width, 20)

    // Vertical congestion
    ctx.fillRect(canvas.width / 2 - 10, 0, 20, canvas.height)
    ctx.globalAlpha = 1.0

    // Draw vehicles
    const vehicleCount = trafficData.trafficData.vehicleNumber
    const pedestrianCount = trafficData.trafficData.pedestrianCount

    // Draw cars
    for (let i = 0; i < vehicleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const isOnRoad = Math.abs(y - canvas.height / 2) < 10 || Math.abs(x - canvas.width / 2) < 10

      if (isOnRoad) {
        ctx.fillStyle = "#333"
        ctx.fillRect(x - 4, y - 2, 8, 4)
      }
    }

    // Draw pedestrians
    for (let i = 0; i < pedestrianCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const isOnSidewalk = !(Math.abs(y - canvas.height / 2) < 15) && !(Math.abs(x - canvas.width / 2) < 15)

      if (isOnSidewalk) {
        ctx.fillStyle = "#00f"
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw incident if detected
    if (trafficData.trafficData.incidentDetected) {
      ctx.fillStyle = "#f00"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 15, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#fff"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("!", canvas.width / 2, canvas.height / 2)
    }

    // Add legend
    ctx.fillStyle = "#000"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Traffic Congestion:", 10, 20)

    ctx.fillStyle = getCongestionColor("low")
    ctx.fillRect(130, 12, 20, 10)
    ctx.fillStyle = "#000"
    ctx.fillText("Low", 155, 20)

    ctx.fillStyle = getCongestionColor("medium")
    ctx.fillRect(190, 12, 20, 10)
    ctx.fillStyle = "#000"
    ctx.fillText("Medium", 215, 20)

    ctx.fillStyle = getCongestionColor("high")
    ctx.fillRect(270, 12, 20, 10)
    ctx.fillStyle = "#000"
    ctx.fillText("High", 295, 20)
  }, [trafficData])

  // Helper function to get color based on congestion level
  const getCongestionColor = (level: string): string => {
    switch (level) {
      case "low":
        return "rgb(34, 197, 94)" // Green
      case "medium":
        return "rgb(234, 179, 8)" // Yellow
      case "high":
        return "rgb(239, 68, 68)" // Red
      case "severe":
        return "rgb(153, 27, 27)" // Dark red
      default:
        return "rgb(34, 197, 94)" // Default to green
    }
  }

  return <div ref={mapRef} className="w-full h-[400px] bg-muted"></div>
}

