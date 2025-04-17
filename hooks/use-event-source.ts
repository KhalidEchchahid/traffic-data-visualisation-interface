"use client"

import { useEffect, useState, useRef } from "react"

export function useEventSource(url: string) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [connected, setConnected] = useState(false)
  const mockDataRef = useRef<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)

  // Generate mock data based on the URL - called only once at the beginning
  useEffect(() => {
    // Generate different mock data based on the endpoint
    if (url.includes("traffic/stream")) {
      mockDataRef.current = generateMockTrafficData()
    } else if (url.includes("vehicle/stream")) {
      mockDataRef.current = generateMockVehicleData()
    } else if (url.includes("intersection/stream")) {
      mockDataRef.current = generateMockIntersectionData()
    } else if (url.includes("sensor/stream")) {
      mockDataRef.current = generateMockSensorData()
    } else if (url.includes("alert/stream")) {
      mockDataRef.current = generateMockAlertData()
    }
  }, [url])

  // Main effect for EventSource connection
  useEffect(() => {
    let mounted = true

    const connectToEventSource = () => {
      try {
        // Clear any existing retry timeout
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current)
          retryTimeoutRef.current = null
        }

        // Close any existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }

        console.log(`Connecting to EventSource: ${url}`)

        // Check if the URL is valid and accessible
        if (!url || !url.startsWith("http")) {
          // Use mock data if URL is invalid
          console.warn(`Invalid EventSource URL: ${url}, using mock data`)
          setError(new Error(`Invalid EventSource URL: ${url}`))
          if (mockDataRef.current && mounted) {
            console.log("Using mock data:", mockDataRef.current)
            setData(mockDataRef.current)
          }
          return
        }

        // Create new EventSource connection with withCredentials: false to avoid CORS preflight
        eventSourceRef.current = new EventSource(url, { withCredentials: false })

        eventSourceRef.current.onopen = () => {
          console.log(`EventSource connected to ${url}`)
          if (mounted) {
            setConnected(true)
            retryCountRef.current = 0 // Reset retry count on successful connection
          }
        }

        eventSourceRef.current.onmessage = (event) => {
          if (mounted) {
            try {
              console.log("Received SSE data:", event.data)
              const parsedData = JSON.parse(event.data)
              setData(parsedData)
            } catch (error) {
              console.error("Error parsing SSE data:", error)
            }
          }
        }

        eventSourceRef.current.onerror = (err) => {
          console.error("EventSource error:", err)

          // Close the current connection
          if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
          }

          if (mounted) {
            setConnected(false)
            setError(new Error("Failed to connect to event source"))

            // Implement exponential backoff for retries
            const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000) // Max 30 seconds
            console.log(`Retrying connection in ${retryDelay}ms (attempt ${retryCountRef.current + 1})`)

            // Use mock data while disconnected
            if (mockDataRef.current) {
              console.log("Using mock data while disconnected:", mockDataRef.current)
              setData(mockDataRef.current)
            }

            // Try to reconnect with exponential backoff
            retryTimeoutRef.current = setTimeout(() => {
              if (mounted) {
                retryCountRef.current++
                connectToEventSource()
              }
            }, retryDelay)
          }
        }
      } catch (error) {
        console.error("Error creating EventSource:", error)
        if (mounted) {
          setError(error instanceof Error ? error : new Error(String(error)))
          if (mockDataRef.current) {
            console.log("Using mock data after error:", mockDataRef.current)
            setData(mockDataRef.current)
          }
        }
      }
    }

    // Start the connection
    connectToEventSource()

    // Cleanup function
    return () => {
      mounted = false

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }

      if (eventSourceRef.current) {
        console.log(`Closing EventSource connection to ${url}`)
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [url])

  // If we're not connected and have mock data, use it
  useEffect(() => {
    if (!connected && mockDataRef.current) {
      // Update mock data periodically to simulate real-time updates
      const intervalId = setInterval(() => {
        if (url.includes("traffic/stream")) {
          mockDataRef.current = generateMockTrafficData()
        } else if (url.includes("vehicle/stream")) {
          mockDataRef.current = generateMockVehicleData()
        } else if (url.includes("intersection/stream")) {
          mockDataRef.current = generateMockIntersectionData()
        } else if (url.includes("sensor/stream")) {
          mockDataRef.current = generateMockSensorData()
        } else if (url.includes("alert/stream")) {
          mockDataRef.current = generateMockAlertData()
        }

        setData({ ...mockDataRef.current })
      }, 3000)

      return () => clearInterval(intervalId)
    }
  }, [connected, url])

  return data
}

