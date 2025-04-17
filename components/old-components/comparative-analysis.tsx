"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrafficDensitySpeedChart } from "./traffic-density-speed-chart"

interface ComparativeAnalysisProps {
  timeRange: { start: Date; end: Date }
}

export function ComparativeAnalysis({ timeRange }: ComparativeAnalysisProps) {
  const [comparisonRange, setComparisonRange] = useState<{ start: Date; end: Date }>({
    start: new Date(timeRange.start.getTime() - (timeRange.end.getTime() - timeRange.start.getTime())),
    end: new Date(timeRange.start.getTime() - 1),
  })

  const [averageData, setAverageData] = useState<any>(null)

  useEffect(() => {
    // Fetch average data
    const fetchAverageData = async () => {
      // Simulating API call
      const response = await fetch("http://localhost:3001/api/historical/average")
      const result = await response.json()
      setAverageData(result)
    }

    fetchAverageData()
  }, [])

  const handleComparisonChange = (value: string) => {
    const duration = timeRange.end.getTime() - timeRange.start.getTime()
    let newStart, newEnd

    switch (value) {
      case "previous":
        newStart = new Date(timeRange.start.getTime() - duration)
        newEnd = new Date(timeRange.start.getTime() - 1)
        break
      case "lastWeek":
        newStart = new Date(timeRange.start.getTime() - 7 * 24 * 60 * 60 * 1000)
        newEnd = new Date(timeRange.end.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "lastMonth":
        newStart = new Date(timeRange.start.getTime() - 30 * 24 * 60 * 60 * 1000)
        newEnd = new Date(timeRange.end.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }

    setComparisonRange({ start: newStart, end: newEnd })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select onValueChange={handleComparisonChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select comparison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="previous">Previous period</SelectItem>
            <SelectItem value="lastWeek">Same period last week</SelectItem>
            <SelectItem value="lastMonth">Same period last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Period</CardTitle>
            <CardDescription>
              {timeRange.start.toDateString()} - {timeRange.end.toDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficDensitySpeedChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparison Period</CardTitle>
            <CardDescription>
              {comparisonRange.start.toDateString()} - {comparisonRange.end.toDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficDensitySpeedChart timeRange={comparisonRange} />
          </CardContent>
        </Card>
      </div>

      {averageData && (
        <Card>
          <CardHeader>
            <CardTitle>Benchmark Comparison</CardTitle>
            <CardDescription>Current period vs. historical average</CardDescription>
          </CardHeader>
          <CardContent>{/* Add a component here to display the comparison with average values */}</CardContent>
        </Card>
      )}
    </div>
  )
}

