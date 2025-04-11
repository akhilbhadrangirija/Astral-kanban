"use client"

import { useMemo, useState } from "react"
import { TaskCard, Task } from "./TaskCard"
import { Button } from "@/components/ui/button"
import useMedia from "use-media"
import { motion, AnimatePresence } from "framer-motion"
import { getRandomColor, MAX_WIDTH_MOBILE, getMonthName } from "@/lib/utils"
import events from "@/lib/events"
import { ChevronLeft, ChevronRight } from "lucide-react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]



export function CalendarView() {
  const isMobile = useMedia({ maxWidth: MAX_WIDTH_MOBILE })
  const [selectedDay, setSelectedDay] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("left")

  const calendarData = useMemo(() => {
    // Get all dates from events and sort them
    const eventDates = Object.keys(events).sort();

    // If no events, provide a default week
    if (eventDates.length === 0) {
      const today = new Date();
      const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return {
        firstDate: defaultDate,
        lastDate: defaultDate,
        weekDates: [defaultDate],
        weeklyTasks: [[]] as Task[][],
        monthYear: `${getMonthName(today.getMonth())} ${today.getFullYear()}`
      };
    }

    // Get the first and last date
    const firstDate = eventDates[0];
    const lastDate = eventDates[eventDates.length - 1];

    // Convert event dates to Task format
    const weeklyTasks = eventDates.map(date => {
      return events[date].map(event => ({
        time: event.time,
        title: event.title,
        description: event.description,
        color: getRandomColor(event.id),
        imageUrl: event.imageUrl
      } as Task));
    });

    // Get month and year for display
    const firstDateObj = new Date(firstDate);
    const lastDateObj = new Date(lastDate);

    const firstMonth = getMonthName(firstDateObj.getMonth());
    const lastMonth = getMonthName(lastDateObj.getMonth());
    const firstYear = firstDateObj.getFullYear();
    const lastYear = lastDateObj.getFullYear();

    let monthYearDisplay;
    if (firstMonth === lastMonth && firstYear === lastYear) {
      monthYearDisplay = `${firstMonth} ${firstYear}`;
    } else if (firstYear === lastYear) {
      monthYearDisplay = `${firstMonth} - ${lastMonth} ${firstYear}`;
    } else {
      monthYearDisplay = `${firstMonth} ${firstYear} - ${lastMonth} ${lastYear}`;
    }

    return {
      firstDate,
      lastDate,
      weekDates: eventDates,
      weeklyTasks,
      monthYear: monthYearDisplay
    };
  }, []);

  const getDayDetails = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to 0-6 where 0 is Monday
    return {
      dayName: days[dayOfWeek],
      shortDayName: shortDays[dayOfWeek],
      day: date.getDate(),
      month: getMonthName(date.getMonth()),
      year: date.getFullYear()
    };
  };

  const currentDateDetails = calendarData.weekDates[selectedDay]
    ? getDayDetails(calendarData.weekDates[selectedDay])
    : { dayName: "Monday", shortDayName: "Mon", day: 1, month: "January", year: 2024 };

  const handlePrevious = () => {

  };

  const handleNext = () => {

  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {isMobile
            ? `${currentDateDetails.dayName}, ${currentDateDetails.month} ${currentDateDetails.day}, ${currentDateDetails.year}`
            : calendarData.monthYear}
        </h2>
        {!isMobile &&
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={selectedDay === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {currentDateDetails.month} {currentDateDetails.day}–
              {calendarData.weekDates.length > selectedDay + 6
                ? getDayDetails(calendarData.weekDates[selectedDay + 6]).day
                : getDayDetails(calendarData.weekDates[calendarData.weekDates.length - 1]).day},
              {currentDateDetails.year}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={selectedDay >= calendarData.weekDates.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        }
      </div>


      {isMobile ? (
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedDay}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80 && selectedDay < calendarData.weekDates.length - 1) {
                  setDirection("left")
                  setSelectedDay((prev) => prev + 1)
                } else if (info.offset.x > 80 && selectedDay > 0) {
                  setDirection("right")
                  setSelectedDay((prev) => prev - 1)
                }
              }}
              initial={{ x: direction === "left" ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === "left" ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 cursor-grab active:cursor-grabbing"
            >
              {calendarData.weeklyTasks[selectedDay]?.length > 0 ? (
                calendarData.weeklyTasks[selectedDay].map((task, idx) => (
                  <TaskCard key={idx} {...task} />
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No events scheduled
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, idx) => {
            // For each day of the week (0=Monday, 6=Sunday)
            // Find events that fall on this day of the week
            const eventsForThisDay = calendarData.weekDates
              .filter(dateStr => {
                const date = new Date(dateStr);
                const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to 0-6 where 0 is Monday
                return dayOfWeek === idx;
              })
              .flatMap(dateStr => {
                const dateIndex = calendarData.weekDates.indexOf(dateStr);
                return calendarData.weeklyTasks[dateIndex] || [];
              });


            // Get a representative date for this column
            const representativeDate = calendarData.weekDates.find(dateStr => {
              const date = new Date(dateStr);
              const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
              return dayOfWeek === idx;
            });

            const dayDetails = representativeDate
              ? getDayDetails(representativeDate)
              : { shortDayName: shortDays[idx], day: "-" };

            return (
              <div key={idx} className="bg-muted/10 rounded-xl p-2 min-h-[60]">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {dayDetails.shortDayName} {dayDetails.day}
                </div>
                {eventsForThisDay.length > 0 ? (
                  eventsForThisDay.map((task, taskIdx) => (
                    <TaskCard key={taskIdx} {...task} />
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground text-sm">
                    No events
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isMobile && (
        <div className="text-center text-sm text-muted-foreground mb-2 animate-pulse">
          ← Swipe to navigate days →
        </div>
      )}

    </div>
  )
}
