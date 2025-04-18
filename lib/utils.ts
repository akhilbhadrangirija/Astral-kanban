import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TaskColor } from "./types";

export const MAX_WIDTH_MOBILE = 768

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomColor(id: string): TaskColor {
  const colors: TaskColor[] = ["blue", "green", "purple", "red", "yellow"];
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
}


export function getMonthName(monthIndex: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

export function getTransitionConfig(direction: 'left' | 'right') {
  return {
    initial: { opacity: 0, x: direction === 'left' ? '100%' : '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'left' ? '-100%' : '100%' },
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}
