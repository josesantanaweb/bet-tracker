import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, type Resolver, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import 'react-datepicker/dist/react-datepicker.css'

import type { ICreateMatch, IMarket, IMatch, ITeam } from '@/types'

import { Button, Input, Select } from '@/components/ui'
import { useCreateMatch, useMarkets, useTeams } from '@/hooks'
import {
  buildMatchDateTimeValue,
  formatDateValue,
  formatMatchDateValue,
  formatMatchTimeValue,
  parseDateValue,
} from '@/lib/format'

const newMatchSchema = z
  .object({
    date: z.string().min(1, 'Ingresa la fecha del partido'),
    time: z.string().min(1, 'Ingresa la hora del partido'),
    homeTeamId: z.string().min(1, 'Selecciona el equipo local'),
    awayTeamId: z.string().min(1, 'Selecciona el equipo visitante'),
    matchMarkets: z.array(
      z.object({
        marketId: z.string().min(1),
        marketName: z.string().min(1),
        oddHome: z.coerce.number().positive('Cuota local invalida'),
        oddAway: z.coerce.number().positive('Cuota visitante invalida'),
      }),
    ),
  })
  .refine((values) => values.homeTeamId !== values.awayTeamId, {
    message: 'Local y visitante deben ser equipos diferentes',
    path: ['awayTeamId'],
  })

type MatchFormValues = z.infer<typeof newMatchSchema>

const EMPTY_TEAMS: ITeam[] = []
const EMPTY_MARKETS: IMarket[] = []

const defaultMatchFormValues: MatchFormValues = {
  date: '',
  time: '',
  homeTeamId: '',
  awayTeamId: '',
  matchMarkets: [],
}

const buildMarketFormRows = (markets: IMarket[], match?: IMatch) => {
  return markets.map((market) => {
    const existingMarket = match?.matchMarkets.find((item) => item.id === market.id)

    return {
      marketId: market.id,
      marketName: market.name,
      oddHome: existingMarket?.odds.home ?? 1.5,
      oddAway: existingMarket?.odds.away ?? 1.5,
    }
  })
}

interface MatchFormProps {
  match?: IMatch
  onSuccess?: () => void
}

export const MatchForm = ({ match, onSuccess }: MatchFormProps) => {
  const { data: teams = EMPTY_TEAMS, isLoading: isLoadingTeams } = useTeams()
  const { data: markets = EMPTY_MARKETS } = useMarkets()
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

  const watchedMarkets = useWatch({ control, name: 'matchMarkets' }) ?? []

  useEffect(() => {
    if (match) {
      const homeTeam = teams.find((team) => team.name === match.home.name)
      const awayTeam = teams.find((team) => team.name === match.away.name)

      reset({
        ...defaultMatchFormValues,
        date: formatMatchDateValue(match.date),
        time: formatMatchTimeValue(match.date),
        homeTeamId: homeTeam?.id ?? '',
        awayTeamId: awayTeam?.id ?? '',
        matchMarkets: buildMarketFormRows(markets, match),
      })
    } else {
      reset({
        ...defaultMatchFormValues,
        matchMarkets: buildMarketFormRows(markets),
      })
    }
  }, [match, markets, reset, teams])

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
      matchMarkets: values.matchMarkets.map((market) => ({
        marketId: market.marketId,
        oddHome: market.oddHome,
        oddAway: market.oddAway,
      })),
    }

    await createMutation.mutateAsync(payload)
    reset({
      ...defaultMatchFormValues,
      matchMarkets: buildMarketFormRows(markets),
    })
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

      {watchedMarkets.map((market, index) => (
        <div key={market.marketId} className="flex w-full flex-col gap-3">
          <Input type="hidden" {...register(`matchMarkets.${index}.marketId`)} />
          <Input type="hidden" {...register(`matchMarkets.${index}.marketName`)} />
          <h6 className="text-xs font-medium text-white">{market.marketName}</h6>
          <div className="flex items-center gap-3">
            <div className="w-full">
              <Input
                type="number"
                step="0.01"
                placeholder="Cuota local"
                {...register(`matchMarkets.${index}.oddHome`)}
              />
              {errors.matchMarkets?.[index]?.oddHome && (
                <p className="pt-1 text-xs text-red-500">{errors.matchMarkets[index]?.oddHome?.message}</p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="number"
                step="0.01"
                placeholder="Cuota visitante"
                {...register(`matchMarkets.${index}.oddAway`)}
              />
              {errors.matchMarkets?.[index]?.oddAway && (
                <p className="pt-1 text-xs text-red-500">{errors.matchMarkets[index]?.oddAway?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}

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
