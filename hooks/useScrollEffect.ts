import { MAX_WIDTH_MOBILE } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'
import { useEffect } from 'react'
import useMedia from 'use-media'

export function useScrollEffect() {
  const { shouldScroll, activeId, handleWeekChange } = useCalendar()
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  useEffect(() => {
    if (shouldScroll && activeId && !isMobile) {
      const timer = setInterval(() => {
        handleWeekChange(shouldScroll === 'left' ? 'previous' : 'next')
      }, 750)
      return () => clearInterval(timer)
    }
  }, [shouldScroll, activeId, isMobile, handleWeekChange])
}
