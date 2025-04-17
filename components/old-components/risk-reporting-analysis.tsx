"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/old-components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiskHeatmap } from "@/components/old-components/risk-heatmap";
import { RiskTimeline } from "./risk-time-line";
import { RiskFactorBreakdown } from "./old-components/risk-factor-break-down";

export function RiskReportingAnalysis() {
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Risk Reporting & Analysis</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heatmap</CardTitle>
              <CardDescription>
                Geographic visualization of high-risk zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskHeatmap />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Timeline</CardTitle>
              <CardDescription>
                Chronological display of high-risk events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskTimeline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Breakdown</CardTitle>
              <CardDescription>
                Distribution of risk sources and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskFactorBreakdown />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident Log</CardTitle>
              <CardDescription>
                Detailed incident information with export functionality
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <IncidentLog /> */}</CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
