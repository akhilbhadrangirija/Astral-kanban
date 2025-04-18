import { AnimatePresence, motion } from 'framer-motion'

import { DayButton } from './DayButton'
import { getTransitionConfig } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'

export function WeekDaySelector() {
  const {
    calendarData,
    selectedDay,
    direction,
    currentDate,
    handleDayChange,
    handleWeekChange
  } = useCalendar()

  return (
    <AnimatePresence
      mode="wait"
      initial={true}>
      <motion.div
        drag={'x'}
        className="mt-6"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -80) {
            handleWeekChange('next')
          } else if (info.offset.x > 80) {
            handleWeekChange('previous')
          }
        }}
        key={currentDate.toISOString()}
        {...getTransitionConfig(direction)}>
        <div className="flex justify-between gap-2">
          {calendarData.weekDates.map((date, idx) => (
            <DayButton
              key={idx}
              date={date}
              idx={idx}
              isSelected={selectedDay === idx}
              onClick={() => handleDayChange(idx)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
