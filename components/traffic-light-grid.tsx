"use client"

import { Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TrafficLightGridProps {
  status: string
}

export function TrafficLightGrid({ status }: TrafficLightGridProps) {
  // In a real implementation, this would be actual data from multiple intersections
  // For this example, we'll create some sample data
  const intersections = [
    { id: 1, name: "Main St & 1st Ave", status: status, timeRemaining: 15 },
    { id: 2, name: "Broadway & 5th St", status: getRandomStatus(), timeRemaining: 8 },
    { id: 3, name: "Park Ave & 3rd St", status: getRandomStatus(), timeRemaining: 22 },
    { id: 4, name: "Market St & 2nd Ave", status: getRandomStatus(), timeRemaining: 5 },
  ]

  // Helper function to get a random status
  function getRandomStatus() {
    const statuses = ["red", "yellow", "green"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  // Helper function to get status color
  function getStatusColor(status: string) {
    switch (status) {
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

