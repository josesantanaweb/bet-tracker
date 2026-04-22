import { format, isValid, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const parseMatchDateSafe = (dateValue: string): Date | null => {
  if (!dateValue) {
    return null
  }

  const normalizedDateValue = dateValue.includes('T') ? dateValue : `${dateValue}T00:00:00`
  const parsedDate = parseISO(normalizedDateValue)

  return isValid(parsedDate) ? parsedDate : null
}

export const parseDateValue = (value: string): Date | null => {
  if (!value) {
    return null
  }

  const parsedDate = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(parsedDate) ? parsedDate : null
}

export const formatDateValue = (value: Date | null): string => {
  if (!value) {
    return ''
  }

  return format(value, 'yyyy-MM-dd')
}

export const formatMatchDate = (dateValue: string): string => {
  const parsedDate = parseMatchDateSafe(dateValue)
  if (!parsedDate) {
    return 'Fecha pendiente'
  }

  return capitalize(format(parsedDate, 'd MMMM', { locale: es }))
}

export const formatMatchTime = (dateValue: string): string => {
  const parsedDate = parseMatchDateSafe(dateValue)
  if (!parsedDate) {
    return '--:--'
  }

  return format(parsedDate, 'hh:mm a').toUpperCase()
}

export const formatMatchDateValue = (dateValue: string): string => {
  const parsedDate = parseMatchDateSafe(dateValue)

  return parsedDate ? formatDateValue(parsedDate) : ''
}

export const formatMatchTimeValue = (dateValue: string): string => {
  const parsedDate = parseMatchDateSafe(dateValue)
  if (!parsedDate) {
    return ''
  }

  return format(parsedDate, 'HH:mm')
}

export const buildMatchDateTimeValue = (dateValue: string, timeValue: string): string => {
  if (!dateValue || !timeValue) {
    return ''
  }

  const normalizedTimeValue = timeValue.length === 5 ? `${timeValue}:00` : timeValue
  const parsedDate = parseISO(`${dateValue}T${normalizedTimeValue}`)

  return isValid(parsedDate) ? parsedDate.toISOString() : ''
}

export const formatAmount = (amount: number) => `$${amount.toFixed(2)}`