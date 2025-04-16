export type TaskColor = 'blue' | 'green' | 'purple' | 'red' | 'yellow'
export interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  time: string
}

export interface EventsByDate {
  [date: string]: Event[]
}

export interface Task {
  id: string
  time: string
  title: string
  description: string
  imageUrl?: string
  color?: string
  date: string
}
export interface TaskCardProps extends Task {
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
  isDragging?: boolean
}
export interface DroppableDayProps {
  date: string
  dayName: string
  tasks: Task[]
  selectedTask: string | null
  onSelectTask: (taskId: string | null) => void
}
