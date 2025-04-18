import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Task } from '@/lib/types'
import { TaskCard } from './TaskCard'
import { motion } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'

interface TaskListProps {
  date: string
  tasks: Task[]
  selectedTask: string | null
  onSelectTask: (taskId: string | null) => void
}

export function TaskList({
  date,
  tasks,
  selectedTask,
  onSelectTask
}: TaskListProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: date
  })

  const sortedTasks = tasks.sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a?.time}`).getTime()
    const timeB = new Date(`2000/01/01 ${b?.time}`).getTime()
    return timeA - timeB
  })

  const taskIds = sortedTasks.map(task => task.id)

  return (
    <motion.div
      ref={setNodeRef}
      className={`space-y-3 ${isOver ? 'bg-muted/10 opacity-70' : ''}`}>
      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}>
        {sortedTasks?.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              {...task}
              isSelected={selectedTask === task.id}
              onSelect={() => onSelectTask(task.id)}
              onClose={() => onSelectTask(null)}
            />
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No events scheduled
          </div>
        )}
      </SortableContext>
    </motion.div>
  )
}
