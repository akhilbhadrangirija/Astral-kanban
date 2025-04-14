'use client'

import React, { createContext, useContext, useState } from 'react'

import { Task } from '@/lib/types'
import events from '@/lib/events'

interface CalendarContextType {
  currentDate: Date
  selectedDay: number
  direction: 'left' | 'right'
  selectedTask: string | null
  activeId: string | null
  shouldScroll: 'left' | 'right' | null
  tasks: Map<string, Task>

  // Actions
  handleDayChange: (newDay: number) => void
  handleWeekChange: (direction: 'previous' | 'next') => void
  setSelectedTask: (taskId: string | null) => void
  setActiveId: (id: string | null) => void
  setShouldScroll: (direction: 'left' | 'right' | null) => void
  updateTasks: (taskId: string, newDate: string) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date('2024-03-11'))
  const [selectedDay, setSelectedDay] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [shouldScroll, setShouldScroll] = useState<'left' | 'right' | null>(null)
  const [tasks, setTasks] = useState(() => {
    const taskMap = new Map<string, Task>()
    Object.entries(events).forEach(([date, dayEvents]) => {
      dayEvents.forEach(event => {
        taskMap.set(event.id, { ...event, date })
      })
    })
    return taskMap
  })

  const handleDayChange = (newDay: number) => {
    setDirection(newDay > selectedDay ? 'left' : 'right')
    setSelectedDay(newDay)
  }

  const handleWeekChange = (direction: 'previous' | 'next') => {
    setDirection(direction === 'previous' ? 'right' : 'left')
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'previous' ? -7 : 7))
    setCurrentDate(newDate)
  }

  const updateTasks = (taskId: string, newDate: string) => {
    setTasks(prev => {
      const newTasks = new Map(prev)
      const task = newTasks.get(taskId)
      if (task) {
        newTasks.set(taskId, { ...task, date: newDate })
      }
      return newTasks
    })
  }

  const value = {
    currentDate,
    selectedDay,
    direction,
    selectedTask,
    activeId,
    shouldScroll,
    tasks,
    handleDayChange,
    handleWeekChange,
    setSelectedTask,
    setActiveId,
    setShouldScroll,
    updateTasks
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}
