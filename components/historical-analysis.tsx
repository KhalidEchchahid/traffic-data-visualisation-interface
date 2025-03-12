"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IncidentFrequencyChart } from "@/components/incident-frequency-chart"
import { CongestionHeatmap } from "@/components/congestion-heatmap"
import { AdvancedDataTable } from "@/components/advanced-data-table"
import { ComparativeAnalysis } from "@/components/comparative-analysis"
import { TimeRangeSelector } from "./time-range-selector"
import { TrafficDensitySpeedChart } from "./traffic-density-speed-chart"
import { WeatherDistributionChart } from "./weather-disribution-chart"

export function HistoricalAnalysis() {
  const [timeRange, setTimeRange] = useState({ start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date() })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Historical Analysis & Reporting</h1>

        <TimeRangeSelector onRangeChange={setTimeRange} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Density vs Speed</CardTitle>
              <CardDescription>Correlation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <TrafficDensitySpeedChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident Frequency</CardTitle>
              <CardDescription>By hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentFrequencyChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Congestion Patterns</CardTitle>
              <CardDescription>Heatmap by day and hour</CardDescription>
            </CardHeader>
            <CardContent>
              <CongestionHeatmap timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Condition Distribution</CardTitle>
              <CardDescription>Impact on traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherDistributionChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Data Table</CardTitle>
            <CardDescription>Detailed traffic data with filtering and export options</CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedDataTable timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparative Analysis</CardTitle>
            <CardDescription>Compare different time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <ComparativeAnalysis timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

