'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-background">
      {/* Left Nav */}
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">Astral Kanban</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-1">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>
    </div>
  )
}
