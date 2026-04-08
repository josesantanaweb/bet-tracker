import { Community } from '@boxicons/react'

interface EmptyStateProps {
  text: string
}

export const EmptyState = ({ text }: EmptyStateProps) => {
  return (
    <div className="border-secondary my-20 flex h-40 justify-center rounded-2xl border">
      <div className="text-secondary flex flex-col items-center justify-center">
        <Community size="lg" />
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    </div>
  )
}

EmptyState.displayName = "EmptyState";