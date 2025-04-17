import { AnimatePresence, motion } from 'framer-motion'
import { MAX_WIDTH_MOBILE, cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { TaskCardProps } from '@/lib/types'
import { useDraggable } from '@dnd-kit/core'
import useMedia from 'use-media'

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
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })

  return (
    <>
      <motion.div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        layoutId={`task-card-${id}`}
        className={`mb-3 overflow-hidden rounded-lg shadow-md bg-white cursor-grab
                  transition-opacity duration-1000
                  ${shouldDisableLayout ? 'opacity-0' : 'opacity-100'}
                  ${isDraggingActive ? 'shadow-lg' : ''}
                  `}
        onClick={onSelect}>
        <motion.div
          layoutId={`image-container-${id}`}
          className="relative">
          <motion.div
            layoutId={`image-${id}`}
            className="w-full h-48 relative">
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              fill
              sizes="auto"
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
          <motion.div
            layoutId={`badge-container-${id}`}
            className="absolute top-4 right-4">
            <motion.div layoutId={`badge-${id}`}>
              <Badge
                className={`${colorMap[color]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {time}
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="p-4">
          <motion.h3
            layoutId={`title-${id}`}
            className="font-bold text-gray-800">
            {title}
          </motion.h3>
          <motion.p
            layoutId={`description-${id}`}
            className="text-gray-500 line-clamp-1">
            {description}
          </motion.p>
        </motion.div>
      </motion.div>
      {isMobile ? (
        <AnimatePresence
          mode="wait"
          initial={false}>
          {isSelected && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                e.stopPropagation()
                if (info.offset.y > 30) {
                  onClose()
                }
              }}
              className="fixed inset-0 flex items-center justify-center z-50 h-full w-full"
              onClick={onClose}>
              <motion.div
                layoutId={`task-card-${id}`}
                className="bg-white p-4 sm:p-6 w-full max-w-lg my-auto overflow-y-auto rounded-lg md:h-fit h-full"
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
                    suppressHydrationWarning
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
                      sizes="auto"
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
      ) : (
        <AnimatePresence
          mode="wait"
          initial={false}>
          {isSelected && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                e.stopPropagation()
                if (info.offset.y > 30) {
                  onClose()
                }
              }}
              className={cn(
                'fixed inset-0 bg-black/30 flex items-center justify-center z-50 h-full w-full'
              )}
              onClick={onClose}>
              <motion.div
                layoutId={`task-card-${id}`}
                className="bg-white p-4 sm:p-6 w-full max-w-lg my-auto overflow-y-auto rounded-lg md:h-fit"
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
                    suppressHydrationWarning
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
                      sizes="auto"
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
      )}
    </>
  )
}
