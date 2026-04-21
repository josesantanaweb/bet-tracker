import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, type Resolver, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'


import { Button, Input, Select } from '@/components/ui'
import { useCreateBet, useMatches } from '@/hooks'
import { BetSelection, type IBet, type ICreateBet, type IMatch } from '@/types'

const newBetSchema = z.object({
  matchId: z.string().min(1, 'Selecciona el partido'),
  marketId: z.string().min(1, 'Selecciona el mercado'),
  selection: z.enum([BetSelection.HOME, BetSelection.AWAY]),
  stake: z.coerce.number().positive('Stake invalido'),
})

type BetFormValues = z.infer<typeof newBetSchema>

const EMPTY_MATCHES: IMatch[] = []

const defaultBetFormValues: BetFormValues = {
  matchId: '',
  marketId: '',
  selection: BetSelection.HOME,
  stake: 10,
}

interface BetFormProps {
  bet?: IBet
  onSuccess?: () => void
}

export const BetForm = ({ bet: _bet, onSuccess }: BetFormProps) => {
  const { data: matches = EMPTY_MATCHES, isLoading: isLoadingMatches } = useMatches()
  const createMutation = useCreateBet()
  const matchOptions = matches.map((match) => ({
    value: match.id,
    label: `${match.home.name} vs ${match.away.name}`,
  }))
  const selectionOptions = [
    { value: BetSelection.HOME, label: 'Local' },
    { value: BetSelection.AWAY, label: 'Visitante' },
  ]

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<BetFormValues>({
    resolver: zodResolver(newBetSchema) as Resolver<BetFormValues>,
    defaultValues: defaultBetFormValues,
  })

  const watchedMatchId = useWatch({ control, name: 'matchId' })
  const watchedMarketId = useWatch({ control, name: 'marketId' })
  const watchedSelection = useWatch({ control, name: 'selection' })
  const watchedStake = useWatch({ control, name: 'stake' })

  const selectedMatch = matches.find((match) => match.id === watchedMatchId)
  const marketOptions = (selectedMatch?.matchMarkets ?? []).map((market) => ({
    value: market.id,
    label: market.name,
  }))
  const selectedMarket = (selectedMatch?.matchMarkets ?? []).find((market) => market.id === watchedMarketId)
  const selectedOdd =
    watchedSelection === BetSelection.HOME
      ? (selectedMarket?.odds.home ?? 0)
      : (selectedMarket?.odds.away ?? 0)
  const projectedPayout = selectedOdd > 0 ? watchedStake * selectedOdd : 0

  useEffect(() => {
    reset(defaultBetFormValues)
  }, [reset])

  useEffect(() => {
    setValue('marketId', '')
  }, [watchedMatchId, setValue])

  const onSubmit = async (values: BetFormValues) => {
    const match = matches.find((item) => item.id === values.matchId)
    if (!match) {
      setError('matchId', { message: 'Partido no encontrado' })
      return
    }

    const market = match.matchMarkets.find((item) => item.id === values.marketId)

    if (!market) {
      setError('marketId', { message: 'Mercado no disponible para el partido seleccionado' })
      return
    }

    const odd = values.selection === BetSelection.HOME ? market.odds.home : market.odds.away
    const payout = values.stake * odd

    const payload: ICreateBet = {
      matchId: values.matchId,
      marketId: values.marketId,
      market: market.name,
      selection: values.selection,
      odd,
      stake: values.stake,
      payout,
    }

    await createMutation.mutateAsync(payload)
    reset(defaultBetFormValues)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
      <div className="w-full">
        <Controller
          control={control}
          name="matchId"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={matchOptions}
              placeholder="Selecciona partido"
              disabled={isLoadingMatches}
            />
          )}
        />
        {errors.matchId && <p className="pt-1 text-xs text-red-500">{errors.matchId.message}</p>}
      </div>
      <div className="w-full">
        <Controller
          control={control}
          name="marketId"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={marketOptions}
              placeholder="Selecciona mercado"
              disabled={!selectedMatch}
            />
          )}
        />
        {errors.marketId && <p className="pt-1 text-xs text-red-500">{errors.marketId.message}</p>}
      </div>

      <div className="flex w-full items-center gap-3">
        <div className="w-full">
          <Controller
            control={control}
            name="selection"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={selectionOptions}
                placeholder="Selecciona pick"
              />
            )}
          />
          {errors.selection && (
            <p className="pt-1 text-xs text-red-500">{errors.selection.message}</p>
          )}
        </div>
        <div className="w-full">
          <div className="relative">
            <span className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
              $
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="Stake"
              className="pl-7"
              {...register('stake')}
            />
          </div>
          {errors.stake && <p className="pt-1 text-xs text-red-500">{errors.stake.message}</p>}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h6 className="text-xs font-medium text-white">Resumen</h6>
        <div className="grid grid-cols-2 items-center gap-3">
          <Input
            value={selectedOdd > 0 ? selectedOdd.toFixed(2) : ''}
            placeholder="Cuota"
            disabled
          />
          <div className="relative">
            <span className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
              $
            </span>
            <Input
              value={projectedPayout > 0 ? projectedPayout.toFixed(2) : ''}
              placeholder="Payout"
              className="pl-7"
              disabled
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Guardando...' : _bet ? 'Guardar cambios' : 'Crear apuesta'}
      </Button>
    </form>
  )
}
