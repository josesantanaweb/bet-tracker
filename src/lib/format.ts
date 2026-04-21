export const parseDateValue = (value: string): Date | null => {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatDateValue = (value: Date | null): string => {
  if (!value) {
    return ''
  }

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const parseMatchDate = (dateValue: string): Date | null => {
  if (!dateValue) {
    return null
  }

  const normalizedDateValue = dateValue.includes('T') ? dateValue : `${dateValue}T00:00:00`
  const parsedDate = new Date(normalizedDateValue)

  return Number.isFinite(parsedDate.getTime()) ? parsedDate : null
}

export const formatMatchDate = (dateValue: string): string => {
  const parsedDate = parseMatchDate(dateValue)
  if (!parsedDate) {
    return 'Fecha pendiente'
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
  }).format(parsedDate)
}

export const formatMatchTime = (dateValue: string): string => {
  const parsedDate = parseMatchDate(dateValue)
  if (!parsedDate) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(parsedDate)
    .toUpperCase()
}

export const formatMatchDateValue = (dateValue: string): string => {
  const parsedDate = parseMatchDate(dateValue)

  return parsedDate ? formatDateValue(parsedDate) : ''
}

export const formatMatchTimeValue = (dateValue: string): string => {
  const parsedDate = parseMatchDate(dateValue)
  if (!parsedDate) {
    return ''
  }

  const hours = String(parsedDate.getHours()).padStart(2, '0')
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

export const buildMatchDateTimeValue = (dateValue: string, timeValue: string): string => {
  if (!dateValue || !timeValue) {
    return ''
  }

  const normalizedTimeValue = timeValue.length === 5 ? `${timeValue}:00` : timeValue
  const parsedDate = new Date(`${dateValue}T${normalizedTimeValue}`)

  return Number.isFinite(parsedDate.getTime()) ? parsedDate.toISOString() : ''
}

export const formatAmount = (amount: number) => `$${amount.toFixed(2)}`