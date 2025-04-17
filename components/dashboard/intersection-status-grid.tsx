"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface IntersectionStatusGridProps {
  latestData?: any
}

export function IntersectionStatusGrid({ latestData }: IntersectionStatusGridProps) {
  const [intersections, setIntersections] = useState<any[]>([])

  // Update intersections when new data is received
  useEffect(() => {
    if (latestData) {
      // Check if this intersection already exists in our state
      const existingIndex = intersections.findIndex((i) => i.intersection_id === latestData.intersection_id)

      if (existingIndex >= 0) {
        // Update existing intersection
        const updatedIntersections = [...intersections]
        updatedIntersections[existingIndex] = latestData
        setIntersections(updatedIntersections)
      } else {
        // Add new intersection
        setIntersections((prev) => [...prev, latestData])
      }
    }
  }, [latestData, intersections])

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Helper function to get congestion color
  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Intersection</TableHead>
          <TableHead>Traffic Light</TableHead>
          <TableHead>Congestion</TableHead>
          <TableHead>Queue Length</TableHead>
          <TableHead>Wait Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {intersections.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No intersection data available
            </TableCell>
          </TableRow>
        ) : (
          intersections.map((intersection) => (
            <TableRow key={intersection.intersection_id}>
              <TableCell className="font-medium">{intersection.intersection_id}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(intersection.traffic_light_status)}>
                  {intersection.traffic_light_status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getCongestionColor(intersection.intersection_congestion_level)}>
                  {intersection.intersection_congestion_level}
                </Badge>
              </TableCell>
              <TableCell>
                {intersection.queue_length_by_lane
                  ? Object.values(intersection.queue_length_by_lane as Record<string, number>).reduce((a, b) => a + b, 0)
                  : 0}{" "}
                vehicles
              </TableCell>
              <TableCell>{intersection.average_wait_time || 0} sec</TableCell>
              <TableCell>
                {intersection.risky_behavior_detected ? (
                  <Badge variant="destructive">Risky Behavior</Badge>
                ) : intersection.collision_count > 0 ? (
                  <Badge variant="destructive">Collision</Badge>
                ) : intersection.near_miss_incidents > 0 ? (
                  <Badge variant="outline">Near Miss</Badge>
                ) : (
                  <Badge variant="outline">Normal</Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

