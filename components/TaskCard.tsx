import { AnimatePresence, motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { useDraggable } from '@dnd-kit/core'

export interface Task {
  id: string
  time: string
  title: string
  description: string
  imageUrl?: string
  color?: string
  date: string
}

interface TaskCardProps extends Task {
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
  isDragging?: boolean
}

export function TaskCard({
  id,
  time,
  title,
  imageUrl,
  description,
  color = 'blue',
  isSelected,
  onSelect,
  onClose,
  isDragging = false
}: TaskCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isDraggingActive
  } = useDraggable({
    id,
    disabled: isSelected // Prevent dragging when modal is open
  })

  const shouldDisableLayout = isDraggingActive || isDragging

  return (
    <>
      <motion.div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        layoutId={shouldDisableLayout ? undefined : `task-card-${id}`}
        className={`mb-3 overflow-hidden rounded-lg shadow-md bg-white cursor-grab
                  transition-opacity duration-200
                  ${shouldDisableLayout ? 'opacity-50' : 'opacity-100'}
                  ${isDraggingActive ? 'shadow-lg' : ''}
                  `}
        onClick={onSelect}>
        <motion.div
          layoutId={shouldDisableLayout ? undefined : `image-container-${id}`}
          className="relative">
          <motion.div
            layoutId={shouldDisableLayout ? undefined : `image-${id}`}
            className="w-full h-48 relative">
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
          <motion.div
            layoutId={shouldDisableLayout ? undefined : `badge-container-${id}`}
            className="absolute top-4 right-4">
            <motion.div
              layoutId={shouldDisableLayout ? undefined : `badge-${id}`}>
              <Badge
                className={`${colorMap[color]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {time}
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="p-4">
          <motion.h3
            layoutId={shouldDisableLayout ? undefined : `title-${id}`}
            className="font-bold text-gray-800">
            {title}
          </motion.h3>
          <motion.p
            layoutId={shouldDisableLayout ? undefined : `description-${id}`}
            className="text-gray-500 line-clamp-1">
            {description}
          </motion.p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}>
            <motion.div
              layoutId={`task-card-${id}`}
              className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg mx-4 my-auto max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <motion.div
                layoutId={`badge-container-${id}`}
                className="flex justify-between items-start mb-4">
                <motion.div layoutId={`badge-${id}`}>
                  <Badge
                    className={`${colorMap[color]} text-white px-2 py-1 rounded-md text-xs`}>
                    {time}
                  </Badge>
                </motion.div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </motion.div>
              <motion.h2
                layoutId={`title-${id}`}
                className="text-lg sm:text-xl font-bold mb-4">
                {title}
              </motion.h2>
              {imageUrl && (
                <motion.div
                  layoutId={`image-${id}`}
                  className="w-full h-40 sm:h-48 relative rounded-md overflow-hidden mb-4">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </motion.div>
              )}
              <motion.p
                layoutId={`description-${id}`}
                className="text-sm sm:text-base text-gray-600">
                {description}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
