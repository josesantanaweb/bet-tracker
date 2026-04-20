import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, type Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'
import 'react-datepicker/dist/react-datepicker.css'

import {
  buildMatchDateTimeValue,
  formatDateValue,
  formatMatchDateValue,
  formatMatchTimeValue,
  parseDateValue,
} from './dateUtils'

import type { ICreateMatch, IMatch, ITeam } from '@/types'

import { Button, Input, Select } from '@/components/ui'
import { useTeams, useCreateMatch } from '@/hooks'

const newMatchSchema = z
  .object({
    date: z.string().min(1, 'Ingresa la fecha del partido'),
    time: z.string().min(1, 'Ingresa la hora del partido'),
    homeTeamId: z.string().min(1, 'Selecciona el equipo local'),
    awayTeamId: z.string().min(1, 'Selecciona el equipo visitante'),
    winnerHome: z.coerce.number().positive('Cuota invalida'),
    winnerAway: z.coerce.number().positive('Cuota invalida'),
    teamWinHalfHome: z.coerce.number().positive('Cuota invalida'),
    teamWinHalfAway: z.coerce.number().positive('Cuota invalida'),
    teamScoreHalfHome: z.coerce.number().positive('Cuota invalida'),
    teamScoreHalfAway: z.coerce.number().positive('Cuota invalida'),
  })
  .refine((values) => values.homeTeamId !== values.awayTeamId, {
    message: 'Local y visitante deben ser equipos diferentes',
    path: ['awayTeamId'],
  })

type MatchFormValues = z.infer<typeof newMatchSchema>

const EMPTY_TEAMS: ITeam[] = []

const defaultMatchFormValues: MatchFormValues = {
  date: '',
  time: '',
  homeTeamId: '',
  awayTeamId: '',
  winnerHome: 1.5,
  winnerAway: 1.5,
  teamWinHalfHome: 1.5,
  teamWinHalfAway: 1.5,
  teamScoreHalfHome: 1.5,
  teamScoreHalfAway: 1.5,
}

interface MatchFormProps {
  match?: IMatch
  onSuccess?: () => void
}

export const MatchForm = ({ match, onSuccess }: MatchFormProps) => {
  const { data: teams = EMPTY_TEAMS, isLoading: isLoadingTeams } = useTeams()
  const createMutation = useCreateMatch()
  const teamOptions = teams.map((team) => ({ value: team.id, label: team.name }))

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(newMatchSchema) as Resolver<MatchFormValues>,
    defaultValues: defaultMatchFormValues,
  })

  useEffect(() => {
    if (match) {
      const homeTeam = teams.find((team) => team.name === match.home.name)
      const awayTeam = teams.find((team) => team.name === match.away.name)

      const winner = match.markets.find((market) => market.id === 'winner')
      const teamWinHalf = match.markets.find((market) => market.id === 'team-win-half')
      const teamScoreHalf = match.markets.find((market) => market.id === 'team-score-over-05')

      reset({
        ...defaultMatchFormValues,
        date: formatMatchDateValue(match.date),
        time: formatMatchTimeValue(match.date),
        homeTeamId: homeTeam?.id ?? '',
        awayTeamId: awayTeam?.id ?? '',
        winnerHome: winner?.odds.home ?? 1.5,
        winnerAway: winner?.odds.away ?? 1.5,
        teamWinHalfHome: teamWinHalf?.odds.home ?? 1.5,
        teamWinHalfAway: teamWinHalf?.odds.away ?? 1.5,
        teamScoreHalfHome: teamScoreHalf?.odds.home ?? 1.5,
        teamScoreHalfAway: teamScoreHalf?.odds.away ?? 1.5,
      })
    } else {
      reset(defaultMatchFormValues)
    }
  }, [match, reset, teams])

  const onSubmit = async (values: MatchFormValues) => {
    const homeTeam = teams.find((team) => team.id === values.homeTeamId)
    const awayTeam = teams.find((team) => team.id === values.awayTeamId)

    if (!homeTeam) {
      setError('homeTeamId', { message: 'Equipo local no encontrado' })
      return
    }

    if (!awayTeam) {
      setError('awayTeamId', { message: 'Equipo visitante no encontrado' })
      return
    }

    const matchDateTime = buildMatchDateTimeValue(values.date, values.time)

    if (!matchDateTime) {
      setError('date', { message: 'La fecha del partido no es valida' })
      return
    }

    const payload: ICreateMatch = {
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      date: matchDateTime,
      markets: [
        {
          id: 'winner',
          name: '1X2',
          odds: {
            home: values.winnerHome,
            away: values.winnerAway,
          },
        },
        {
          id: 'team-win-half',
          name: 'Equipo ganara al menos una mitad',
          odds: {
            home: values.teamWinHalfHome,
            away: values.teamWinHalfAway,
          },
        },
        {
          id: 'team-score-over-05',
          name: 'Equipo hara +0.5 goles',
          odds: {
            home: values.teamScoreHalfHome,
            away: values.teamScoreHalfAway,
          },
        },
      ],
    }

    await createMutation.mutateAsync(payload)
    reset(defaultMatchFormValues)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col">
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              selected={parseDateValue(field.value)}
              onChange={(date: Date | null) => field.onChange(formatDateValue(date))}
              onBlur={field.onBlur}
              placeholderText="Fecha del partido"
              dateFormat="dd/MM/yyyy"
              showPopperArrow={false}
              className="match-datepicker-input"
              popperClassName="match-datepicker-popper"
              calendarClassName="match-datepicker-calendar"
            />
          )}
        />
        {errors.date && <p className="pt-1 text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <div className="flex w-full items-center gap-3">
        <div className="w-full">
          <Controller
            control={control}
            name="homeTeamId"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={teamOptions}
                placeholder="Selecciona local"
                disabled={isLoadingTeams}
              />
            )}
          />
          {errors.homeTeamId && (
            <p className="pt-1 text-xs text-red-500">{errors.homeTeamId.message}</p>
          )}
        </div>
        <div className="w-full">
          <Controller
            control={control}
            name="awayTeamId"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={teamOptions}
                placeholder="Selecciona visitante"
                disabled={isLoadingTeams}
              />
            )}
          />
          {errors.awayTeamId && (
            <p className="pt-1 text-xs text-red-500">{errors.awayTeamId.message}</p>
          )}
        </div>
      </div>

      <div className="flex w-full items-center gap-3 mb-3">
        <div className="flex w-full items-center">
          <Input
            type="time"
            step="1"
            defaultValue="10:30:00"
            placeholder="Hora del partido"
            {...register('time')}
          />
          {errors.time && <p className="pt-1 text-xs text-red-500">{errors.time.message}</p>}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h6 className="text-xs font-medium text-white">1X2</h6>
        <div className="flex items-center gap-3">
          <Input type="number" step="0.01" placeholder="Cuota local" {...register('winnerHome')} />
          <Input
            type="number"
            step="0.01"
            placeholder="Cuota visitante"
            {...register('winnerAway')}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h6 className="text-xs font-medium text-white">Equipo ganara al menos una mitad</h6>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            step="0.01"
            placeholder="Cuota local"
            {...register('teamWinHalfHome')}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Cuota visitante"
            {...register('teamWinHalfAway')}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h6 className="text-xs font-medium text-white">Equipo hara +0.5 goles</h6>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            step="0.01"
            placeholder="Cuota local"
            {...register('teamScoreHalfHome')}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Cuota visitante"
            {...register('teamScoreHalfAway')}
          />
        </div>
      </div>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending
          ? 'Guardando...'
          : match
            ? 'Guardar cambios'
            : 'Crear partido'}
      </Button>
    </form>
  )
}
