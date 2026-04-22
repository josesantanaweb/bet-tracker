export const MatchesCalendar = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="border-secondary/50 flex cursor-pointer flex-col items-center justify-center border-b px-3 py-2">
        <p className="text-primary/50 text-xs font-semibold">Mar</p>
        <p className="text-muted/50 text-xs">22 Abril</p>
      </div>
      <div className="border-primary flex cursor-pointer flex-col items-center justify-center border-b px-3 py-2">
        <p className="text-primary text-xs font-semibold">Today</p>
        <p className="text-muted text-xs">23 Abril</p>
      </div>
      <div className="border-secondary/50 flex cursor-pointer flex-col items-center justify-center border-b px-3 py-2">
        <p className="text-primary text-xs font-semibold">Jue</p>
        <p className="text-muted text-xs">24 Abril</p>
      </div>
    </div>
  )
}
