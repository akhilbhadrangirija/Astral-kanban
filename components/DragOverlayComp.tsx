import { DragOverlay } from '@dnd-kit/core'
import React from 'react'
import { TaskCardOverlay } from './TaskCardOverlay'
import { useCalendar } from '@/contexts/CalendarContext'

function DragOverlayComp() {
  const { activeId, activeTask } = useCalendar()
  return (
    <DragOverlay
      dropAnimation={{
        duration: 300,
        easing: 'ease-in-out'
      }}>
      {activeId && activeTask ? (
        <div
          style={{
            width: '100%',
            pointerEvents: 'none',
            opacity: 1
          }}>
          <TaskCardOverlay
            key={activeTask.id}
            {...activeTask}
            isSelected={false}
            onSelect={() => {}}
            onClose={() => {}}
            isDragging={true}
          />
        </div>
      ) : null}
    </DragOverlay>
  )
}
export default DragOverlayComp
