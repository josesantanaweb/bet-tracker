import { ChevronDown } from '@boxicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { formatMatchDate, formatMatchTime } from './dateUtils'

import type { IMatch } from '@/types'

interface MatchProps {
  match: IMatch
  onEdit: () => void
  onDelete: () => void
}

export const Match = ({ match, onEdit: _onEdit, onDelete: _onDelete }: MatchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const formattedDate = formatMatchDate(match.date)
  const formattedTime = formatMatchTime(match.date)
  const formatOdd = (odd: number) => odd.toFixed(2)

  return (
    <div className="bg-secondary-dark relative flex flex-col rounded-xl p-4">
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
            <p className="text-primary text-xs font-semibold whitespace-nowrap">{formattedTime}</p>
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
    </div>
  )
}
