import { AnimatePresence, motion } from 'framer-motion'

import { Task } from '@/lib/types'
import { TaskList } from './TaskList'
import { getTransitionConfig } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'

interface MobileTaskListProps {
  tasks: Task[]
  selectedTask: string | null
  onSelectTask: (id: string | null) => void
  date: string
  onDayChange: (day: number) => void
}

export function MobileTaskList({
  tasks,
  selectedTask,
  onSelectTask,
  date,
  onDayChange
}: MobileTaskListProps) {
  const { direction, selectedDay, activeId } = useCalendar()

  return (
    <AnimatePresence
      mode="wait"
      initial={true}>
      <motion.div
        drag={activeId ? false : 'x'}
        className="min-h-[70vh]"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          e.stopPropagation()
          if (activeId) return
          if (info.offset.x < -80) {
            onDayChange(selectedDay + 1)
          } else if (info.offset.x > 80) {
            onDayChange(selectedDay - 1)
          }
        }}
        key={selectedDay.toString() + date}
        {...getTransitionConfig(direction)}>
        <TaskList
          tasks={tasks}
          selectedTask={selectedTask}
          onSelectTask={onSelectTask}
          date={date}
        />
      </motion.div>
    </AnimatePresence>
  )
}
