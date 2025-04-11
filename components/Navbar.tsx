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

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>
    </div>
  )
}
