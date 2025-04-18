'use client'

import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalenderHeader'
import { DndContext } from '@dnd-kit/core'
import DragOverlayComp from './DragOverlayComp'
import { MAX_WIDTH_MOBILE } from '@/lib/utils'
import { MobileCalendar } from './MobileCalendar'
import { useCalendarDrag } from '@/hooks/useCalendarDrag'
import { useDragSensors } from '@/hooks/useDragSensors'
import useMedia from 'use-media'

export function CalendarContainer() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  const { handleDragStart, handleDragOver, handleDragEnd } = useCalendarDrag()
  const sensors = useDragSensors()
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <CalendarHeader />
      {isMobile ? <MobileCalendar /> : <CalendarGrid />}
      <DragOverlayComp />
    </DndContext>
  )
}
