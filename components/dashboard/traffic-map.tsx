"use client"

import { useEffect, useRef, useState } from "react"

interface TrafficMapProps {
  trafficData: any
}

export function TrafficMap({ trafficData }: TrafficMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapSize, setMapSize] = useState({ width: 800, height: 400 })

  // Update map when traffic data changes
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw map background
    drawMap(ctx, canvas.width, canvas.height, trafficData || {})
  }, [trafficData, mapSize])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setMapSize({
          width: container.clientWidth,
          height: Math.max(400, container.clientWidth / 2),
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw map function
  const drawMap = (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    // Draw background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw main roads
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 30

    // Horizontal main road
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // Vertical main road
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()

    // Draw road markings
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.setLineDash([20, 20])

    // Horizontal road markings
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // Vertical road markings
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()

    ctx.setLineDash([])

    // Draw intersection
    ctx.fillStyle = "#ddd"
    ctx.fillRect(width / 2 - 15, height / 2 - 15, 30, 30)

    // Draw traffic density indicators
    if (data) {
      // Get congestion color
      const congestionColor = getCongestionColor(data.congestion_level)

      // Draw congestion indicators
      ctx.fillStyle = congestionColor
      ctx.globalAlpha = 0.5

      // Horizontal congestion
      ctx.fillRect(0, height / 2 - 15, width, 30)

      // Vertical congestion
      ctx.fillRect(width / 2 - 15, 0, 30, height)
      ctx.globalAlpha = 1.0

      // Draw vehicles
      const vehicleCount = data.vehicle_number || 20
      const pedestrianCount = data.pedestrian_count || 0

      // Draw cars
      ctx.fillStyle = "#333"
      for (let i = 0; i < vehicleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const isOnRoad = Math.abs(y - height / 2) < 15 || Math.abs(x - width / 2) < 15

        if (isOnRoad) {
          ctx.fillRect(x - 4, y - 2, 8, 4)
        }
      }

      // Draw pedestrians
      ctx.fillStyle = "#00f"
      for (let i = 0; i < pedestrianCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const isOnSidewalk = !(Math.abs(y - height / 2) < 20) && !(Math.abs(x - width / 2) < 20)

        if (isOnSidewalk) {
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw incident if detected
      if (data.incident_detected) {
        ctx.fillStyle = "#f00"
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, 15, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#fff"
        ctx.font = "16px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("!", width / 2, height / 2)
      }
    }
  }

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

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <canvas ref={canvasRef} width={mapSize.width} height={mapSize.height} className="w-full h-full" />
      {!trafficData && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Waiting for traffic data...</p>
        </div>
      )}
    </div>
  )
}

