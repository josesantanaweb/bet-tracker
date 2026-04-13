import { ChevronDown } from '@boxicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import type { IMatch } from '@/types'

interface MatchProps {
    match: IMatch
    onEdit: () => void
    onDelete: () => void
}

export const Match = ({ match, onEdit: _onEdit, onDelete: _onDelete }: MatchProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-secondary-dark relative flex flex-col rounded-xl p-4">
            <div className="flex w-full items-center justify-between">
                <div className="flex w-full items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <h6 className="w-[80px] truncate text-sm text-white">{match.name}</h6>
                        <div className="h-8 w-8">
                            <img src={match.logo} alt={match.name} className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-medium text-sm whitespace-nowrap text-primary">09:00 AM</p>
                        <p className="text-xs whitespace-nowrap text-muted">12 Abril</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8">
                            <img src={match.logo} alt={match.name} className="h-full w-full object-cover" />
                        </div>
                        <h6 className="w-[80px] truncate text-sm text-white">{match.name}</h6>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    className="bg-secondary shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors hover:opacity-90"
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
                        <div className="w-full flex flex-col gap-2 mt-3">
                            <h6 className="text-sm text-white font-medium">Ganador</h6>
                            <div className="grid grid-cols-2 items-start flex-col gap-2 w-full">
                                <div className="flex items-center gap-3 justify-between w-full">
                                    <div className="flex items-center gap-2 justify-between px-3 bg-canvas rounded-xl flex-1 h-12">
                                        <p className="text-xs text-muted">Local</p>
                                        <p className="text-sm text-white">1.50</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 justify-between w-full">
                                    <div className="flex gap-2 justify-between px-3 items-center bg-canvas rounded-xl flex-1 h-12">
                                        <p className="text-xs text-muted">Visitante</p>
                                        <p className="text-sm text-white">1.50</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2 mt-3">
                            <h6 className="text-sm text-white font-medium">Equipo ganará al menos una mitad</h6>
                            <div className="grid grid-cols-2 items-start flex-col gap-2 w-full">
                                <div className="flex items-center gap-3 justify-between w-full">
                                    <div className="flex items-center gap-2 justify-between px-3 bg-canvas rounded-xl flex-1 h-12">
                                        <p className="text-xs text-muted">Local</p>
                                        <p className="text-sm text-white">1.50</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 justify-between w-full">
                                    <div className="flex gap-2 justify-between px-3 items-center bg-canvas rounded-xl flex-1 h-12">
                                        <p className="text-xs text-muted">Visitante</p>
                                        <p className="text-sm text-white">1.50</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
