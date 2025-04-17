"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface IntersectionPerformanceData {
  time: string
  queueLength: number
  waitTime: number
  crossingTime: number
}

interface IntersectionPerformanceChartProps {
  data: IntersectionPerformanceData[]
}

export function IntersectionPerformanceChart({ data }: IntersectionPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intersection Performance Overview</CardTitle>
        <CardDescription>Queue length, wait time, and crossing time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                          <span className="font-bold text-muted-foreground">{label}</span>
                        </div>
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
                            <span className="font-bold" style={{ color: entry.color }}>
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar dataKey="queueLength" name="Queue Length" stackId="a" fill="#ff6b84" />
            <Bar dataKey="waitTime" name="Wait Time" stackId="a" fill="#36a2eb" />
            <Bar dataKey="crossingTime" name="Crossing Time" stackId="a" fill="#ffcd56" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

