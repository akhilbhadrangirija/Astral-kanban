import { Task, TaskCard } from './TaskCard'

import { useDroppable } from '@dnd-kit/core'

interface DroppableDayProps {
  date: string
  dayName: string
  tasks: Task[]
  selectedTask: string | null
  onSelectTask: (taskId: string | null) => void
}

export function DroppableDay({
  date,
  dayName,
  tasks,
  selectedTask,
  onSelectTask
}: DroppableDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: date
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-muted/10 rounded-xl p-4 min-h-[200px]
            transition-all duration-200 ease-in-out
            ${isOver ? 'bg-muted/20 scale-[1.02] ring-2 ring-blue-400 ring-opacity-50' : ''}
          `}>
      <div className="text-sm font-medium mb-2">
        {dayName} {new Date(date).getDate()}
      </div>
      <div className="space-y-2">
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
          <div className="text-center text-sm text-muted-foreground py-4">
            No events
          </div>
        )}
      </div>
    </div>
  )
}
