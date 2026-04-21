import { BetForm } from './BetForm'

import type { IBet } from '@/types'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

interface BetUpsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bet?: IBet | null
}

export const BetUpsertDialog = ({ open, onOpenChange, bet }: BetUpsertDialogProps) => {
  const isEdit = Boolean(bet)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="620px">
        <DialogClose aria-label="Cerrar modal" />
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar apuesta' : 'Nueva apuesta'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos de la apuesta y guarda los cambios.'
              : 'Completa los datos para registrar una nueva apuesta.'}
          </DialogDescription>
        </DialogHeader>
        <BetForm bet={bet ?? undefined} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
