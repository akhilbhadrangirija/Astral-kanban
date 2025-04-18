interface DayButtonProps {
  date: string
  idx: number
  isSelected: boolean
  onClick: () => void
}

import { motion } from 'framer-motion'

export function DayButton({ date, idx, isSelected, onClick }: DayButtonProps) {
  const dayDate = new Date(date)
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
        isSelected ? 'bg-indigo-700' : 'bg-blue-400/50'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
      <span className="text-sm text-white">{shortDays[idx]}</span>
      <motion.span
        className="text-xl font-bold text-white"
        animate={{
          scale: isSelected ? 1.05 : 1,
          transition: { type: 'spring', stiffness: 800 }
        }}>
        {dayDate.getDate()}
      </motion.span>
      {isSelected && (
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
  )
}
