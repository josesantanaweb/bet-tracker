import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button, Input } from '@/components/ui'
import { useCreateTeam } from '@/hooks'

const newTeamSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(60, 'Nombre muy largo'),
  logo: z.string().url('Ingresa una URL valida para el logo'),
})

type TeamFormValues = z.infer<typeof newTeamSchema>

interface TeamFormProps {
  onSuccess?: () => void
}

export const TeamForm = ({ onSuccess }: TeamFormProps) => {
  const { mutateAsync, isPending, isError, error } = useCreateTeam()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(newTeamSchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  })

  const onSubmit = async (values: TeamFormValues) => {
    await mutateAsync(values)
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
          {error instanceof Error ? error.message : 'Error al crear equipo'}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear equipo'}
      </Button>
    </form>
  )
}
