import { Football } from '@boxicons/react'

import { formatAmount } from './betUtils'

import { DropdownActions } from '@/components/common'
import { Badge } from '@/components/ui'
import { type IBet } from '@/types'

interface BetProps {
  bet: IBet
  onEdit: () => void
  onDelete: () => void
}

export const Bet = ({ bet, onEdit, onDelete }: BetProps) => {
  return (
    <div className="border-stroke bg-secondary-dark relative flex flex-col gap-3 rounded-xl p-4">
      <div className="border-secondary/50 flex items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-3">
          <Football size="sm" />
          <div className="flex items-center gap-2">
            <p className="truncate text-sm text-white">{bet.home.name}</p>
            <div className="h-6 w-6">
              <img src={bet.home.logo} alt={bet.home.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <p className="text-sm text-white">vs</p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6">
              <img src={bet.away.logo} alt={bet.away.name} className="h-full w-full object-cover" />
            </div>
            <p className="truncate text-sm text-white">{bet.away.name}</p>
          </div>
        </div>

        <div className="">
          <DropdownActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold text-white capitalize">{`${bet.market} - ${bet.selection}`}</p>
          <div className="flex items-center gap-3">
            <p className="text-muted text-xs">
              Cuota:<span className="font-semibold text-white"> {bet.odd.toFixed(2)}</span>
            </p>
            <p className="text-muted/30 text-xs">|</p>
            <p className="text-muted text-xs">
              Stake: <span className="font-semibold text-white">{formatAmount(bet.stake)}</span>
            </p>
            <p className="text-muted/30 text-xs">|</p>
            <p className="text-muted text-xs">
              Payout: <span className="text-success font-semibold">{formatAmount(bet.payout)}</span>
            </p>
          </div>
        </div>
        <Badge status={bet.status} />
      </div>
    </div>
  )
}
