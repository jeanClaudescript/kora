export function formatRwf(n: number): string {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (m === 0) return `${h} hr`
    return `${h} hr ${m} min`
  }
  return `${min} min`
}
