"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CongestionChartProps {
  data: { time: string; value: number }[]
}

export function CongestionChart({ data }: CongestionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            if (value <= 25) return "Low"
            if (value <= 50) return "Medium"
            if (value <= 75) return "High"
            return "Severe"
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const value = payload[0].value as number
              let level = "Low"
              if (value > 25 && value <= 50) level = "Medium"
              if (value > 50 && value <= 75) level = "High"
              if (value > 75) level = "Severe"

              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.time}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Congestion</span>
                      <span className="font-bold text-muted-foreground">{level}</span>
                    </div>
                  </div>
                </div>
              )
            }

            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "var(--primary)", opacity: 0.8 },
          }}
          style={{
            stroke: "var(--primary)",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

