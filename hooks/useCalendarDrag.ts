import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

import { useCalendar } from '@/contexts/CalendarContext'

export function useCalendarDrag() {
  const { tasks, setActiveId, updateTasks } = useCalendar()

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.get(active.id.toString())
    const overDate = over.id.toString()

    if (activeTask && overDate !== activeTask.date) {
      updateTasks(active.id.toString(), overDate)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeTask = tasks.get(active.id.toString())
    const overDate = over.id.toString()

    if (activeTask && overDate !== activeTask.date) {
      updateTasks(active.id.toString(), overDate)
    }

    setActiveId(null)
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd
  }
}
