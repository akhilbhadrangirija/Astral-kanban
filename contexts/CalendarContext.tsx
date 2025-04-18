'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

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
  activeTask: Task | null | undefined

  setActiveId: (id: string | null) => void
  setShouldScroll: (direction: 'left' | 'right' | null) => void
  updateTasks: (taskId: string, newDate: string) => void
  handleWeekChange: (direction: 'previous' | 'next') => void
  handleDayChange: (day: number) => void
  setSelectedTask: (taskId: string | null) => void
  addTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void

  // Computed values
  calendarData: {
    weekDates: string[]
    weeklyTasks: Task[][]
  }
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date('2024-03-11'))
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
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
        taskMap.set(event.id, { ...event, date })
      })
    })
    return taskMap
  })

  const handleWeekChange = useCallback((direction: 'previous' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'previous') {
        newDate.setDate(newDate.getDate() - 7)
        setDirection('right')
      } else {
        newDate.setDate(newDate.getDate() + 7)
        setDirection('left')
      }
      return newDate
    })
  }, [])

  const handleDayChange = useCallback(
    (day: number) => {
      setSelectedDay(day)
      setDirection(day < selectedDay ? 'right' : 'left')
    },
    [selectedDay]
  )

  const updateTasks = useCallback((taskId: string, newDate: string) => {
    setTasks(prev => {
      const newTasks = new Map(prev)
      const task = newTasks.get(taskId)
      if (task) {
        newTasks.set(taskId, { ...task, date: newDate })
      }
      return newTasks
    })
  }, [])

  const addTask = useCallback((task: Task) => {
    setTasks(prev => {
      const newTasks = new Map(prev)
      newTasks.set(task.id, task)
      return newTasks
    })
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = new Map(prev)
      newTasks.delete(taskId)
      return newTasks
    })
  }, [])

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const newTasks = new Map(prev)
      const task = newTasks.get(taskId)
      if (task) {
        newTasks.set(taskId, { ...task, ...updates })
      }
      return newTasks
    })
  }, [])

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
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    )

    return {
      weekDates,
      weeklyTasks
    }
  }, [currentDate, tasks])

  const activeTask = activeId ? tasks.get(activeId) : null

  const value = {
    currentDate,
    selectedDay,
    direction,
    selectedTask,
    activeId,
    shouldScroll,
    tasks,
    activeTask,
    calendarData,
    setActiveId,
    setShouldScroll,
    updateTasks,
    handleWeekChange,
    handleDayChange,
    setSelectedTask,
    addTask,
    deleteTask,
    updateTask
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
