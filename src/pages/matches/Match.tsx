import { Check, ChevronDown, Trash } from '@boxicons/react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'

import { formatMatchDate, formatMatchTime } from './dateUtils'

import { MatchStatus, type IMatch } from '@/types'

interface MatchProps {
  match: IMatch
  onEdit: () => void
  onFinish: () => void
  onDelete: () => void
}

const SWIPE_REVEAL_WIDTH = 112
const SWIPE_OPEN_THRESHOLD = 36
const SWIPE_VELOCITY_THRESHOLD = 550

export const Match = ({ match, onEdit: _onEdit, onFinish, onDelete }: MatchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteRevealed, setIsDeleteRevealed] = useState(false)
  const swipeX = useMotionValue(0)
  const deleteOpacity = useTransform(swipeX, [0, 14, SWIPE_REVEAL_WIDTH], [0, 0.5, 1])
  const deleteScale = useTransform(swipeX, [0, SWIPE_REVEAL_WIDTH], [0.9, 1])
  const formattedDate = formatMatchDate(match.date)
  const formattedTime = formatMatchTime(match.date)
  const formatOdd = (odd: number) => odd.toFixed(2)

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const shouldOpen =
      info.offset.x > SWIPE_OPEN_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD

    const nextX = shouldOpen ? SWIPE_REVEAL_WIDTH : 0
    setIsDeleteRevealed(shouldOpen)
    animate(swipeX, nextX, {
      type: 'spring',
      stiffness: 420,
      damping: 34,
    })
  }

  const handleDelete = () => {
    onDelete()
    setIsDeleteRevealed(false)
    animate(swipeX, 0, {
      type: 'spring',
      stiffness: 420,
      damping: 34,
    })
  }

  const handleMarkAsFinished = () => {
    if (match.status !== MatchStatus.FINISHED) {
      onFinish()
    }

    setIsDeleteRevealed(false)
    animate(swipeX, 0, {
      type: 'spring',
      stiffness: 420,
      damping: 34,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <motion.div
        className={`absolute top-0 left-0 flex h-full w-28 ${isDeleteRevealed ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ opacity: deleteOpacity, scale: deleteScale }}
      >
        <button
          type="button"
          onClick={handleMarkAsFinished}
          aria-label="Marcar partido como finalizado"
          className="flex w-14 cursor-pointer items-center justify-center bg-emerald-500/50 text-white"
        >
          <Check size="sm" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Eliminar partido"
          className="flex w-14 cursor-pointer items-center justify-center bg-red-500/50 text-white"
        >
          <Trash size="sm" />
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
        className={`bg-secondary-dark relative flex flex-col p-4 ${isDeleteRevealed ? 'rounded-r-xl' : 'rounded-xl'}`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <h6 className="w-20 truncate text-sm text-white">{match.home.name}</h6>
              <div className="h-8 w-8">
                <img
                  src={match.home.logo}
                  alt={match.home.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p
                className={`text-xs font-semibold whitespace-nowrap ${match.status === MatchStatus.PENDING ? 'text-primary' : 'text-emerald-500'}`}
              >
                {match.status === MatchStatus.PENDING ? formattedTime : 'Finalizado'}
              </p>
              <p className="text-muted text-xs whitespace-nowrap">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8">
                <img
                  src={match.away.logo}
                  alt={match.away.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h6 className="w-20 truncate text-sm text-white">{match.away.name}</h6>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="bg-secondary shrink-0 cursor-pointer rounded-md p-1.5 transition-colors hover:opacity-90"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Ocultar detalles del partido' : 'Ver detalles del partido'}
            >
              <motion.span
                className="flex"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ChevronDown size="sm" />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col items-center gap-4">
                {match.markets.map((market) => (
                  <div key={market.id} className="flex w-full flex-col gap-2">
                    <h6 className="text-xs font-semibold text-white">{market.name}</h6>
                    <div className="grid w-full grid-cols-2 flex-col items-start gap-2">
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="bg-canvas flex h-10 flex-1 items-center justify-between gap-2 rounded-lg px-3">
                          <p className="text-muted text-xs">Local</p>
                          <p className="text-xs font-semibold text-white">
                            {formatOdd(market.odds.home)}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="bg-canvas flex h-10 flex-1 items-center justify-between gap-2 rounded-lg px-3">
                          <p className="text-muted text-xs">Visitante</p>
                          <p className="text-xs font-semibold text-white">
                            {formatOdd(market.odds.away)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
