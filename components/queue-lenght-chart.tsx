"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface QueueLengthChartProps {
  data: {
    [key: string]: number
  }
}

export function QueueLengthChart({ data }: QueueLengthChartProps) {
  // Transform the data for the bar chart
  const chartData = Object.entries(data).map(([lane, value]) => ({
    lane: lane.replace("lane", "Lane "),
    value,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="lane" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Lane</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.lane}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Queue Length</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value} vehicles</span>
                    </div>
                  </div>
                </div>
              )
            }

            return null
          }}
        />
        <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

