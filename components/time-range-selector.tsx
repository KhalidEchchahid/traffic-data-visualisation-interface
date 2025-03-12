"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface TimeRangeSelectorProps {
  onRangeChange: (range: { start: Date; end: Date }) => void
}

export function TimeRangeSelector({ onRangeChange }: TimeRangeSelectorProps) {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date(),
  })

  const handlePresetClick = (days: number) => {
    const end = new Date()
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
    setDateRange({ start, end })
    onRangeChange({ start, end })
  }

  return (
    <div className="flex items-center space-x-4">
      <Button onClick={() => handlePresetClick(1)} variant="outline">
        24h
      </Button>
      <Button onClick={() => handlePresetClick(7)} variant="outline">
        7d
      </Button>
      <Button onClick={() => handlePresetClick(30)} variant="outline">
        30d
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[280px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.start ? format(dateRange.start, "LLL dd, y") : <span>Pick a date</span>}
            {dateRange?.end && " - " + format(dateRange.end, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ start: range.from, end: range.to })
                onRangeChange({ start: range.from, end: range.to })
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

