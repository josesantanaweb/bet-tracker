import { BetStatus } from '@/types'

interface BadgeProps {
  status: BetStatus
}

export const Badge = ({ status }: BadgeProps) => {
  const STATUS_LABEL: Record<BetStatus, string> = {
    [BetStatus.PENDING]: 'Pendiente',
    [BetStatus.WON]: 'Ganada',
    [BetStatus.LOST]: 'Perdida',
  }

  const STATUS_CLASSNAME: Record<BetStatus, string> = {
    [BetStatus.PENDING]: 'bg-yellow-500/30 text-yellow-500',
    [BetStatus.WON]: 'bg-emerald-500/30 text-emerald-500',
    [BetStatus.LOST]: 'bg-red-500/30 text-red-500',
  }

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs ${STATUS_CLASSNAME[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
