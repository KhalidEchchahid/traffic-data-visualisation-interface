"use client"

import { Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Intersection {
  id: string
  name: string
  status: string
  timeRemaining: number
}

interface TrafficLightGridProps {
  intersections: Intersection[]
}

export function TrafficLightGrid({ intersections }: TrafficLightGridProps) {
  // Helper function to get status color
  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "red":
        return "bg-red-500"
      case "yellow":
        return "bg-yellow-500"
      case "green":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Intersection</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="text-right w-[100px]">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {intersections.map((intersection) => (
          <TableRow key={intersection.id}>
            <TableCell className="font-medium">{intersection.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(intersection.status)}`} />
                <span className="capitalize">{intersection.status}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                <span>{intersection.timeRemaining}s</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

