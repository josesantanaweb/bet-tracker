import { useState } from 'react'

import { Matches } from './Matches'
import { MatchUpsertDialog } from './MatchUpsertDialog'
import { TeamsSkeleton } from '../teams/TeamsSkeleton'

import type { IMatch } from '@/types'

import { HeaderSections, EmptyState } from '@/components/common'
import { useDeleteTeam } from '@/hooks'

export const MatchesPage = () => {
  const matches: IMatch[] = [
    {
      id: '1',
      home: {
        name: 'Real Madrid',
        logo: 'https://static.flashscore.com/res/image/data/A7kHoxZA-ttfpEDUq.png',
      },
      away: {
        name: 'Barcelona',
        logo: 'https://static.flashscore.com/res/image/data/8dhw5vxS-fcDVLdrL.png',
      },
      date: '2026-04-12',
      time: '10:00 AM',
      status: 'pending',
      result: null,
      markets: [
        {
          id: 'winner',
          name: 'Ganador',
          odds: {
            home: 1.85,
            away: 2.1,
          },
        },
        {
          id: 'team-win-half',
          name: 'Equipo ganará al menos una mitad',
          odds: {
            home: 1.42,
            away: 1.68,
          },
        },
        {
          id: 'team-score-over-05',
          name: 'Equipo hará +0.5 goles',
          odds: {
            home: 1.12,
            away: 1.24,
          },
        },
      ],
    },
  ]
  // const { data: matches = [], isLoading, isError } = useTeams()
  const { mutateAsync: deleteMatch } = useDeleteTeam()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [matchToEdit, setMatchToEdit] = useState<IMatch | null>(null)

  const handleAdd = () => {
    setMatchToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditMatch = (_match: IMatch) => {}

  const handleDeleteMatch = async (match: IMatch) => {
    try {
      await deleteMatch(match.id)
    } catch {
      console.error('Error al eliminar el equipo')
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
      <MatchUpsertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange} match={matchToEdit} />
      {/* {isLoading && <TeamsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar los partidos.</p>
      )}
      {!isLoading && !isError && matches.length === 0 && (
        <EmptyState text="Agrega tu primer partido" />
      )} */}

      <Matches matches={matches} onEditMatch={handleEditMatch} onDeleteMatch={handleDeleteMatch} />
    </div>
  )
}
