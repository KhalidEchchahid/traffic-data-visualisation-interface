"use client"

import { useEffect, useRef, useState } from "react"

interface TrafficMapProps {
  trafficData: any[]
  intersectionData: any[]
  selectedSensor?: string
  selectedIntersection?: string
}

export function TrafficMap({ trafficData, intersectionData, selectedSensor, selectedIntersection }: TrafficMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapWidth, setMapWidth] = useState(0)
  const [mapHeight, setMapHeight] = useState(400)

  // Update map dimensions on resize
  useEffect(() => {
    if (!mapRef.current) return

    const updateDimensions = () => {
      if (mapRef.current) {
        setMapWidth(mapRef.current.clientWidth)
      }
    }

    // Initial update
    updateDimensions()

    // Add resize listener
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !mapWidth) return

    // In a real implementation, this would initialize a map library like Leaflet or Mapbox
    // and update the map with real-time data

    // For this example, we'll create a simple canvas visualization
    const canvas = document.createElement("canvas")
    canvas.width = mapWidth
    canvas.height = mapHeight
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create a grid of intersections
    const intersections: { x: number; y: number; id: string; data: any }[] = []

    // Use actual intersection data if available, otherwise create a grid
    if (intersectionData.length > 0) {
      // Map each intersection to a position on the canvas
      const padding = 80
      const availableWidth = canvas.width - padding * 2
      const availableHeight = canvas.height - padding * 2

      // Create a grid based on the number of intersections
      const gridSize = Math.ceil(Math.sqrt(intersectionData.length))
      const cellWidth = availableWidth / gridSize
      const cellHeight = availableHeight / gridSize

      intersectionData.forEach((data, index) => {
        const row = Math.floor(index / gridSize)
        const col = index % gridSize

        intersections.push({
          x: padding + col * cellWidth + cellWidth / 2,
          y: padding + row * cellHeight + cellHeight / 2,
          id: data.intersection_id,
          data,
        })
      })
    } else {
      // Create a simple 2x2 grid of intersections
      const gridSize = 2
      const cellWidth = canvas.width / gridSize
      const cellHeight = canvas.height / gridSize

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          intersections.push({
            x: col * cellWidth + cellWidth / 2,
            y: row * cellHeight + cellHeight / 2,
            id: `intersection-${row}-${col}`,
            data: null,
          })
        }
      }
    }

    // Draw roads connecting intersections
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 20

    // Draw horizontal roads
    for (let row = 0; row < Math.sqrt(intersections.length); row++) {
      const y = intersections[row * Math.sqrt(intersections.length)].y
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw vertical roads
    for (let col = 0; col < Math.sqrt(intersections.length); col++) {
      const x = intersections[col].x
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw road markings
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.setLineDash([20, 20])

    // Draw horizontal road markings
    for (let row = 0; row < Math.sqrt(intersections.length); row++) {
      const y = intersections[row * Math.sqrt(intersections.length)].y
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw vertical road markings
    for (let col = 0; col < Math.sqrt(intersections.length); col++) {
      const x = intersections[col].x
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // Draw traffic congestion indicators for each intersection
    intersections.forEach((intersection) => {
      const intersectionData = intersection.data || { intersection_congestion_level: "low" }
      const congestionLevel = intersectionData.intersection_congestion_level || "low"
      const congestionColor = getCongestionColor(congestionLevel)

      // Highlight selected intersection
      if (selectedIntersection && intersection.id === selectedIntersection) {
        ctx.strokeStyle = "#3b82f6" // Blue highlight
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(intersection.x, intersection.y, 30, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw congestion around intersection
      ctx.fillStyle = congestionColor
      ctx.globalAlpha = 0.5

      // Horizontal congestion
      ctx.fillRect(intersection.x - 100, intersection.y - 10, 200, 20)

      // Vertical congestion
      ctx.fillRect(intersection.x - 10, intersection.y - 100, 20, 200)
      ctx.globalAlpha = 1.0

      // Draw intersection label
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(intersection.id, intersection.x, intersection.y + 40)
    })

    // Draw vehicles and pedestrians based on traffic data
    trafficData.forEach((data) => {
      const sensorId = data.sensor_id
      const isSelected = selectedSensor === sensorId

      // Find the closest intersection for this sensor
      const closestIntersection = intersections[0] // Default to first intersection

      // Draw vehicles
      const vehicleCount = data.density || 10
      const pedestrianCount = data.pedestrian_count || 5

      // Draw cars
      for (let i = 0; i < vehicleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 80 + 20
        const x = closestIntersection.x + Math.cos(angle) * distance
        const y = closestIntersection.y + Math.sin(angle) * distance
        const isOnRoad = Math.abs(y - closestIntersection.y) < 10 || Math.abs(x - closestIntersection.x) < 10

        if (isOnRoad) {
          ctx.fillStyle = isSelected ? "#3b82f6" : "#333"
          ctx.fillRect(x - 4, y - 2, 8, 4)
        }
      }

      // Draw pedestrians
      for (let i = 0; i < pedestrianCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 100 + 30
        const x = closestIntersection.x + Math.cos(angle) * distance
        const y = closestIntersection.y + Math.sin(angle) * distance
        const isOnSidewalk = !(Math.abs(y - closestIntersection.y) < 15) && !(Math.abs(x - closestIntersection.x) < 15)

        if (isOnSidewalk) {
          ctx.fillStyle = isSelected ? "#3b82f6" : "#00f"
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw sensor label
      ctx.fillStyle = isSelected ? "#3b82f6" : "#000"
      ctx.font = isSelected ? "bold 12px sans-serif" : "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Sensor: ${sensorId}`, closestIntersection.x, closestIntersection.y - 40)
    })

    // Draw incidents if detected
    trafficData.forEach((data) => {
      if (data.incident_detected) {
        // Find the closest intersection for this sensor
        const closestIntersection = intersections[0] // Default to first intersection

        ctx.fillStyle = "#f00"
        ctx.beginPath()
        ctx.arc(closestIntersection.x, closestIntersection.y, 15, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#fff"
        ctx.font = "16px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("!", closestIntersection.x, closestIntersection.y)
      }
    })

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

    ctx.fillStyle = "#f00"
    ctx.beginPath()
    ctx.arc(330, 16, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#000"
    ctx.fillText("Incident", 345, 20)
  }, [trafficData, intersectionData, mapWidth, selectedSensor, selectedIntersection])

  // Helper function to get color based on congestion level
  const getCongestionColor = (level: string): string => {
    switch (level?.toLowerCase()) {
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

