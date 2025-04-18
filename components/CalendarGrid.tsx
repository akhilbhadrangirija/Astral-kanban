import { AnimatePresence, motion } from 'framer-motion'

import { DroppableDay } from './DroppableDay'
import { getTransitionConfig } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'

export function CalendarGrid() {
  const {
    calendarData,
    selectedTask,
    setSelectedTask,
    direction,
    currentDate
  } = useCalendar()
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <AnimatePresence
      mode="wait"
      initial={true}>
      <motion.div
        key={currentDate.toISOString()}
        {...getTransitionConfig(direction)}>
        <div className="grid grid-cols-7 gap-4">
          {calendarData.weekDates.map((date, idx) => (
            <DroppableDay
              key={date}
              date={date}
              dayName={shortDays[idx]}
              tasks={calendarData.weeklyTasks[idx] || []}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
