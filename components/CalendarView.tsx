'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useMemo } from 'react'

import { CalendarHeader } from './CalenderHeader'
import { DroppableDay } from './DroppableDay'
import { MAX_WIDTH_MOBILE } from '@/lib/utils'
import { TaskCard } from './TaskCard'
import { TaskList } from './TaskList'
import { useCalendar } from '@/contexts/CalendarContext'
import useMedia from 'use-media'

const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  const {
    currentDate,
    selectedDay,
    direction,
    selectedTask,
    activeId,
    shouldScroll,
    tasks,
    setActiveId,
    setShouldScroll,
    updateTasks,
    handleWeekChange,
    handleDayChange,
    setSelectedTask
  } = useCalendar()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
        delay: 1500
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 1500,
        tolerance: 100
      }
    })
  )

  const calendarData = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date.toISOString().split('T')[0]
    })

    const weeklyTasks = weekDates.map(date =>
      Array.from(tasks?.values() || [])
        .filter(task => task?.date === date)
        .sort((a, b) => (a?.time || '').localeCompare(b?.time || ''))
    )

    return {
      weekDates,
      weeklyTasks
    }
  }, [currentDate, tasks])

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

  useEffect(() => {
    if (shouldScroll && activeId && !isMobile) {
      const timer = setInterval(() => {
        handleWeekChange(shouldScroll === 'left' ? 'previous' : 'next')
      }, 750)
      return () => clearInterval(timer)
    }
  }, [shouldScroll, activeId, isMobile])

  useEffect(() => {
    if (!activeId) return

    const handleMouseMove = (e: MouseEvent) => {
      const scrollThreshold = 100

      if (isMobile) {
        if (e.clientX < scrollThreshold && selectedDay > 0) {
          handleDayChange(selectedDay - 1)
        } else if (
          window.innerWidth - e.clientX < scrollThreshold &&
          selectedDay < 6
        ) {
          handleDayChange(selectedDay + 1)
        }
      } else {
        if (e.clientX < scrollThreshold) {
          setShouldScroll('left')
        } else if (window.innerWidth - e.clientX < scrollThreshold) {
          setShouldScroll('right')
        } else {
          setShouldScroll(null)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [activeId, isMobile, selectedDay])

  const transitionConfig = {
    initial: { opacity: 0, x: direction === 'left' ? '100%' : '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'left' ? '-100%' : '100%' },
    transition: { duration: 0.3, ease: 'easeInOut' }
  }

  const activeTask = activeId ? tasks.get(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      {activeId && (
        <>
          <div
            className="fixed top-0 left-0 w-[100px] h-full bg-black/30 z-50"
            onMouseEnter={() => !isMobile && setShouldScroll('left')}
            onMouseLeave={() => !isMobile && setShouldScroll(null)}
          />
          <div
            className="fixed top-0 right-0 w-[100px] h-full bg-black/30 z-50"
            onMouseEnter={() => !isMobile && setShouldScroll('right')}
            onMouseLeave={() => !isMobile && setShouldScroll(null)}
          />
        </>
      )}

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 pb-12">
        <h1 className="text-3xl font-bold text-white">Your Schedule</h1>

        {isMobile && (
          <motion.div className="mt-6">
            <div className="flex justify-between gap-2">
              {shortDays.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDayChange(index)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                    selectedDay === index ? 'bg-indigo-700' : 'bg-blue-400/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <span className="text-sm text-white">{day}</span>
                  <motion.span
                    className="text-xl font-bold text-white"
                    animate={{
                      scale: selectedDay === index ? 1.2 : 1,
                      transition: { type: 'spring', stiffness: 300 }
                    }}>
                    {new Date(calendarData.weekDates[index]).getDate()}
                  </motion.span>
                  {selectedDay === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                      layoutId="underline"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 relative overflow-hidden">
        {!isMobile && <CalendarHeader weekDates={calendarData.weekDates} />}

        <AnimatePresence
          mode="wait"
          initial={false}>
          <motion.div
            key={currentDate.toISOString()}
            {...transitionConfig}>
            {isMobile ? (
              <div>
                <TaskList
                  tasks={calendarData.weeklyTasks[selectedDay] || []}
                  selectedTask={selectedTask}
                  onSelectTask={setSelectedTask}
                  date={calendarData.weekDates[selectedDay]}
                />
              </div>
            ) : (
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
        }}>
        {activeId && activeTask ? (
          <div
            style={{
              width: '100%',
              maxWidth: '300px',
              pointerEvents: 'none',
              opacity: 1
            }}>
            <TaskCard
              {...activeTask}
              isSelected={false}
              onSelect={() => {}}
              onClose={() => {}}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
