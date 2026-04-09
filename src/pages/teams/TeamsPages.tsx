import { useState } from 'react'

import { TeamsList } from './TeamsList'
import { TeamsSkeleton } from './TeamsSkeleton'

import { HeaderSections, EmptyState } from '@/components/common'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { useTeams } from '@/hooks/useTeams'

export default function TeamsPage() {
  const { data: teams = [], isLoading, isError } = useTeams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAdd = () => setIsDialogOpen(true)

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections
        title="Mis Equipos"
        description={`${teams.length} equipos registrados`}
        onAdd={handleAdd}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent maxWidth="620px">
          <DialogClose aria-label="Cerrar modal" />
          <DialogHeader>
            <DialogTitle>Nuevo Equipo</DialogTitle>
            <DialogDescription>hola</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {isLoading && <TeamsSkeleton />}
      {!isLoading && isError && (
        <p className="py-8 text-sm text-red-500">No se pudieron cargar los equipos.</p>
      )}
      {!isLoading && !isError && teams.length === 0 && (
        <EmptyState text="Agrega tu primer equipo" />
      )}
      {!isLoading && !isError && teams.length > 0 && <TeamsList teams={teams} />}
    </div>
  )
}
