"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/old-components/date-range-picker";
import dynamic from "next/dynamic";

// Import components with no SSR
const RiskHeatmapWithNoSSR = dynamic(
    () => import("@/components/risk/risk-heatmap").then((mod) => mod.RiskHeatmap),
    {
      ssr: false,
      loading: () => <div className="h-[500px] flex items-center justify-center">Loading map...</div>,
    }
  );


// Other components...
const RiskTimelineWithNoSSR = dynamic(
  () =>
    import("@/components/risk/risk-timeline").then((mod) => mod.RiskTimeline),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center">
        Loading timeline...
      </div>
    ),
  }
);
const RiskFactorDistributionWithNoSSR = dynamic(
  () =>
    import("@/components/risk/risk-factor-distribution").then(
      (mod) => mod.RiskFactorDistribution
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] flex items-center justify-center">
        Loading chart...
      </div>
    ),
  }
);
const RiskFactorOverTimeWithNoSSR = dynamic(
  () =>
    import("@/components/risk/risk-factor-overtime").then(
      (mod) => mod.RiskFactorOverTime
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] flex items-center justify-center">
        Loading chart...
      </div>
    ),
  }
);
const RiskFactorPatternsWithNoSSR = dynamic(
  () =>
    import("@/components/risk/risk-factore-patterns").then(
      (mod) => mod.RiskFactorPatterns
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] flex items-center justify-center">
        Loading patterns...
      </div>
    ),
  }
);
const IncidentLogWithNoSSR = dynamic(
  () => import("@/components/risk/incident-log").then((mod) => mod.IncidentLog),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center">
        Loading incident log...
      </div>
    ),
  }
);

export function RiskPageClient() {
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date(),
  });
  const [activeTab, setActiveTab] = useState<
    "distribution" | "overtime" | "patterns"
  >("distribution");
  const [mapContainerReady, setMapContainerReady] = useState(false);

  // Ensure the map container is ready after component mount
  useEffect(() => {
    setMapContainerReady(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DateRangePicker
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Heatmap</CardTitle>
            <CardDescription>
              Geographic visualization of high-risk zones
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] relative">
            {mapContainerReady && (
              <RiskHeatmapWithNoSSR timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Timeline</CardTitle>
            <CardDescription>
              Chronological display of high-risk events
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <RiskTimelineWithNoSSR timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Breakdown</CardTitle>
            <CardDescription>
              Analysis of risk sources and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === "distribution" ? "default" : "outline"}
                  onClick={() => setActiveTab("distribution")}
                >
                  Distribution
                </Button>
                <Button
                  variant={activeTab === "overtime" ? "default" : "outline"}
                  onClick={() => setActiveTab("overtime")}
                >
                  Over Time
                </Button>
                <Button
                  variant={activeTab === "patterns" ? "default" : "outline"}
                  onClick={() => setActiveTab("patterns")}
                >
                  Top Patterns
                </Button>
              </div>

              <div className="h-[350px]">
                {activeTab === "distribution" && (
                  <RiskFactorDistributionWithNoSSR timeRange={timeRange} />
                )}
                {activeTab === "overtime" && (
                  <RiskFactorOverTimeWithNoSSR timeRange={timeRange} />
                )}
                {activeTab === "patterns" && (
                  <RiskFactorPatternsWithNoSSR timeRange={timeRange} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Incident Log</CardTitle>
            <CardDescription>Detailed record of all incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentLogWithNoSSR timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
