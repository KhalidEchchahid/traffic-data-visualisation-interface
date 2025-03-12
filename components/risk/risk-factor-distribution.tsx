"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface RiskFactorDistributionProps {
  timeRange: { start: Date; end: Date }
}

interface RiskDistribution {
  id: string
  label: string
  value: number
  color: string
}

export function RiskFactorDistribution({ timeRange }: RiskFactorDistributionProps) {
  const [data, setData] = useState<RiskDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [chartInitialized, setChartInitialized] = useState(false)

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === "undefined") return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Use your existing API endpoint
        const response = await fetch(
          `http://localhost:3001/api/risk/factors/distribution?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        let data
        if (!response.ok) {
          data = [
            { id: "Weather", label: "Weather", value: 35, color: "#3b82f6" },
            { id: "Congestion", label: "Congestion", value: 25, color: "#ef4444" },
            { id: "Infrastructure", label: "Infrastructure", value: 15, color: "#84cc16" },
            { id: "Time of Day", label: "Time of Day", value: 15, color: "#f97316" },
            { id: "Vehicle Density", label: "Vehicle Density", value: 10, color: "#8b5cf6" },
          ]
        } else {
          data = await response.json()
        }

        setData(data)

        // Initialize pie chart
        initializePieChart(data)
      } catch (error) {
        console.error("Failed to fetch risk distribution data:", error)
        const mockData = [
          { id: "Weather", label: "Weather", value: 35, color: "#3b82f6" },
          { id: "Congestion", label: "Congestion", value: 25, color: "#ef4444" },
          { id: "Infrastructure", label: "Infrastructure", value: 15, color: "#84cc16" },
          { id: "Time of Day", label: "Time of Day", value: 15, color: "#f97316" },
          { id: "Vehicle Density", label: "Vehicle Density", value: 10, color: "#8b5cf6" },
        ]
        setData(mockData)

        // Initialize pie chart with mock data
        initializePieChart(mockData)
      } finally {
        setLoading(false)
      }
    }

    const initializePieChart = async (data: RiskDistribution[]) => {
      try {
        // Dynamically import d3 only on client
        const d3 = (await import("d3")).default

        // Clear previous chart
        d3.select("#risk-distribution").html("")

        // Set up dimensions
        const width = document.getElementById("risk-distribution")?.clientWidth || 400
        const height = 300
        const radius = Math.min(width, height) / 2

        // Create SVG
        const svg = d3
          .select("#risk-distribution")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto;")

        // Create pie generator
        const pie = d3
          .pie<RiskDistribution>()
          .sort(null)
          .value((d) => d.value)

        const arcs = pie(data)

        // Create arc generator
        const arc = d3
          .arc<d3.PieArcDatum<RiskDistribution>>()
          .innerRadius(radius * 0.5)
          .outerRadius(radius - 10)

        // Create outer arc for labels
        const outerArc = d3
          .arc<d3.PieArcDatum<RiskDistribution>>()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Draw arcs
        svg
          .selectAll("path")
          .data(arcs)
          .join("path")
          .attr("fill", (d) => d.data.color)
          .attr("d", arc)
          .append("title")
          .text((d) => `${d.data.label}: ${d.data.value}%`)

        // Add labels
        const text = svg
          .selectAll("text")
          .data(arcs)
          .join("text")
          .attr("transform", (d) => {
            const pos = outerArc.centroid(d)
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1)
            return `translate(${pos})`
          })
          .attr("dy", ".35em")
          .style("text-anchor", (d) => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return midAngle < Math.PI ? "start" : "end"
          })

        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", "-0.7em")
          .style("font-weight", "bold")
          .text((d) => d.data.label)

        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .text((d) => `${d.data.value}%`)

        // Add lines connecting labels to arcs
        svg
          .selectAll("polyline")
          .data(arcs)
          .join("polyline")
          .attr("stroke", "currentColor")
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("points", (d) => {
            const pos = outerArc.centroid(d)
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1)
            return [arc.centroid(d), outerArc.centroid(d), pos]
          })

        setChartInitialized(true)
      } catch (error) {
        console.error("Failed to initialize pie chart:", error)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading && !chartInitialized) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return <div id="risk-distribution" className="w-full h-full"></div>
}

