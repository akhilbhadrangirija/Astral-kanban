import { MAX_WIDTH_MOBILE } from '@/lib/utils'
import { WeekDaySelector } from './WeekDaySelector'
import { WeekSelector } from './WeekSelector'
import useMedia from 'use-media'

export function CalendarHeader() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 md:p-6 p-3">
      <h1 className="text-3xl font-bold text-white pb-3">Your Schedule</h1>
      {isMobile ? <WeekDaySelector /> : <WeekSelector />}
    </div>
  )
}
