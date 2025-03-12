"use client"

import { useEffect, useState } from "react"
import { ResponsivePie } from "@nivo/pie"
import { ResponsiveBar } from "@nivo/bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface RiskFactorProps {
  timeRange: { start: Date; end: Date }
}

interface RiskDistribution {
  id: string
  label: string
  value: number
  color: string
}

interface RiskOverTime {
  date: string
  Weather: number
  Congestion: number
  Infrastructure: number
  "Time of Day": number
  "Vehicle Density": number
}

interface RiskPattern {
  pattern: string
  count: number
  riskScore: number
  description: string
}

// Distribution component (Pie Chart)
function Distribution({ timeRange }: RiskFactorProps) {
  const [data, setData] = useState<RiskDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // This would be replaced with your actual API endpoint
        const response = await fetch(
          `http://localhost:3001/api/risk/factors/distribution?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        // For demo purposes, generate mock data if API is not available
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
      } catch (error) {
        console.error("Failed to fetch risk distribution data:", error)
        setData([
          { id: "Weather", label: "Weather", value: 35, color: "#3b82f6" },
          { id: "Congestion", label: "Congestion", value: 25, color: "#ef4444" },
          { id: "Infrastructure", label: "Infrastructure", value: 15, color: "#84cc16" },
          { id: "Time of Day", label: "Time of Day", value: 15, color: "#f97316" },
          { id: "Vehicle Density", label: "Vehicle Density", value: 10, color: "#8b5cf6" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ datum: "data.color" }}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  )
}

// Over Time component (Stacked Bar Chart)
function OverTime({ timeRange }: RiskFactorProps) {
  const [data, setData] = useState<RiskOverTime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // This would be replaced with your actual API endpoint
        const response = await fetch(
          `http://localhost:3001/api/risk/factors/overtime?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        // For demo purposes, generate mock data if API is not available
        let data
        if (!response.ok) {
          data = generateMockOverTimeData(timeRange.start, timeRange.end)
        } else {
          data = await response.json()
        }

        setData(data)
      } catch (error) {
        console.error("Failed to fetch risk over time data:", error)
        setData(generateMockOverTimeData(timeRange.start, timeRange.end))
      } finally {
        setLoading(false)
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

  if (loading) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <ResponsiveBar
      data={data}
      keys={["Weather", "Congestion", "Infrastructure", "Time of Day", "Vehicle Density"]}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Risk Score",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
        },
      ]}
    />
  )
}

// Patterns component (Top 5 recurring risk patterns)
function Patterns({ timeRange }: RiskFactorProps) {
  const [patterns, setPatterns] = useState<RiskPattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // This would be replaced with your actual API endpoint
        const response = await fetch(
          `/api/risk/factors/patterns?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        // For demo purposes, generate mock data if API is not available
        let data
        if (!response.ok) {
          data = [
            {
              pattern: "Rain + Rush Hour",
              count: 42,
              riskScore: 85,
              description: "Heavy rainfall during rush hour periods significantly increases risk",
            },
            {
              pattern: "Construction + High Traffic",
              count: 36,
              riskScore: 78,
              description: "Road construction during high traffic periods creates congestion hotspots",
            },
            {
              pattern: "Night + Poor Visibility",
              count: 29,
              riskScore: 72,
              description: "Nighttime driving with reduced visibility conditions",
            },
            {
              pattern: "Weekend + Alcohol",
              count: 24,
              riskScore: 68,
              description: "Weekend evenings with higher likelihood of impaired driving",
            },
            {
              pattern: "School Zone + Peak Hours",
              count: 18,
              riskScore: 65,
              description: "School zones during student arrival/departure times",
            },
          ]
        } else {
          data = await response.json()
        }

        setPatterns(data)
      } catch (error) {
        console.error("Failed to fetch risk patterns data:", error)
        setPatterns([
          {
            pattern: "Rain + Rush Hour",
            count: 42,
            riskScore: 85,
            description: "Heavy rainfall during rush hour periods significantly increases risk",
          },
          {
            pattern: "Construction + High Traffic",
            count: 36,
            riskScore: 78,
            description: "Road construction during high traffic periods creates congestion hotspots",
          },
          {
            pattern: "Night + Poor Visibility",
            count: 29,
            riskScore: 72,
            description: "Nighttime driving with reduced visibility conditions",
          },
          {
            pattern: "Weekend + Alcohol",
            count: 24,
            riskScore: 68,
            description: "Weekend evenings with higher likelihood of impaired driving",
          },
          {
            pattern: "School Zone + Peak Hours",
            count: 18,
            riskScore: 65,
            description: "School zones during student arrival/departure times",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  // Function to get color based on risk score
  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-red-500"
    if (score >= 70) return "bg-orange-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 50) return "bg-green-500"
    return "bg-blue-500"
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2">
      {patterns.map((pattern, index) => (
        <Card key={index} className="overflow-hidden">
          <div className={`h-1 ${getRiskColor(pattern.riskScore)}`} />
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{pattern.pattern}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Score:</span>
                <span className={`px-2 py-0.5 rounded text-xs text-white ${getRiskColor(pattern.riskScore)}`}>
                  {pattern.riskScore}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
            <div className="text-sm">Occurrences: {pattern.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Export all components as a namespace
export const RiskFactorBreakdown = {
  Distribution,
  OverTime,
  Patterns,
}

