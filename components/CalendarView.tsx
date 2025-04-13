'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
import { MAX_WIDTH_MOBILE, getMonthName } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DroppableDay } from './DroppableDay'
import { Task } from '@/lib/types'
import { TaskCard } from './TaskCard'
import { TaskList } from './TaskList'
import events from '@/lib/events'
import useMedia from 'use-media'

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  const [currentDate, setCurrentDate] = useState(new Date('2024-03-11'))
  const [selectedDay, setSelectedDay] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [shouldScroll, setShouldScroll] = useState<'left' | 'right' | null>(
    null
  )
  const [tasks, setTasks] = useState(() => {
    const taskMap = new Map<string, Task>()
    Object.entries(events).forEach(([date, dayEvents]) => {
      dayEvents.forEach(event => {
        taskMap.set(event.id, {
          ...event,
          date
        })
      })
    })
    return taskMap
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Add activation constraints
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
        delay: 100 // Small delay before drag starts
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8
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
      Array.from(tasks.values())
        .filter(task => task.date === date)
        .sort((a, b) => a.time.localeCompare(b.time))
    )

    return {
      weekDates,
      weeklyTasks,
      monthYear: `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`
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
      setTasks(prev => {
        const newTasks = new Map(prev)
        newTasks.set(active.id.toString(), {
          ...activeTask,
          date: overDate
        })
        return newTasks
      })
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
      setTasks(prev => {
        const newTasks = new Map(prev)
        newTasks.set(active.id.toString(), {
          ...activeTask,
          date: overDate
        })
        return newTasks
      })
    }

    setActiveId(null)
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
    setDirection('right')
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
    setDirection('left')
  }

  const handleDayChange = (newDay: number) => {
    setDirection(newDay > selectedDay ? 'left' : 'right')
    setSelectedDay(newDay)
  }

  const activeTask = activeId ? tasks.get(activeId.toString()) : null
  useEffect(() => {
      if (shouldScroll && activeId) {
        const timer = setInterval(() => {
          if (shouldScroll === 'left') {
            handlePrevious()
          } else {
            handleNext()
          }
        }, 750)
        return () => clearInterval(timer)
      }
    }, [shouldScroll, activeId])

  useEffect(() => {
      if (!activeId) return

      const handleMouseMove = (e: MouseEvent) => {
        const scrollThreshold = 100
        if (e.clientX < scrollThreshold) {
          setShouldScroll('left')
        } else if (window.innerWidth - e.clientX < scrollThreshold) {
          setShouldScroll('right')
        } else {
          setShouldScroll(null)
        }
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [activeId])
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
            onMouseEnter={() => setShouldScroll('left')}
            onMouseLeave={() => setShouldScroll(null)}
          />
          <div
            className="fixed top-0 right-0 w-[100px] h-full bg-black/30 z-50"
            onMouseEnter={() => setShouldScroll('right')}
            onMouseLeave={() => setShouldScroll(null)}
          />
        </>
      )}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 pb-12">
        <h1 className="text-3xl font-bold text-white">Your Schedule</h1>

        {isMobile && (
          <motion.div className="mt-6">
            <div className="flex justify-between gap-2">
              {days.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDayChange(index)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                    selectedDay === index ? 'bg-indigo-700' : 'bg-blue-400/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <span className="text-sm text-white">{shortDays[index]}</span>
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

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            className="flex justify-between items-center mb-4"
            initial={{ x: direction === 'left' ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 'left' ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-bold">{calendarData.monthYear}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {new Date(calendarData.weekDates[0]).toLocaleDateString()} -
                {new Date(calendarData.weekDates[6]).toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {isMobile ? (
          <TaskList
            tasks={calendarData.weeklyTasks[selectedDay]}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            date={calendarData.weekDates[selectedDay]}
          />
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {calendarData.weekDates.map((date, idx) => (
              <DroppableDay
                key={date}
                date={date}
                dayName={shortDays[idx]}
                tasks={calendarData.weeklyTasks[idx]}
                selectedTask={selectedTask}
                onSelectTask={setSelectedTask}
              />
            ))}
          </div>
        )}
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
