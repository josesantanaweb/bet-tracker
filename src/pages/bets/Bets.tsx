import { Bet } from './Bet'

import type { IBet } from '@/types'

interface BetProps {
  onEdit: (bet: IBet) => void
  onDelete: (bet: IBet) => void
  bets: IBet[]
}

export const Bets = ({ onEdit, onDelete, bets }: BetProps) => {
  return (
    <div className="grid grid-cols-1 items-center gap-3 py-8">
      {bets.map((bet) => (
        <Bet key={bet.id} bet={bet} onEdit={() => onEdit(bet)} onDelete={() => onDelete(bet)} />
      ))}
    </div>
  )
}
