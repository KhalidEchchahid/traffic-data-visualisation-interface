import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useHistoricalData(dateRange: { from: Date; to: Date } | undefined) {
  const { data, error, isLoading } = useSWR(
    dateRange
      ? `http://localhost:3001/api/historical?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      : null,
    fetcher,
  )

  return {
    data,
    isLoading,
    error,
  }
}

