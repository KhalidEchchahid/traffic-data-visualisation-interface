"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  timeRange: { start: Date; end: Date }
  onTimeRangeChange: (range: { start: Date; end: Date }) => void
  className?: string
}

export function DateRangePicker({ timeRange, onTimeRangeChange, className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: timeRange.start,
    to: timeRange.end,
  })

  // Update the date when timeRange prop changes
  React.useEffect(() => {
    setDate({
      from: timeRange.start,
      to: timeRange.end,
    })
  }, [timeRange])

  // Handle preset selection
  const handlePresetChange = (preset: string) => {
    const now = new Date()
    let start: Date
    const end: Date = now

    switch (preset) {
      case "last-24h":
        start = addDays(now, -1)
        break
      case "last-7d":
        start = addDays(now, -7)
        break
      case "last-30d":
        start = addDays(now, -30)
        break
      case "last-90d":
        start = addDays(now, -90)
        break
      default:
        start = addDays(now, -7)
    }

    setDate({ from: start, to: end })
    onTimeRangeChange({ start, end })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <h3 className="font-medium">Select date range</h3>
            <div className="flex items-center gap-2">
              <Select onValueChange={handlePresetChange} defaultValue="last-7d">
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="last-24h">Last 24 hours</SelectItem>
                  <SelectItem value="last-7d">Last 7 days</SelectItem>
                  <SelectItem value="last-30d">Last 30 days</SelectItem>
                  <SelectItem value="last-90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              if (newDate?.from && newDate?.to) {
                onTimeRangeChange({
                  start: newDate.from,
                  end: newDate.to,
                })
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

