import { useState } from 'react'

import { Teams } from './Teams'
import { TeamsSkeleton } from './TeamsSkeleton'
import { TeamsTabs, type TeamsTabKey } from './TeamsTabs'
import { TeamUpsertDialog } from './TeamUpsertDialog'

import type { ITeam } from '@/types'

import { HeaderSections, EmptyState } from '@/components/common'
import { useDeleteTeam, useTeams, useUpdateTeam } from '@/hooks'

export const TeamsPage = () => {
  const { data: teams = [], isLoading, isError } = useTeams()
  const { mutateAsync: deleteTeam } = useDeleteTeam()
  const { mutateAsync: updateTeam } = useUpdateTeam()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState<ITeam | null>(null)
  const [activeTab, setActiveTab] = useState<TeamsTabKey>('all')

  const favoriteTeams = teams.filter((team) => team.isFavorite)
  const visibleTeams = activeTab === 'favorites' ? favoriteTeams : teams

  const handleAdd = () => {
    setTeamToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditTeam = (team: ITeam) => {
    setTeamToEdit(team)
    setIsDialogOpen(true)
  }

  const handleFavoriteTeam = (team: ITeam) => {
    updateTeam({ id: team.id, isFavorite: !team.isFavorite }).catch(() => {
      console.error('Error al actualizar favorito del equipo')
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setTeamToEdit(null)
    }
  }

  const handleDeleteTeam = async (team: ITeam) => {
    try {
      await deleteTeam(team.id)
    } catch {
      console.error('Error al eliminar el equipo')
    }
  }

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections
        title="Equipos"
        description={`${teams.length} equipos`}
        onAdd={handleAdd}
      />
      <TeamUpsertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange} team={teamToEdit} />
      {isLoading && <TeamsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar los equipos.</p>
      )}
      {!isLoading && !isError && teams.length === 0 && (
        <EmptyState text="Agrega tu primer equipo" />
      )}
      {!isLoading && !isError && teams.length > 0 && (
        <div className="flex flex-col w-full py-8 gap-5">
          <TeamsTabs
            activeTab={activeTab}
            allCount={teams.length}
            favoritesCount={favoriteTeams.length}
            onTabChange={setActiveTab}
          />
          {visibleTeams.length > 0 ? (
            <Teams
              teams={visibleTeams}
              activeTab={activeTab}
              onEditTeam={handleEditTeam}
              onDeleteTeam={handleDeleteTeam}
              onFavoriteTeam={handleFavoriteTeam}
            />
          ) : (
            <EmptyState text="No tienes equipos favoritos" />
          )}
        </div>
      )}
    </div>
  )
}
