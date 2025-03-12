"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface RiskTimelineProps {
  timeRange: { start: Date; end: Date }
}

interface RiskEvent {
  date: string
  value: number
  severity: "minor" | "major" | "critical"
  factor: string
  details: string
}

export function RiskTimeline({ timeRange }: RiskTimelineProps) {
  const [events, setEvents] = useState<RiskEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null)
  const [calendarInitialized, setCalendarInitialized] = useState(false)

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === "undefined") return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `http://localhost:3001/api/risk/timeline?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        let data
        if (!response.ok) {
          data = generateMockRiskEvents(timeRange.start, timeRange.end)
        } else {
          data = await response.json()
        }

        setEvents(data)

        // Initialize calendar visualization
        initializeCalendar(data)
      } catch (error) {
        console.error("Failed to fetch risk timeline data:", error)
        const mockData = generateMockRiskEvents(timeRange.start, timeRange.end)
        setEvents(mockData)

        // Initialize calendar with mock data
        initializeCalendar(mockData)
      } finally {
        setLoading(false)
      }
    }

    const initializeCalendar = async (data: RiskEvent[]) => {
      try {
        // Dynamically import d3 only on client
        const d3 = (await import("d3")).default

        // Clear previous calendar
        d3.select("#risk-calendar").html("")

        // Set up dimensions
        const width = document.getElementById("risk-calendar")?.clientWidth || 600
        const height = 200
        const cellSize = 20
        const cellPadding = 2

        // Create SVG
        const svg = d3
          .select("#risk-calendar")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)

        // Group data by date
        const dateMap = new Map()
        data.forEach((event) => {
          if (!dateMap.has(event.date)) {
            dateMap.set(event.date, event)
          } else if (dateMap.get(event.date).value < event.value) {
            // Keep the highest severity event for each date
            dateMap.set(event.date, event)
          }
        })

        // Convert to array
        const dateEvents = Array.from(dateMap.values())

        // Create time scale
        const timeExtent = d3.extent(dateEvents, (d) => new Date(d.date)) as [Date, Date]
        const timeScale = d3
          .scaleTime()
          .domain(timeExtent)
          .range([50, width - 50])

        // Create color scale
        const colorScale = d3
          .scaleOrdinal<string>()
          .domain(["minor", "major", "critical"])
          .range(["#facc15", "#f97316", "#ef4444"])

        // Draw axis
        const xAxis = d3.axisBottom(timeScale).ticks(7).tickFormat(d3.timeFormat("%b %d"))

        svg
          .append("g")
          .attr("transform", `translate(0, ${height - 30})`)
          .call(xAxis)

        // Draw events
        const eventGroups = svg
          .selectAll(".event")
          .data(dateEvents)
          .enter()
          .append("g")
          .attr("class", "event")
          .attr("transform", (d) => `translate(${timeScale(new Date(d.date))}, 80)`)
          .style("cursor", "pointer")
          .on("click", (event, d) => {
            setSelectedEvent(d)
          })

        eventGroups
          .append("circle")
          .attr("r", (d) => 5 + d.value * 2)
          .attr("fill", (d) => colorScale(d.severity))
          .attr("opacity", 0.7)

        // Add legend
        const legend = svg.append("g").attr("transform", "translate(50, 20)")

        const legendItems = ["minor", "major", "critical"]

        legendItems.forEach((item, i) => {
          const g = legend.append("g").attr("transform", `translate(${i * 100}, 0)`)

          g.append("circle").attr("r", 5).attr("fill", colorScale(item))

          g.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .text(item.charAt(0).toUpperCase() + item.slice(1))
        })

        setCalendarInitialized(true)
      } catch (error) {
        console.error("Failed to initialize calendar:", error)
      }
    }

    fetchData()
  }, [timeRange])

  // Filter events based on selected factor
  const filteredEvents = filter === "all" ? events : events.filter((event) => event.factor === filter)

  // Get unique factors for filter dropdown
  const factors = Array.from(new Set(events.map((event) => event.factor)))

  // Function to generate mock data for demonstration
  const generateMockRiskEvents = (start: Date, end: Date): RiskEvent[] => {
    const factors = ["Weather", "Congestion", "Infrastructure", "Time of Day", "Vehicle Density"]
    const severities = ["minor", "major", "critical"] as const
    const result: RiskEvent[] = []

    const daysBetween = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < daysBetween; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)

      // Generate 0-3 events per day
      const eventsCount = Math.floor(Math.random() * 4)

      for (let j = 0; j < eventsCount; j++) {
        const factor = factors[Math.floor(Math.random() * factors.length)]
        const severity = severities[Math.floor(Math.random() * severities.length)]
        const value = severity === "minor" ? 1 : severity === "major" ? 2 : 3

        result.push({
          date: date.toISOString().split("T")[0],
          value,
          severity,
          factor,
          details: `${severity.charAt(0).toUpperCase() + severity.slice(1)} incident caused by ${factor.toLowerCase()}`,
        })
      }
    }

    return result
  }

  // Function to get badge color based on severity
  const getSeverityBadgeColor = (severity: string) => {
    if (severity === "critical") return "bg-red-500"
    if (severity === "major") return "bg-orange-500"
    if (severity === "minor") return "bg-yellow-500"
    return "bg-green-500"
  }

  if (loading && !calendarInitialized) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Risk Events Timeline</h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by factor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factors</SelectItem>
            {factors.map((factor) => (
              <SelectItem key={factor} value={factor}>
                {factor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div id="risk-calendar" className="flex-1 min-h-[250px]"></div>

      {selectedEvent && (
        <div className="mt-4 p-3 border rounded-md bg-muted/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">{selectedEvent.details}</div>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getSeverityBadgeColor(selectedEvent.severity)} text-white`}>
                {selectedEvent.severity}
              </Badge>
              <Badge variant="outline">{selectedEvent.factor}</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

