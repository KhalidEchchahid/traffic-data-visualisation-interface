"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"

export interface TrafficData {
  _id?: string
  densite: number
  speed: number
  vehicleNumber: number
  timestamp: string
  coordinates: [number, number]
  signalStatus?: "Green" | "Yellow" | "Red"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTrafficData() {
  const [realtimeData, setRealtimeData] = useState<TrafficData[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const {
    data: initialData,
    error,
    isLoading,
    mutate,
  } = useSWR<TrafficData[]>("http://localhost:3001/api/traffic", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const sse = new EventSource("http://localhost:3001/api/traffic/updates")
    setEventSource(sse)

    sse.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data)
        setRealtimeData((prev) => {
          const updatedData = [newData, ...prev].slice(0, 24)
          return updatedData
        })
        setLastUpdated(new Date().toISOString())
      } catch (e) {
        console.error("Error parsing SSE data:", e)
      }
    }

    sse.onerror = (error) => {
      console.error("SSE error:", error)
      sse.close()
    }

    return () => {
      sse.close()
    }
  }, [])

  const combinedData = realtimeData.length > 0 ? realtimeData : initialData || []

  // No need to modify the timestamp as it's already in ISO format
  return {
    data: combinedData,
    isLoading,
    error,
    lastUpdated,
    refresh: mutate,
  }
}

