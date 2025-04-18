import { useEffect, useRef } from 'react'

import { MobileHeader } from './MobileHeader'
import { MobileTaskList } from './MobileTaskList'
import { useCalendar } from '@/contexts/CalendarContext'

export function MobileCalendar() {
  const {
    currentDate,
    selectedDay,
    calendarData,
    selectedTask,
    activeId,
    setSelectedTask,
    handleDayChange
  } = useCalendar()

  const lastDayChangeTime = useRef(Date.now())

  useEffect(() => {
    if (!activeId) return

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const scrollThreshold = 100
      const currentTime = Date.now()
      const timeSinceLastChange = currentTime - lastDayChangeTime.current

      if (timeSinceLastChange >= 300) {
        if (touch.clientX < scrollThreshold && selectedDay > 0) {
          handleDayChange(selectedDay - 1)
          lastDayChangeTime.current = currentTime
        } else if (
          window.innerWidth - touch.clientX < scrollThreshold &&
          selectedDay < 6
        ) {
          handleDayChange(selectedDay + 1)
          lastDayChangeTime.current = currentTime
        }
      }
    }

    window.addEventListener('touchmove', handleTouchMove)
    return () => window.removeEventListener('touchmove', handleTouchMove)
  }, [activeId])

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  return (
    <div className="p-6">
      {activeId && (
        <>
          <div
            ref={leftRef}
            className="fixed top-0 left-0 w-[100px] h-full bg-black/30 z-50"
          />
          <div
            ref={rightRef}
            className="fixed top-0 right-0 w-[100px] h-full bg-black/30 z-50"
          />
        </>
      )}
      <MobileHeader currentDate={currentDate} />
      <MobileTaskList
        tasks={calendarData.weeklyTasks[selectedDay] || []}
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
        date={calendarData.weekDates[selectedDay]}
        onDayChange={handleDayChange}
      />
    </div>
  )
}
