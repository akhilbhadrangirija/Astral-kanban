import { AnimatePresence, motion } from 'framer-motion'
import { getMonthName, getTransitionConfig } from '@/lib/utils'

import { useCalendar } from '@/contexts/CalendarContext'

interface MobileHeaderProps {
  currentDate: Date
}

export function MobileHeader({ currentDate }: MobileHeaderProps) {
  const { direction } = useCalendar()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={getMonthName(currentDate.getMonth())}
        {...{
          ...getTransitionConfig(direction),
          transition: { duration: 0.4, ease: 'easeInOut' }
        }}
        className="flex items-center justify-between gap-5 border border-white mb-4">
        <h2 className="text-2xl font-bold">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h2>
        <div className="h-[2px] w-1/3 bg-gradient-to-r from-indigo-500 to-teal-500" />
      </motion.div>
    </AnimatePresence>
  )
}
