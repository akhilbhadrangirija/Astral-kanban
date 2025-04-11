import { CalendarView } from "@/components/CalendarView"
import { Navbar } from "@/components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CalendarView />
    </main>
  )
}
