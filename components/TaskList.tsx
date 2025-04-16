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

  return (
    <motion.div
      ref={setNodeRef}
      className={`space-y-3 ${isOver ? 'bg-muted/10 rounded-lg p-2' : ''}`}>
      {tasks?.length > 0 ? (
        tasks.map(task => (
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
    </motion.div>
  )
}
