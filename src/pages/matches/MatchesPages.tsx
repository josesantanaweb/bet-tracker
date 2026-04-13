import { useState } from 'react'

import { Matches } from './Matches'
// import { TeamsSkeleton } from './TeamsSkeleton'
// import { TeamUpsertDialog } from './TeamUpsertDialog'

import type { IMatch } from '@/types'

import { HeaderSections, EmptyState } from '@/components/common'
import { useDeleteTeam, useTeams } from '@/hooks'

export const MatchesPage = () => {
  // const { data: matches = [], isLoading, isError } = useTeams()
  const matches = [
    {
      id: '1',
      name: 'Madri vs Barcelona',
      home: {
        name: 'Real Madrid',
        logo: 'https://via.placeholder.com/150',
      },
      away: {
        name: 'Barcelona',
        logo: 'https://via.placeholder.com/150',
      },
      date: '2026-04-12',
      time: '10:00 AM',
      status: 'pending',
      result: null,
    },
  ]
  const { mutateAsync: deleteMatch } = useDeleteTeam()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null)

  const handleAdd = () => {
    setMatchToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditMatch = (match: IMatch) => {
    setMatchToEdit(match)
    setIsDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setMatchToEdit(null)
    }
  } 

  const handleDeleteMatch = async (match: IMatch) => {
    try {
      await deleteMatch(match.id)
    } catch {
      console.error('Error al eliminar el equipo')
    }
  }

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections
        title="Partidos"
        description={`${matches.length} partidos`}
        onAdd={handleAdd}
      />
      {/* <TeamUpsertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange} team={teamToEdit} />
      {isLoading && <TeamsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar los equipos.</p>
      )}
      {!isLoading && !isError && teams.length === 0 && (
        <EmptyState text="Agrega tu primer equipo" />
      )}
      {!isLoading && !isError && teams.length > 0 && (
        <TeamsList teams={teams} onEditTeam={handleEditTeam} onDeleteTeam={handleDeleteTeam} />
      )} */}

      <Matches matches={matches} onEditMatch={handleEditMatch} onDeleteMatch={handleDeleteMatch} />
    </div>
  )
}
