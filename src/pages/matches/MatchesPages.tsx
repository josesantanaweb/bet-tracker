import { useState } from 'react'

import { Matches } from './Matches'
import { MatchesSkeleton } from './MatchesSkeleton'
import { MatchUpsertDialog } from './MatchUpsertDialog'

import type { IMatch } from '@/types'

import { HeaderSections, EmptyState } from '@/components/common'
import { useDeleteMatch, useFinishMatch, useMatches } from '@/hooks'

export const MatchesPage = () => {
  const { data: matches = [], isLoading, isError } = useMatches()
  const { mutateAsync: finishMatch } = useFinishMatch()
  const { mutateAsync: deleteMatch } = useDeleteMatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null)

  const handleAdd = () => {
    setMatchToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditMatch = (_match: IMatch) => {}

  const handleFinishMatch = async (match: IMatch) => {
    try {
      await finishMatch(match.id)
    } catch {
      console.error('Error al finalizar el partido')
    }
  }

  const handleDeleteMatch = async (match: IMatch) => {
    try {
      await deleteMatch(match.id)
    } catch {
      console.error('Error al eliminar el partido')
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setMatchToEdit(null)
    }
  }

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections
        title="Partidos"
        description={`${matches.length} partidos`}
        onAdd={handleAdd}
      />
      <MatchUpsertDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        match={matchToEdit}
      />
      {isLoading && <MatchesSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar los partidos.</p>
      )}
      {!isLoading && !isError && matches.length === 0 && (
        <EmptyState text="Agrega tu primer partido" />
      )}
      {!isLoading && !isError && matches.length > 0 && (
        <Matches
          matches={matches}
          onEditMatch={handleEditMatch}
          onFinishMatch={handleFinishMatch}
          onDeleteMatch={handleDeleteMatch}
        />
      )}
    </div>
  )
}
