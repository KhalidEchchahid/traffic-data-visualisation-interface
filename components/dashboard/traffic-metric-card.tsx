import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrafficMetricCardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  description: string
  trend?: number
  trendDirection?: "up" | "down" | "none"
}

export function TrafficMetricCard({
  title,
  value = 0,
  unit,
  icon,
  description = "",
  trend = 0,
  trendDirection,
}: TrafficMetricCardProps) {
  // Determine trend direction if not explicitly provided
  const direction = trendDirection || (trend > 0 ? "up" : trend < 0 ? "down" : "none")

  // Format the trend value as a percentage
  const trendValue = Math.abs(trend).toFixed(1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== 0 && (
          <div className="mt-2 flex items-center text-xs">
            {direction === "up" ? (
              <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
            ) : direction === "down" ? (
              <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
            ) : (
              <Minus className="mr-1 h-3 w-3 text-muted-foreground" />
            )}
            <span
              className={cn(
                direction === "up" && "text-emerald-500",
                direction === "down" && "text-rose-500",
                direction === "none" && "text-muted-foreground",
              )}
            >
              {trendValue}% from average
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

