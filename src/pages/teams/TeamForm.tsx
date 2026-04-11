import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { type Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { ICreateTeam, ITeam } from '@/types'

import { Button, Input } from '@/components/ui'
import { useCreateTeam, useUpdateTeam } from '@/hooks'

const newTeamSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(60, 'Nombre muy largo'),
  logo: z.string().url('Ingresa una URL valida para el logo'),
})

interface TeamFormProps {
  team?: ITeam
  onSuccess?: () => void
}

export const TeamForm = ({ team, onSuccess }: TeamFormProps) => {
  const isEdit = Boolean(team)
  const createMutation = useCreateTeam()
  const updateMutation = useUpdateTeam()

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending
  const isError = isEdit ? updateMutation.isError : createMutation.isError
  const error = isEdit ? updateMutation.error : createMutation.error

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateTeam>({
    resolver: zodResolver(newTeamSchema) as Resolver<ICreateTeam>,
    defaultValues: {
      name: '',
      logo: '',
    },
  })

  useEffect(() => {
    if (team) {
      reset({ name: team.name, logo: team.logo })
    } else {
      reset({ name: '', logo: '' })
    }
  }, [team, reset])

  const onSubmit = async (values: ICreateTeam) => {
    if (team) {
      await updateMutation.mutateAsync({ id: team.id, ...values })
    } else {
      await createMutation.mutateAsync(values)
    }
    reset()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
      <div>
        <Input placeholder="Nombre del equipo" {...register('name')} />
        {errors.name && <p className="pt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Input placeholder="Logo del equipo (URL)" {...register('logo')} />
        {errors.logo && <p className="pt-1 text-xs text-red-500">{errors.logo.message}</p>}
      </div>

      {isError && (
        <p className="text-xs text-red-500">
          {error instanceof Error
            ? error.message
            : isEdit
              ? 'Error al actualizar el equipo'
              : 'Error al crear equipo'}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isEdit
          ? 'Guardar cambios'
          : 'Crear equipo'}
      </Button>
    </form>
  )
}
