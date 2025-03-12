"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Car, Gauge, Info, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrafficMap } from "@/components/traffic-map"
import { CongestionChart } from "@/components/congestion-chart"
import { VehicleDistribution } from "@/components/vehicle-distribution"
import { TrafficLightGrid } from "@/components/traffic-light-grid"
import { useToast } from "@/components/ui/use-toast"
import { DualMetricChart } from "@/components/dual-metric-chart"
import { QueueLengthChart } from "./queue-lenght-chart"
import { IntersectionPerformanceChart } from "./intersaction-performance-chart"

interface TrafficData {
  trafficData: {
    density: number
    speed: number
    incidentDetected: boolean
    congestionLevel: string
    pedestrianCount: number
    vehicleTypeDistribution: {
      cars: number
      buses: number
      motorcycles: number
      trucks: number
    }
    [key: string]: any
  }
  intersectionData: {
    trafficLightComplianceRate: number
    queueLengthByLane: {
      lane1: number
      lane2: number
      lane3: number
      [key: string]: number
    }
    trafficLightStatus: string
    [key: string]: any
  }
  riskScore?: number
  riskFactors?: string[]
  timestamp?: string
}

interface IntersectionPerformanceData {
  time: string
  queueLength: number
  waitTime: number
  crossingTime: number
}

export function DashboardContent() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null)
  const [congestionHistory, setCongestionHistory] = useState<{ time: string; value: number }[]>([])
  const [dualMetricData, setDualMetricData] = useState<{ time: string; metric1: number; metric2: number }[]>([])
  const { toast } = useToast()
  const [intersectionPerformance, setIntersectionPerformance] = useState<IntersectionPerformanceData[]>([])

  useEffect(() => {
    // Function to connect to the SSE endpoint
    const connectToStream = () => {
      const eventSource = new EventSource("http://localhost:3001/api/traffic/stream")

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setTrafficData(data)

          // Update last updated time
          const timeElement = document.getElementById("last-updated")
          if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString()
          }

          // Add to congestion history
          const congestionValue = getCongestionValue(data.trafficData.congestionLevel)
          const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

          setCongestionHistory((prev) => {
            const newHistory = [...prev, { time: now, value: congestionValue }]
            // Keep only the last 15 minutes (assuming 1 data point per minute, so 15 points)
            return newHistory.slice(-15)
          })

          // Add to dual metric data - using the averageSpeedByDirection from the data
          setDualMetricData((prev) => {
            const newData = [
              ...prev,
              {
                time: now,
                metric1:
                  data.intersectionData.averageSpeedByDirection["north-south"] || Math.floor(Math.random() * 50) + 20,
                metric2:
                  data.intersectionData.averageSpeedByDirection["east-west"] || Math.floor(Math.random() * 50) + 20,
              },
            ]
            // Keep only the last 20 data points
            return newData.slice(-20)
          })

          // Update intersection performance data
          setIntersectionPerformance((prev) => {
            const newData = [
              ...prev,
              {
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                queueLength: Math.max(...Object.values(data.intersectionData.queueLengthByLane)),
                waitTime: data.intersectionData.averageWaitTime,
                crossingTime: data.intersectionData.intersectionCrossingTime,
              },
            ]
            // Keep only the last 10 data points
            return newData.slice(-10)
          })

          // Show incident notification if detected
          if (data.trafficData.incidentDetected) {
            toast({
              title: "Incident Detected!",
              description: "A traffic incident has been detected in the monitored area.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error)
        }
      }

      eventSource.onerror = () => {
        console.error("SSE connection error")
        eventSource.close()
        // Try to reconnect after 5 seconds
        setTimeout(connectToStream, 5000)
      }

      return eventSource
    }

    const eventSource = connectToStream()

    // Cleanup function
    return () => {
      eventSource.close()
    }
  }, [toast])

  // Helper function to convert congestion level to numeric value
  const getCongestionValue = (level: string): number => {
    switch (level) {
      case "low":
        return 25
      case "medium":
        return 50
      case "high":
        return 75
      case "severe":
        return 100
      default:
        return 0
    }
  }

  // If no data yet, show loading state
  if (!trafficData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading traffic data...</h2>
          <p className="text-muted-foreground">Connecting to real-time data stream</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Traffic Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of traffic conditions and metrics</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Density</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.trafficData.density} vehicles/km</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.trafficData.congestionLevel.charAt(0).toUpperCase() +
                trafficData.trafficData.congestionLevel.slice(1)}{" "}
              congestion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.trafficData.speed} km/h</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.trafficData.speed > 40 ? "Above" : "Below"} average for this time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${(trafficData.riskScore || 0) > 50 ? "text-destructive" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.riskScore || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.riskFactors && trafficData.riskFactors.length > 0
                ? `Factors: ${trafficData.riskFactors.join(", ")}`
                : "No significant risk factors"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedestrian Activity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.trafficData.pedestrianCount}</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.intersectionData.pedestriansCrossing || 0} currently crossing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <Info
              className={`h-4 w-4 ${trafficData.trafficData.incidentDetected ? "text-destructive" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.trafficData.incidentDetected ? "Yes" : "None"}</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.trafficData.incidentDetected
                ? `Severity: ${trafficData.trafficData.accidentSeverity}`
                : "No incidents detected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signal Compliance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.intersectionData.trafficLightComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {trafficData.trafficData.redLightViolations} red light violations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map and Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Traffic Map - Spans 4 columns */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Live Traffic Map</CardTitle>
            <CardDescription>Real-time traffic flow and incident monitoring</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TrafficMap trafficData={trafficData} />
          </CardContent>
        </Card>

        {/* Congestion Timeline - Spans 3 columns */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Congestion Timeline</CardTitle>
            <CardDescription>Traffic congestion levels over the last 15 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <CongestionChart data={congestionHistory} />
          </CardContent>
        </Card>

        {/* Traffic Flow Comparison */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Traffic Flow Comparison</CardTitle>
            <CardDescription>Comparing North-South and East-West traffic flow over time</CardDescription>
          </CardHeader>
          <CardContent>
            <DualMetricChart data={dualMetricData} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts and Grids */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IntersectionPerformanceChart data={intersectionPerformance} />
        </div>

        {/* Vehicle Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Type Distribution</CardTitle>
            <CardDescription>Breakdown of vehicle types in traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleDistribution data={trafficData.trafficData.vehicleTypeDistribution} />
          </CardContent>
        </Card>

        {/* Queue Length Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Intersection Queue Length</CardTitle>
            <CardDescription>Current queue length by lane</CardDescription>
          </CardHeader>
          <CardContent>
            <QueueLengthChart data={trafficData.intersectionData.queueLengthByLane} />
          </CardContent>
        </Card>

        {/* Traffic Light Status */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Light Status</CardTitle>
            <CardDescription>Current status of monitored intersections</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficLightGrid status={trafficData.intersectionData.trafficLightStatus} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

