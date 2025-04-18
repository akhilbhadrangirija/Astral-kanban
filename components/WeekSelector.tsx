'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getMonthName } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'

export function WeekSelector() {
  const { currentDate, handleWeekChange, calendarData } = useCalendar()

  return (
    <div className="flex justify-between text-white items-center my-4">
      <h2 className="text-2xl font-bold">
        {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
      </h2>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleWeekChange('previous')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span
          suppressHydrationWarning
          className="text-sm font-medium">
          {new Date(calendarData.weekDates[0]).toLocaleDateString()} -
          {new Date(calendarData.weekDates[6]).toLocaleDateString()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleWeekChange('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
