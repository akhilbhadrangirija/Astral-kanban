import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { DroppableDayProps } from '@/lib/types'
import { TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/core'

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

  const sortedTasks = tasks.sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a?.time}`).getTime()
    const timeB = new Date(`2000/01/01 ${b?.time}`).getTime()
    return timeA - timeB
  })

  const taskIds = sortedTasks.map(task => task.id)

  return (
    <div
      ref={setNodeRef}
      className={`md:block hidden bg-muted/10 rounded-xl p-4 min-h-[200px]
            transition-all duration-200 ease-in-out
            ${isOver ? 'bg-muted/20 scale-[1.02] ring-2 ring-blue-400 ring-opacity-50 opacity-70' : ''}
          `}>
      <div className="text-sm font-medium mb-2">
        {dayName} {new Date(date).getDate()}
      </div>
      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
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
            <div className="text-center text-sm text-muted-foreground py-4">
              No events
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
