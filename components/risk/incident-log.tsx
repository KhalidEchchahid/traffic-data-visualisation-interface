"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Filter, Search, SortAsc, SortDesc } from "lucide-react"

interface IncidentLogProps {
  timeRange: { start: Date; end: Date }
}

interface Incident {
  id: string
  timestamp: string
  location: string
  severity: "minor" | "major" | "critical"
  type: string
  riskScore: number
  weatherCondition: string
  description: string
}

export function IncidentLog({ timeRange }: IncidentLogProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Incident>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === "undefined") return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Use your existing API endpoint
        const response = await fetch(
          `http://localhost:3001/api/risk/incidents?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        let data
        if (!response.ok) {
          data = generateMockIncidents(timeRange.start, timeRange.end)
        } else {
          data = await response.json()
        }

        setIncidents(data)
      } catch (error) {
        console.error("Failed to fetch incident log data:", error)
        setIncidents(generateMockIncidents(timeRange.start, timeRange.end))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Function to generate mock data for demonstration
  const generateMockIncidents = (start: Date, end: Date): Incident[] => {
    const result: Incident[] = []
    const severities = ["minor", "major", "critical"] as const
    const types = ["Collision", "Near Miss", "Traffic Violation", "Pedestrian Incident", "Road Hazard"]
    const weatherConditions = ["Clear", "Rain", "Snow", "Fog", "Wind"]
    const locations = [
      "Main St & 1st Ave",
      "Broadway & 42nd St",
      "Park Ave & 34th St",
      "5th Ave & Central Park",
      "Market St & 7th St",
    ]

    const daysBetween = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < 50; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + Math.floor(Math.random() * daysBetween))
      date.setHours(Math.floor(Math.random() * 24))
      date.setMinutes(Math.floor(Math.random() * 60))

      const severity = severities[Math.floor(Math.random() * severities.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const weatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]

      // Risk score based on severity
      let riskScore
      if (severity === "critical") riskScore = Math.floor(Math.random() * 20) + 80
      else if (severity === "major") riskScore = Math.floor(Math.random() * 20) + 60
      else riskScore = Math.floor(Math.random() * 20) + 40

      result.push({
        id: `incident-${i}`,
        timestamp: date.toISOString(),
        location,
        severity,
        type,
        riskScore,
        weatherCondition,
        description: `${severity.charAt(0).toUpperCase() + severity.slice(1)} ${type.toLowerCase()} incident at ${location}`,
      })
    }

    return result
  }

  // Function to export data as CSV
  const exportToCSV = () => {
    const headers = ["ID", "Timestamp", "Location", "Severity", "Type", "Risk Score", "Weather", "Description"]

    const csvData = filteredIncidents.map((incident) => [
      incident.id,
      new Date(incident.timestamp).toLocaleString(),
      incident.location,
      incident.severity,
      incident.type,
      incident.riskScore.toString(),
      incident.weatherCondition,
      incident.description,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `incident-log-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to get badge color based on severity
  const getSeverityBadgeColor = (severity: string) => {
    if (severity === "critical") return "bg-red-500"
    if (severity === "major") return "bg-orange-500"
    if (severity === "minor") return "bg-yellow-500"
    return "bg-green-500"
  }

  // Sort and filter incidents
  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesSearch =
        incident.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter

      return matchesSearch && matchesSeverity
    })
    .sort((a, b) => {
      if (sortField === "timestamp") {
        return sortDirection === "asc"
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }

      if (sortField === "riskScore") {
        return sortDirection === "asc" ? a.riskScore - b.riskScore : b.riskScore - a.riskScore
      }

      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField])
    })

  // Toggle sort direction
  const toggleSort = (field: keyof Incident) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                {severityFilter === "all" ? "All Severities" : severityFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSeverityFilter("all")}>All Severities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("minor")}>Minor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("major")}>Major</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("critical")}>Critical</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="h-10" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("timestamp")}
                >
                  Timestamp
                  {sortField === "timestamp" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("location")}
                >
                  Location
                  {sortField === "location" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("severity")}
                >
                  Severity
                  {sortField === "severity" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("type")}
                >
                  Type
                  {sortField === "type" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("riskScore")}
                >
                  Risk Score
                  {sortField === "riskScore" &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="ml-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>Weather</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No incidents found.
                </TableCell>
              </TableRow>
            ) : (
              filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{new Date(incident.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <Badge className={`${getSeverityBadgeColor(incident.severity)} text-white`}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.riskScore}</TableCell>
                  <TableCell>{incident.weatherCondition}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[300px] truncate">{incident.description}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredIncidents.length} of {incidents.length} incidents
      </div>
    </div>
  )
}

