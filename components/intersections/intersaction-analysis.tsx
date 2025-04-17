"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntersectionStatusGrid } from "@/components/dashboard/intersection-status-grid"
import { IntersectionQueueChart } from "@/components/intersections/intersection-queue-chart"
import { IntersectionWaitTimeChart } from "@/components/intersections/intersection-wait-time-chart"
import { IntersectionDetailView } from "@/components/intersections/intersection-detail-view"
import { useEventSource } from "@/hooks/use-event-source"
import { IntersectionComplianceChart } from "./intersection-complaince-chart"

export function IntersectionAnalysis() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedIntersection, setSelectedIntersection] = useState<string | null>(null)
  const intersectionData = useEventSource("http://localhost:3001/api/intersection/stream")

  return (
    <div className="container space-y-4 py-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Intersection Analysis</h1>
        <p className="text-muted-foreground">Detailed analysis of traffic intersections</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queues">Queue Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="details">Intersection Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intersection Status</CardTitle>
              <CardDescription>Current status of all monitored intersections</CardDescription>
            </CardHeader>
            <CardContent>
              <IntersectionStatusGrid latestData={intersectionData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue Length Analysis</CardTitle>
              <CardDescription>Analysis of vehicle queues at intersections</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <IntersectionQueueChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wait Time Analysis</CardTitle>
              <CardDescription>Analysis of vehicle wait times at intersections</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <IntersectionWaitTimeChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Light Compliance</CardTitle>
              <CardDescription>Analysis of traffic light compliance rates</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <IntersectionComplianceChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intersection Details</CardTitle>
              <CardDescription>Detailed view of a specific intersection</CardDescription>
            </CardHeader>
            <CardContent>
              <IntersectionDetailView intersectionData={intersectionData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

