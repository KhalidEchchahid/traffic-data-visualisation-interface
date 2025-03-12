"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface RiskFactorOverTimeProps {
  timeRange: { start: Date; end: Date }
}

interface RiskOverTime {
  date: string
  Weather: number
  Congestion: number
  Infrastructure: number
  "Time of Day": number
  "Vehicle Density": number
}

export function RiskFactorOverTime({ timeRange }: RiskFactorOverTimeProps) {
  const [data, setData] = useState<RiskOverTime[]>([])
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
          `http://localhost:3001/api/risk/factors/overtime?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        let data
        if (!response.ok) {
          data = generateMockOverTimeData(timeRange.start, timeRange.end)
        } else {
          data = await response.json()
        }

        setData(data)

        // Initialize bar chart
        initializeBarChart(data)
      } catch (error) {
        console.error("Failed to fetch risk over time data:", error)
        const mockData = generateMockOverTimeData(timeRange.start, timeRange.end)
        setData(mockData)

        // Initialize bar chart with mock data
        initializeBarChart(mockData)
      } finally {
        setLoading(false)
      }
    }

    const initializeBarChart = async (data: RiskOverTime[]) => {
      try {
        // Dynamically import d3 only on client
        const d3 = (await import("d3")).default

        // Clear previous chart
        d3.select("#risk-overtime").html("")

        // Set up dimensions
        const width = document.getElementById("risk-overtime")?.clientWidth || 600
        const height = 300
        const margin = { top: 20, right: 30, bottom: 40, left: 40 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        // Create SVG
        const svg = d3
          .select("#risk-overtime")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

        // Extract dates and risk factors
        const dates = data.map((d) => d.date)
        const keys = Object.keys(data[0]).filter((key) => key !== "date")

        // Create scales
        const x = d3.scaleBand().domain(dates).range([0, innerWidth]).padding(0.1)

        const y = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, (d) => {
              return d3.sum(keys, (key) => d[key as keyof RiskOverTime] as number)
            }) || 100,
          ])
          .nice()
          .range([innerHeight, 0])

        const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)

        // Stack the data
        const stack = d3
          .stack<RiskOverTime>()
          .keys(keys as (keyof RiskOverTime)[])
          .order(d3.stackOrderNone)
          .offset(d3.stackOffsetNone)

        const series = stack(data)

        // Draw bars
        g.append("g")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("fill", (d) => color(d.key as string) as string)
          .selectAll("rect")
          .data((d) => d)
          .join("rect")
          .attr("x", (d) => x(d.data.date) || 0)
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          .append("title")
          .text((d) => `${d.data.date}\n${d3.format(".1f")(d[1] - d[0])}`)

        // Add axes
        g.append("g")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .call((g) => g.selectAll(".domain").remove())

        g.append("g")
          .call(d3.axisLeft(y))
          .call((g) => g.selectAll(".domain").remove())

        // Add legend
        const legend = svg
          .append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "start")
          .selectAll("g")
          .data(keys.slice().reverse())
          .join("g")
          .attr("transform", (d, i) => `translate(${width - margin.right - 100},${margin.top + i * 20})`)

        legend
          .append("rect")
          .attr("x", 0)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", (d) => color(d) as string)

        legend
          .append("text")
          .attr("x", 20)
          .attr("y", 7.5)
          .attr("dy", "0.35em")
          .text((d) => d)

        setChartInitialized(true)
      } catch (error) {
        console.error("Failed to initialize bar chart:", error)
      }
    }

    fetchData()
  }, [timeRange])

  // Function to generate mock data for demonstration
  const generateMockOverTimeData = (start: Date, end: Date): RiskOverTime[] => {
    const result: RiskOverTime[] = []

    const daysBetween = Math.min(7, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    for (let i = 0; i < daysBetween; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)

      result.push({
        date: date.toISOString().split("T")[0],
        Weather: Math.floor(Math.random() * 30) + 10,
        Congestion: Math.floor(Math.random() * 25) + 5,
        Infrastructure: Math.floor(Math.random() * 15) + 5,
        "Time of Day": Math.floor(Math.random() * 20) + 5,
        "Vehicle Density": Math.floor(Math.random() * 15) + 5,
      })
    }

    return result
  }

  if (loading && !chartInitialized) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return <div id="risk-overtime" className="w-full h-full"></div>
}

