import { Check, Football, TrendingDown } from '@boxicons/react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'


import { DropdownActions } from '@/components/common'
import { Badge } from '@/components/ui'
import { formatAmount, formatMatchDate } from '@/lib/format'
import { BetSelectionLabel, BetStatus, type BetStatus as TBetStatus, type IBet } from '@/types'

interface BetProps {
  bet: IBet
  onEdit: () => void
  onDelete: () => void
  onSetStatus: (status: TBetStatus) => void
}

const SWIPE_REVEAL_WIDTH = 112
const SWIPE_OPEN_THRESHOLD = 36
const SWIPE_VELOCITY_THRESHOLD = 550

export const Bet = ({ bet, onEdit, onDelete, onSetStatus }: BetProps) => {
  const [isActionsRevealed, setIsActionsRevealed] = useState(false)
  const swipeX = useMotionValue(0)
  const actionsOpacity = useTransform(swipeX, [0, 14, SWIPE_REVEAL_WIDTH], [0, 0.5, 1])
  const actionsScale = useTransform(swipeX, [0, SWIPE_REVEAL_WIDTH], [0.9, 1])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const shouldOpen =
      info.offset.x > SWIPE_OPEN_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD

    const nextX = shouldOpen ? SWIPE_REVEAL_WIDTH : 0
    setIsActionsRevealed(shouldOpen)
    animate(swipeX, nextX, {
      type: 'spring',
      stiffness: 420,
      damping: 34,
    })
  }

  const handleSetStatus = (status: TBetStatus) => {
    if (bet.status !== status) {
      onSetStatus(status)
    }

    setIsActionsRevealed(false)
    animate(swipeX, 0, {
      type: 'spring',
      stiffness: 420,
      damping: 34,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <motion.div
        className={`absolute top-0 left-0 flex h-full w-28 ${isActionsRevealed ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ opacity: actionsOpacity, scale: actionsScale }}
      >
        <button
          type="button"
          onClick={() => handleSetStatus(BetStatus.WON)}
          disabled={bet.status !== BetStatus.PENDING}
          aria-label="Marcar apuesta como ganada"
          className={`flex w-14 cursor-pointer items-center justify-center bg-emerald-500/50 text-white ${bet.status !== BetStatus.PENDING ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <Check size="sm" />
        </button>
        <button
          type="button"
          onClick={() => handleSetStatus(BetStatus.LOST)}
          disabled={bet.status !== BetStatus.PENDING}
          aria-label="Marcar apuesta como perdida"
          className={`flex w-14 cursor-pointer items-center justify-center bg-red-500/50 text-white ${bet.status !== BetStatus.PENDING ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <TrendingDown size="sm" />
        </button>
      </motion.div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: SWIPE_REVEAL_WIDTH }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x: swipeX, touchAction: 'pan-y' }}
        className={`border-stroke bg-secondary-dark relative flex flex-col gap-3 p-4 ${isActionsRevealed ? 'rounded-r-xl' : 'rounded-xl'}`}
      >
        <div className="border-secondary/50 flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-3">
            <Football size="sm" />
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-between gap-2 w-28">
                <p className="truncate text-sm text-white">{bet.home.name}</p>
                <div className="h-6 w-6">
                  <img
                    src={bet.home.logo}
                    alt={bet.home.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-white">vs</p>
              <div className="flex items-center justify-between gap-2 w-28">
                <div className="h-6 w-6">
                  <img
                    src={bet.away.logo}
                    alt={bet.away.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="truncate text-sm text-white">{bet.away.name}</p>
              </div>
            </div>
          </div>
          <div className="">
            <DropdownActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold text-white capitalize">{`${bet.market} - ${BetSelectionLabel[bet.selection]}`}</p>
              <p className="text-muted text-xs">{formatMatchDate(bet.date)}</p>
            </div>
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
                Payout:{' '}
                <span className="text-success font-semibold">{formatAmount(bet.payout)}</span>
              </p>
            </div>
          </div>
          <Badge status={bet.status} />
        </div>
      </motion.div>
    </div>
  )
}
