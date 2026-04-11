import { TeamForm } from './TeamForm'

import type { ITeam } from '@/types'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

interface TeamUpsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: ITeam | null
}

export const TeamUpsertDialog = ({ open, onOpenChange, team }: TeamUpsertDialogProps) => {
  const isEdit = Boolean(team)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="620px">
        <DialogClose aria-label="Cerrar modal" />
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar equipo' : 'Nuevo equipo'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del equipo y guarda los cambios.'
              : 'Completa los datos para registrar un nuevo equipo.'}
          </DialogDescription>
        </DialogHeader>
        <TeamForm team={team ?? undefined} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
