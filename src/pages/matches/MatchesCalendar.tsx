import { eachDayOfInterval, endOfYear, format, isSameDay, isToday, startOfToday, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useRef } from 'react'

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

interface MatchesCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export const MatchesCalendar = ({ selectedDate, onSelectDate }: MatchesCalendarProps) => {
  const today = startOfToday()
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const days = eachDayOfInterval({
    start: startOfYear(today),
    end: endOfYear(today),
  }).map((date) => {
    const isCurrentDay = isToday(date)

    return {
      id: date.toISOString(),
      date,
      dayLabel: isCurrentDay ? 'Hoy' : capitalize(format(date, 'EEE', { locale: es })),
      dateLabel: capitalize(format(date, 'd MMMM', { locale: es })),
    }
  })

  useEffect(() => {
    const activeButton = sliderRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]')

    activeButton?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedDate])

  return (
    <div
      ref={sliderRef}
      className="flex w-full items-center overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-xl"
    >
      {days.map((day) => {
        const isSelected = isSameDay(day.date, selectedDate)

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDate(day.date)}
            data-selected={isSelected}
            className="min-w-20 shrink-0 cursor-pointer snap-center px-3 py-2 transition-all bg-secondary-dark/20 hover:border-secondary/60"
          >
            <p className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-primary/30'}`}>
              {day.dayLabel}
            </p>
            <p className={`text-xs ${isSelected ? 'text-muted' : 'text-muted/20'}`}>
              {day.dateLabel}
            </p>
          </button>
        )
      })}
    </div>
  )
}
