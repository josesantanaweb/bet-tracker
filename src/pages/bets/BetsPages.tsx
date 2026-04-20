import { Bets } from './Bets'
import { BetsSkeleton } from './BetsSkeleton'

import type { IBet } from '@/types'

import { EmptyState, HeaderSections } from '@/components/common'
import { useBets } from '@/hooks'

export const BetsPage = () => {
  const { data: bets = [], isLoading, isError } = useBets()

  const handleAdd = () => {}
  const onEdit = (_bet: IBet) => {}
  const onDelete = (_bet: IBet) => {}

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections title="Apuestas" description={`${bets.length} apuestas`} onAdd={handleAdd} />
      {isLoading && <BetsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar las apuestas.</p>
      )}
      {!isLoading && !isError && bets.length === 0 && (
        <EmptyState text="Agrega tu primera apuesta" />
      )}
      {!isLoading && !isError && bets.length > 0 && (
        <Bets onEdit={onEdit} onDelete={onDelete} bets={bets} />
      )}
    </div>
  )
}
