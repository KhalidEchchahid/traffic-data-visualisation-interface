"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useEventSource } from "@/hooks/use-event-source"
import { VehicleStreamView } from "./vehicule-stream-view"
import { VehicleClassDistribution } from "./vehicule-class-disribution"
import { VehicleSpeedDistribution } from "./vehicule-speed-distribution"
import { VehicleTimeGapChart } from "./vehicule-time-gap-chart"
import { VehicleDataTable } from "./vehicule-data-table"

export function VehicleAnalysis() {
  const [activeTab, setActiveTab] = useState("live")
  const vehicleData = useEventSource("http://localhost:3001/api/vehicle/stream")

  return (
    <div className="container space-y-4 py-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Analysis</h1>
        <p className="text-muted-foreground">Detailed analysis of individual vehicle data</p>
      </div>

      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live">Live Stream</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Vehicle Data</CardTitle>
              <CardDescription>Real-time vehicle detection stream</CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleStreamView latestVehicle={vehicleData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Class Distribution</CardTitle>
                <CardDescription>Distribution of vehicle types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <VehicleClassDistribution />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speed Distribution</CardTitle>
                <CardDescription>Distribution of vehicle speeds</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <VehicleSpeedDistribution />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Time Gap</CardTitle>
              <CardDescription>Time gap between vehicles</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <VehicleTimeGapChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Vehicle Data</CardTitle>
              <CardDescription>Search and analyze historical vehicle records</CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleDataTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

