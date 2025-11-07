export function parseTimerInput(str: string): number | null {
  const regex = /^(?:(?<hours>\d{1,2})?h)?(?<minutes>\d{0,2})$/
  const match = regex.exec(str.replace(/\s+/g, ''))

  if (match?.groups) {
    const { hours, minutes } = match.groups
    const elapsedTimeInMs = Number(hours || 0) * 60 * 60 * 1000 + Number(minutes || 0) * 60 * 1000

    return elapsedTimeInMs
  }

  return null
}

export function computeElapsedTime(fromMs: number, toMs: number, addMinutePadding = true): string {
  const elapsedMs = toMs - fromMs
  const totalMinutes = Math.floor(elapsedMs / (60 * 1000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours < 0 || minutes < 0) {
    return '0'
  }

  return hours
    ? `${hours}h${
        minutes ? (addMinutePadding ? minutes.toString().padStart(2, '0') : minutes) : ''
      }`
    : `${minutes}`
}
