"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface RiskFactorPatternsProps {
  timeRange: { start: Date; end: Date }
}

interface RiskPattern {
  pattern: string
  count: number
  riskScore: number
  description: string
}

export function RiskFactorPatterns({ timeRange }: RiskFactorPatternsProps) {
  const [patterns, setPatterns] = useState<RiskPattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === "undefined") return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Use your existing API endpoint
        const response = await fetch(
          `http://localhost:3001/api/risk/factors?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}`,
        )

        let data
        if (!response.ok) {
          data = [
            {
              pattern: "Rain + Rush Hour",
              count: 42,
              riskScore: 85,
              description: "Heavy rainfall during rush hour periods significantly increases risk",
            },
            {
              pattern: "Construction + High Traffic",
              count: 36,
              riskScore: 78,
              description: "Road construction during high traffic periods creates congestion hotspots",
            },
            {
              pattern: "Night + Poor Visibility",
              count: 29,
              riskScore: 72,
              description: "Nighttime driving with reduced visibility conditions",
            },
            {
              pattern: "Weekend + Alcohol",
              count: 24,
              riskScore: 68,
              description: "Weekend evenings with higher likelihood of impaired driving",
            },
            {
              pattern: "School Zone + Peak Hours",
              count: 18,
              riskScore: 65,
              description: "School zones during student arrival/departure times",
            },
          ]
        } else {
          data = await response.json()
        }

        setPatterns(data)
      } catch (error) {
        console.error("Failed to fetch risk patterns data:", error)
        setPatterns([
          {
            pattern: "Rain + Rush Hour",
            count: 42,
            riskScore: 85,
            description: "Heavy rainfall during rush hour periods significantly increases risk",
          },
          {
            pattern: "Construction + High Traffic",
            count: 36,
            riskScore: 78,
            description: "Road construction during high traffic periods creates congestion hotspots",
          },
          {
            pattern: "Night + Poor Visibility",
            count: 29,
            riskScore: 72,
            description: "Nighttime driving with reduced visibility conditions",
          },
          {
            pattern: "Weekend + Alcohol",
            count: 24,
            riskScore: 68,
            description: "Weekend evenings with higher likelihood of impaired driving",
          },
          {
            pattern: "School Zone + Peak Hours",
            count: 18,
            riskScore: 65,
            description: "School zones during student arrival/departure times",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Function to get color based on risk score
  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-red-500"
    if (score >= 70) return "bg-orange-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 50) return "bg-green-500"
    return "bg-blue-500"
  }

  if (loading) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2">
      {patterns.map((pattern, index) => (
        <Card key={index} className="overflow-hidden">
          <div className={`h-1 ${getRiskColor(pattern.riskScore)}`} />
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{pattern.pattern}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Score:</span>
                <span className={`px-2 py-0.5 rounded text-xs text-white ${getRiskColor(pattern.riskScore)}`}>
                  {pattern.riskScore}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
            <div className="text-sm">Occurrences: {pattern.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

