"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentAlertsProps {
  latestAlert?: any
}

export function RecentAlerts({ latestAlert }: RecentAlertsProps) {
  const [alerts, setAlerts] = useState<any[]>([])

  // Add new alert when received
  useEffect(() => {
    if (latestAlert && latestAlert.type) {
      // Add new alert to the beginning of the list
      setAlerts((prev) => [latestAlert, ...prev].slice(0, 5))
    }
  }, [latestAlert])

  // Helper function to get alert icon
  const getAlertIcon = (type: string) => {
    if (type.includes("wrong-way")) return <AlertCircle className="h-5 w-5 text-red-500" />
    if (type.includes("queue")) return <Info className="h-5 w-5 text-yellow-500" />
    return <AlertTriangle className="h-5 w-5 text-orange-500" />
  }

  // Helper function to get alert title
  const getAlertTitle = (type: string) => {
    if (type.includes("wrong-way")) return "Wrong Way Driver"
    if (type.includes("queue")) return "Traffic Queue Detected"
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Helper function to get alert description
  const getAlertDescription = (alert: any) => {
    const time = new Date(alert.timestamp).toLocaleTimeString()
    const sensorId = alert.sensor_id

    if (alert.type.includes("wrong-way")) {
      return `Wrong way driver detected at ${time} by sensor ${sensorId}`
    }

    if (alert.type.includes("queue")) {
      return `Traffic queue detected at ${time} by sensor ${sensorId}`
    }

    return `Alert detected at ${time} by sensor ${sensorId}`
  }

  // Helper function to get alert variant
  const getAlertVariant = (type: string) => {
    if (type.includes("wrong-way")) return "destructive"
    if (type.includes("queue")) return "default"
    return "default"
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No recent alerts</div>
      ) : (
        alerts.map((alert, index) => (
          <Alert
            key={index}
            variant={getAlertVariant(alert.type) as any}
            className={cn("transition-all", index === 0 && "animate-pulse")}
          >
            <div className="flex items-start">
              {getAlertIcon(alert.type)}
              <div className="ml-4 flex-1">
                <AlertTitle className="flex items-center justify-between">
                  {getAlertTitle(alert.type)}
                  <Badge variant="outline" className="ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </Badge>
                </AlertTitle>
                <AlertDescription>{getAlertDescription(alert)}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))
      )}
    </div>
  )
}

