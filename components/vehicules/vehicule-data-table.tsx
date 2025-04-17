"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Download, Search } from "lucide-react"

export function VehicleDataTable() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleClass, setVehicleClass] = useState("all")

  // Fetch vehicle data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real implementation, this would call your API
        // const response = await fetch(`/api/vehicles?page=${page}&search=${searchTerm}&class=${vehicleClass}`)
        // const data = await response.json()

        // For demo purposes, generate mock data
        const mockData = generateMockVehicleData(10)

        setVehicles(mockData)
        setTotalPages(5) // Mock 5 pages
      } catch (error) {
        console.error("Error fetching vehicle data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, searchTerm, vehicleClass])

  // Helper function to generate mock data
  const generateMockVehicleData = (count: number) => {
    const vehicleClasses = ["passenger_car", "suv", "pickup_truck", "motorcycle", "bus", "semi_truck", "delivery_van"]

    return Array.from({ length: count }, (_, i) => ({
      id: `veh-${i + 1}-${Date.now()}`,
      counter: i + 1 + (page - 1) * 10,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      speed_kmh: 30 + Math.random() * 70,
      length_dm: 30 + Math.random() * 100,
      vehicle_class: vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)],
      occupancy_s: 0.1 + Math.random() * 0.5,
      time_gap_s: 1 + Math.random() * 10,
      status: Math.random() > 0.8 ? 0x20 : 0, // 20% chance of queue detected
      sensor_id: `sensor-00${Math.floor(Math.random() * 4) + 1}`,
    }))
  }

  // Helper function to format vehicle class
  const formatVehicleClass = (vehicleClass: string) => {
    return vehicleClass
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  // Handle export
  const handleExport = () => {
    // In a real implementation, this would call your API to export data
    alert("Export functionality would be implemented here")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <div className="flex gap-2">
          <Select value={vehicleClass} onValueChange={setVehicleClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vehicle Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="passenger_car">Passenger Car</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="pickup_truck">Pickup Truck</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="semi_truck">Semi Truck</SelectItem>
              <SelectItem value="delivery_van">Delivery Van</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Time Gap</TableHead>
              <TableHead>Sensor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">#{vehicle.counter}</TableCell>
                  <TableCell>{new Date(vehicle.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatVehicleClass(vehicle.vehicle_class)}</Badge>
                  </TableCell>
                  <TableCell>{vehicle.speed_kmh.toFixed(1)} km/h</TableCell>
                  <TableCell>{(vehicle.length_dm / 10).toFixed(1)} m</TableCell>
                  <TableCell>{vehicle.time_gap_s.toFixed(1)} s</TableCell>
                  <TableCell>{vehicle.sensor_id}</TableCell>
                  <TableCell>
                    {vehicle.status === 0 ? (
                      <Badge variant="outline">Normal</Badge>
                    ) : (
                      <Badge variant="destructive">Special</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage(i + 1)
                }}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

