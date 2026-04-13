import { MatchForm } from './MatchForm'

import type { IMatch } from '@/types'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

interface MatchUpsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match?: IMatch | null
}

export const MatchUpsertDialog = ({ open, onOpenChange, match }: MatchUpsertDialogProps) => {
  const isEdit = Boolean(match)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="620px">
        <DialogClose aria-label="Cerrar modal" />
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar partido' : 'Nuevo partido'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del partido y guarda los cambios.'
              : 'Completa los datos para registrar un nuevo partido.'}
          </DialogDescription>
        </DialogHeader>
        <MatchForm match={match ?? undefined} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
