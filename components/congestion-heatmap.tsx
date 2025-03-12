"use client"

import { useEffect, useState } from "react"
import { ResponsiveHeatMap } from "@nivo/heatmap"

interface CongestionHeatmapProps {
  timeRange: { start: Date; end: Date }
}

interface HeatmapData {
  id: string
  data: { x: string; y: number }[]
}

export function CongestionHeatmap({ timeRange }: CongestionHeatmapProps) {
  const [data, setData] = useState<HeatmapData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/historical/congestion?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch congestion heatmap data:", error)
      }
    }

    fetchData()
  }, [timeRange])

  if (data.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=">-.2f"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: "",
          legendOffset: 46
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Day",
          legendPosition: "middle",
          legendOffset: 70
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Day",
          legendPosition: "middle",
          legendOffset: -72
        }}
        colors={{
          type: "sequential",
          scheme: "blues"
        }}
        emptyColor="#555555"
        legends={[
          {
            anchor: "bottom",
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: "row",
            tickPosition: "after",
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: ">-.2s",
            title: "Congestion Level →",
            titleAlign: "start",
            titleOffset: 4
          }
        ]}
      />
    </div>
  )
}