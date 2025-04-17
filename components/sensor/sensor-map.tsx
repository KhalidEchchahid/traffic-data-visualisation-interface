"use client"

import { useEffect, useRef, useState } from "react"
import { useEventSource } from "@/hooks/use-event-source"

export function SensorMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const sensorData = useEventSource("http://localhost:3001/api/sensor/stream")

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInitialized) return

    const initMap = async () => {
      try {
        // In a real implementation, this would use a mapping library like Leaflet
        // For this demo, we'll create a simple canvas visualization
        const canvas = document.createElement("canvas")
        canvas.width = mapRef.current!.clientWidth
        canvas.height = mapRef.current!.clientHeight
        mapRef.current!.innerHTML = ""
        mapRef.current!.appendChild(canvas)

        // Draw a simple map
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Draw background
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid
        ctx.strokeStyle = "#e0e0e0"
        ctx.lineWidth = 1

        // Vertical grid lines
        for (let x = 0; x < canvas.width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        // Horizontal grid lines
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        // Draw roads
        ctx.strokeStyle = "#ccc"
        ctx.lineWidth = 20

        // Horizontal main road
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()

        // Vertical main road
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2, 0)
        ctx.lineTo(canvas.width / 2, canvas.height)
        ctx.stroke()

        // Draw sensor locations
        const sensors = [
          { id: "sensor-001", x: canvas.width / 2 - 100, y: canvas.height / 2 - 100, battery: 85, status: "healthy" },
          { id: "sensor-002", x: canvas.width / 2 + 100, y: canvas.height / 2 - 100, battery: 65, status: "healthy" },
          { id: "sensor-003", x: canvas.width / 2 - 100, y: canvas.height / 2 + 100, battery: 45, status: "warning" },
          { id: "sensor-004", x: canvas.width / 2 + 100, y: canvas.height / 2 + 100, battery: 15, status: "critical" },
        ]

        sensors.forEach((sensor) => {
          // Draw sensor circle
          ctx.beginPath()
          ctx.arc(sensor.x, sensor.y, 15, 0, Math.PI * 2)

          // Color based on status
          if (sensor.status === "critical") {
            ctx.fillStyle = "#ef4444" // Red
          } else if (sensor.status === "warning") {
            ctx.fillStyle = "#f97316" // Orange
          } else {
            ctx.fillStyle = "#22c55e" // Green
          }

          ctx.fill()

          // Draw sensor ID
          ctx.fillStyle = "#000"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(sensor.id, sensor.x, sensor.y + 30)

          // Draw battery level
          ctx.fillStyle = "#fff"
          ctx.font = "10px sans-serif"
          ctx.fillText(`${sensor.battery}%`, sensor.x, sensor.y + 5)
        })

        setMapInitialized(true)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initMap()
  }, [mapInitialized])

  // Update map when sensor data changes
  useEffect(() => {
    if (!mapRef.current || !sensorData || !mapInitialized) return

    // In a real implementation, this would update the map with the latest sensor data
    // For this demo, we'll just log the data
    console.log("Sensor data updated:", sensorData)
  }, [sensorData, mapInitialized])

  return (
    <div ref={mapRef} className="w-full h-full bg-muted rounded-md">
      {!mapInitialized && (
        <div className="flex items-center justify-center h-full">
          <p>Initializing map...</p>
        </div>
      )}
    </div>
  )
}