// Mock data generator functions
function generateMockTrafficData() {
  return {
    sensor_id: "sensor-001",
    timestamp: new Date().toISOString(),
    location_id: "bd-zerktouni-n",
    location_x: 33.5912,
    location_y: -7.6361,
    density: Math.floor(Math.random() * 50) + 10,
    travel_time: Math.floor(Math.random() * 20) + 5,
    vehicle_number: Math.floor(Math.random() * 100) + 20,
    speed: Math.floor(Math.random() * 50) + 30,
    direction_change: ["left", "right", "none"][Math.floor(Math.random() * 3)],
    pedestrian_count: Math.floor(Math.random() * 30),
    bicycle_count: Math.floor(Math.random() * 15),
    heavy_vehicle_count: Math.floor(Math.random() * 10),
    incident_detected: Math.random() > 0.9,
    visibility: ["good", "fair", "poor"][Math.floor(Math.random() * 3)],
    weather_conditions: ["sunny", "rain", "snow", "fog"][Math.floor(Math.random() * 4)],
    road_condition: ["dry", "wet", "icy"][Math.floor(Math.random() * 3)],
    congestion_level: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    average_vehicle_size: ["small", "medium", "large"][Math.floor(Math.random() * 3)],
    vehicle_type_distribution: {
      cars: Math.floor(Math.random() * 70) + 20,
      buses: Math.floor(Math.random() * 10),
      motorcycles: Math.floor(Math.random() * 15),
      trucks: Math.floor(Math.random() * 10),
    },
    traffic_flow_direction: ["north-south", "east-west", "both"][Math.floor(Math.random() * 3)],
    red_light_violations: Math.floor(Math.random() * 5),
    temperature: 10 + Math.random() * 20,
    humidity: Math.floor(Math.random() * 100),
    wind_speed: Math.floor(Math.random() * 30),
    air_quality_index: Math.floor(Math.random() * 500),
    near_miss_events: Math.floor(Math.random() * 5),
    accident_severity: ["none", "minor", "major"][Math.floor(Math.random() * 3)],
    roadwork_detected: Math.random() > 0.8,
    illegal_parking_cases: Math.floor(Math.random() * 5),
  }
}

function generateMockVehicleData() {
  const vehicleClasses = ["passenger_car", "suv", "pickup_truck", "motorcycle", "bus", "semi_truck", "delivery_van"]

  return {
    id: `veh-${Date.now()}`,
    sensor_id: `sensor-00${Math.floor(Math.random() * 4) + 1}`,
    timestamp: new Date().toISOString(),
    speed_kmh: 30 + Math.random() * 70,
    length_dm: 30 + Math.random() * 100,
    vehicle_class: vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)],
    occupancy_s: 0.1 + Math.random() * 0.5,
    time_gap_s: 1 + Math.random() * 10,
    status: Math.random() > 0.8 ? 0x20 : 0, // 20% chance of queue detected
    counter: Math.floor(Math.random() * 1000),
  }
}

function generateMockIntersectionData() {
  return {
    sensor_id: `sensor-00${Math.floor(Math.random() * 4) + 1}`,
    timestamp: new Date().toISOString(),
    intersection_id: "bd-anfa-bd-zerktouni",
    stopped_vehicles_count: Math.floor(Math.random() * 50),
    average_wait_time: Math.floor(Math.random() * 60) + 10,
    left_turn_count: Math.floor(Math.random() * 20),
    right_turn_count: Math.floor(Math.random() * 20),
    average_speed_by_direction: {
      north_south: Math.floor(Math.random() * 40) + 20,
      east_west: Math.floor(Math.random() * 40) + 20,
    },
    lane_occupancy: Math.floor(Math.random() * 100),
    intersection_blocking_vehicles: Math.floor(Math.random() * 5),
    traffic_light_compliance_rate: Math.floor(Math.random() * 30) + 70,
    pedestrians_crossing: Math.floor(Math.random() * 20),
    jaywalking_pedestrians: Math.floor(Math.random() * 10),
    cyclists_crossing: Math.floor(Math.random() * 10),
    risky_behavior_detected: Math.random() > 0.8,
    queue_length_by_lane: {
      lane1: Math.floor(Math.random() * 15),
      lane2: Math.floor(Math.random() * 15),
      lane3: Math.floor(Math.random() * 15),
    },
    intersection_congestion_level: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    intersection_crossing_time: Math.floor(Math.random() * 30) + 10,
    traffic_light_impact: ["low", "moderate", "high"][Math.floor(Math.random() * 3)],
    near_miss_incidents: Math.floor(Math.random() * 5),
    collision_count: Math.random() > 0.9 ? 1 : 0,
    sudden_braking_events: Math.floor(Math.random() * 10),
    illegal_parking_detected: Math.random() > 0.8,
    wrong_way_vehicles: Math.random() > 0.9 ? 1 : 0,
    ambient_light_level: Math.floor(Math.random() * 200),
    traffic_light_status: ["red", "yellow", "green"][Math.floor(Math.random() * 3)],
    local_weather_conditions: ["clear", "rain", "snow", "fog"][Math.floor(Math.random() * 4)],
    fog_or_smoke_detected: Math.random() > 0.8,
  }
}

function generateMockSensorData() {
  return {
    sensor_id: `sensor-00${Math.floor(Math.random() * 4) + 1}`,
    timestamp: new Date().toISOString(),
    battery_level: Math.floor(Math.random() * 100),
    temperature_c: 20 + Math.random() * 20,
    hw_fault: Math.random() > 0.95,
    low_voltage: Math.random() > 0.9,
    uptime_s: Math.floor(Math.random() * 86400),
    message_count: Math.floor(Math.random() * 10000),
  }
}

function generateMockAlertData() {
  const alertTypes = ["wrong-way-driver", "traffic-queue", "red-light-violation", "speeding-violation", "near-miss"]

  return {
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    timestamp: new Date().toISOString(),
    sensor_id: `sensor-00${Math.floor(Math.random() * 4) + 1}`,
    vehicle_data: generateMockVehicleData(),
  }
}

