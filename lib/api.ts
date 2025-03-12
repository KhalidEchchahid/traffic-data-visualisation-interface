const API_BASE_URL = "http://localhost:3001/api"

export async function fetchTrafficData(timeframe = "24h", riskLevel?: number) {
  const params = new URLSearchParams({ timeframe })
  if (riskLevel) params.append("riskLevel", riskLevel.toString())

  const response = await fetch(`${API_BASE_URL}/traffic?${params}`)
  if (!response.ok) throw new Error("Failed to fetch traffic data")
  return response.json()
}

export async function fetchRiskAnalysis(threshold = 40) {
  const response = await fetch(`${API_BASE_URL}/risk-analysis?threshold=${threshold}`)
  if (!response.ok) throw new Error("Failed to fetch risk analysis")
  return response.json()
}

export function subscribeToTrafficStream(callback: (data: any) => void) {
  const eventSource = new EventSource(`${API_BASE_URL}/traffic/stream`)
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data)
  }
  return () => eventSource.close()
}

