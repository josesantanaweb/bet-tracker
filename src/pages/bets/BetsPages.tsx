import { useState } from 'react'

import { Bets } from './Bets'
import { BetsSkeleton } from './BetsSkeleton'
import { BetUpsertDialog } from './BetUpsertDialog'

import type { BetStatus, IBet } from '@/types'

import { EmptyState, HeaderSections } from '@/components/common'
import { useBets, useFinishBet, useDeleteBet } from '@/hooks'

export const BetsPage = () => {
  const { data: bets = [], isLoading, isError } = useBets()
  const { mutateAsync: finishBet } = useFinishBet()
  const { mutateAsync: deleteBet } = useDeleteBet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAdd = () => {
    setIsDialogOpen(true)
  }
  const onEdit = (_bet: IBet) => {}

  const onSetStatus = async (bet: IBet, status: BetStatus) => {
    try {
      await finishBet({ betId: bet.id, status })
    } catch {
      console.error('Error al actualizar el estado de la apuesta')
    }
  }

  const handleDeleteBet = async (bet: IBet) => {
    try {
      await deleteBet(bet.id)
    } catch {
      console.error('Error al eliminar la apuesta')
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    // if (!open) {
    //   setMatchToEdit(null)
    // }
  }

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections title="Apuestas" description={`${bets.length} apuestas`} onAdd={handleAdd} />
      <BetUpsertDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
      {isLoading && <BetsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar las apuestas.</p>
      )}
      {!isLoading && !isError && bets.length === 0 && (
        <EmptyState text="Agrega tu primera apuesta" />
      )}
      {!isLoading && !isError && bets.length > 0 && (
        <Bets onEdit={onEdit} onDelete={handleDeleteBet} onSetStatus={onSetStatus} bets={bets} />
      )}
    </div>
  )
}
