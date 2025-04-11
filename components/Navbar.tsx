"use client"

// components/Navbar.tsx
import { Button } from "@/components/ui/button"
import { MAX_WIDTH_MOBILE } from "@/lib/utils"
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Settings, Bell } from "lucide-react"
import Link from "next/link"
import useMedia from "use-media"

export function Navbar() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-background">
      {/* Left Nav */}
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">Astral Kanban</span>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2">
        {!isMobile && <>
          <Button variant="ghost" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-medium px-2">April 8–14, 2025</span>
          <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
        </>}
        <Button variant="default" size="sm" className="ml-2 gap-1">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>
    </div>
  )
}
