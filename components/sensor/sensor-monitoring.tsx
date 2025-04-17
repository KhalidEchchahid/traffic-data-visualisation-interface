"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SensorStatusGrid } from "@/components/dashboard/sensor-status-grid"

import { useEventSource } from "@/hooks/use-event-source"
import { SensorHealthChart } from "./sensor-health-chart"
import { SensorMap } from "./sensor-map"
import { SensorDetailView } from "./sensor-detail-view"

export function SensorMonitoring() {
  const [activeTab, setActiveTab] = useState("overview")
  const sensorData = useEventSource("http://localhost:3001/api/sensor/stream")

  return (
    <div className="container space-y-4 py-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sensor Monitoring</h1>
        <p className="text-muted-foreground">Monitor and analyze sensor health and performance</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="map">Sensor Map</TabsTrigger>
          <TabsTrigger value="details">Sensor Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Status</CardTitle>
              <CardDescription>Current status of all sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorStatusGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Health Metrics</CardTitle>
              <CardDescription>Battery levels and temperature trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SensorHealthChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Map</CardTitle>
              <CardDescription>Geographic location of all sensors</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <SensorMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Details</CardTitle>
              <CardDescription>Detailed view of a specific sensor</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorDetailView sensorData={sensorData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

