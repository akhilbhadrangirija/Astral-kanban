'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MAX_WIDTH_MOBILE, getMonthName, getRandomColor } from '@/lib/utils'
import { Task, TaskCard } from './TaskCard'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import events from '@/lib/events'
import useMedia from 'use-media'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  const [currentDate, setCurrentDate] = useState(new Date('2024-03-11'))
  const [selectedDay, setSelectedDay] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const calendarData = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const weekDates = Array.from({length: 7}).map((_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date.toISOString().split('T')[0]
    })

    const weeklyTasks = weekDates.map(date => {
      if (events[date]) {
        return events[date].map(event => ({
          time: event.time,
          title: event.title,
          description: event.description,
          color: getRandomColor(event.id),
          imageUrl: event.imageUrl
        }))
      }
      return []
    })

    return {
      weekDates,
      weeklyTasks,
      monthYear: `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`
    }
  }, [currentDate])

  const getDayDetails = (dateStr: string) => {
    const date = new Date(dateStr)
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
    return {
      dayName: days[dayOfWeek],
      shortDayName: shortDays[dayOfWeek],
      day: date.getDate(),
      month: getMonthName(date.getMonth()),
      year: date.getFullYear()
    }
  }

  const currentDateDetails = getDayDetails(calendarData.weekDates[selectedDay])

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

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 pb-12">
        <h1 className="text-3xl font-bold text-white">Your Schedule</h1>

        {isMobile && (
          <motion.div
            className="mt-6"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -80 && selectedDay < 6) {
                handleDayChange(selectedDay + 1)
              } else if (info.offset.x > 80 && selectedDay > 0) {
                handleDayChange(selectedDay - 1)
              }
            }}
          >
            <div className="flex justify-between gap-2">
              {days.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDayChange(index)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                    selectedDay === index ? "bg-indigo-700" : "bg-blue-400/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm text-white">{shortDays[index]}</span>
                  <motion.span
                    className="text-xl font-bold text-white"
                    animate={{
                      scale: selectedDay === index ? 1.2 : 1,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    {new Date(calendarData.weekDates[index]).getDate()}
                  </motion.span>
                  {selectedDay === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                      layoutId="underline"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold">
              {isMobile
                ? `${currentDateDetails.dayName}, ${currentDateDetails.month} ${currentDateDetails.day}`
                : calendarData.monthYear
              }
            </h2>
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  {new Date(calendarData.weekDates[0]).toLocaleDateString()} - {new Date(calendarData.weekDates[6]).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {isMobile ? (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80 && selectedDay < 6) {
                    handleDayChange(selectedDay + 1)
                  } else if (info.offset.x > 80 && selectedDay > 0) {
                    handleDayChange(selectedDay - 1)
                  }
                }}
                initial={{ x: direction === 'left' ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === 'left' ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 cursor-grab active:cursor-grabbing"
              >
                {calendarData.weeklyTasks[selectedDay]?.length > 0 ? (
                  calendarData.weeklyTasks[selectedDay].map((task, idx) => (
                    <TaskCard
                      key={`${selectedDay}-${idx}`}
                      {...task}
                      isSelected={selectedTask === task.title}
                      onSelect={() => setSelectedTask(task.title)}
                      onClose={() => setSelectedTask(null)}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    No events scheduled
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {calendarData.weekDates.map((date, idx) => {
              const currentTasks = calendarData.weeklyTasks[idx]
              const dayDate = new Date(date)

              return (
                <div key={date} className="bg-muted/10 rounded-xl p-4">
                  <div className="text-sm font-medium mb-2">
                    {shortDays[idx]} {dayDate.getDate()}
                  </div>
                  <div className="space-y-2">
                    {currentTasks && currentTasks.length > 0 ? (
                      currentTasks.map((task, taskIdx) => (
                        <TaskCard
                          key={`${date}-${taskIdx}`}
                          {...task}
                          isSelected={selectedTask === task.title}
                          onSelect={() => setSelectedTask(task.title)}
                          onClose={() => setSelectedTask(null)}
                        />
                      ))
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">
                        No events
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {isMobile && (
          <div className="text-center text-sm text-muted-foreground mt-4 animate-pulse">
            ← Swipe to navigate days →
          </div>
        )}
      </div>
    </>
  )
}
