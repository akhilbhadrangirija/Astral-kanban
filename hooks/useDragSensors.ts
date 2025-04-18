import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'

export function useDragSensors() {
  return useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 50,
        delay: 500
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 100
      }
    })
  )
}
