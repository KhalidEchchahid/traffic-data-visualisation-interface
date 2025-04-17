"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Car, Clock } from "lucide-react"

interface VehicleStreamViewProps {
  latestVehicle?: any
}

export function VehicleStreamView({ latestVehicle }: VehicleStreamViewProps) {
  const [vehicles, setVehicles] = useState<any[]>([])

  // Add new vehicle when received
  useEffect(() => {
    if (latestVehicle) {
      // Add new vehicle to the beginning of the list
      setVehicles((prev) => [latestVehicle, ...prev].slice(0, 10))
    }
  }, [latestVehicle])

  // Helper function to get vehicle class badge color
  const getVehicleClassColor = (vehicleClass: string) => {
    switch (vehicleClass) {
      case "passenger_car":
        return "bg-blue-500"
      case "suv":
        return "bg-green-500"
      case "pickup_truck":
        return "bg-yellow-500"
      case "motorcycle":
        return "bg-purple-500"
      case "bus":
        return "bg-red-500"
      case "semi_truck":
        return "bg-orange-500"
      case "delivery_van":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  // Helper function to format vehicle class name
  const formatVehicleClass = (vehicleClass: string) => {
    return vehicleClass
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Helper function to check if vehicle has special status
  const hasSpecialStatus = (status: number) => {
    return (
      (status & 0x04) === 0x04 || // Hardware fault
      (status & 0x08) === 0x08 || // Low voltage
      (status & 0x10) === 0x10 || // Wrong way
      (status & 0x20) === 0x20 // Queue detected
    )
  }

  // Helper function to get status description
  const getStatusDescription = (status: number) => {
    const issues = []

    if ((status & 0x04) === 0x04) issues.push("Hardware fault")
    if ((status & 0x08) === 0x08) issues.push("Low voltage")
    if ((status & 0x10) === 0x10) issues.push("Wrong way driver")
    if ((status & 0x20) === 0x20) issues.push("Queue detected")

    return issues.join(", ")
  }

  return (
    <div className="space-y-4">
      {vehicles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Waiting for vehicle data...</div>
      ) : (
        vehicles.map((vehicle, index) => (
          <Card key={vehicle.id} className={index === 0 ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Vehicle #{vehicle.counter}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getVehicleClassColor(vehicle.vehicle_class)}>
                      {formatVehicleClass(vehicle.vehicle_class)}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(vehicle.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Speed</div>
                    <div className="font-medium">{vehicle.speed_kmh.toFixed(1)} km/h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Length</div>
                    <div className="font-medium">{vehicle.length_dm / 10} m</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Time Gap</div>
                    <div className="font-medium">{vehicle.time_gap_s.toFixed(1)} s</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Occupancy</div>
                    <div className="font-medium">{vehicle.occupancy_s.toFixed(2)} s</div>
                  </div>
                </div>

                {hasSpecialStatus(vehicle.status) && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Special Status Detected</AlertTitle>
                    <AlertDescription>{getStatusDescription(vehicle.status)}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

