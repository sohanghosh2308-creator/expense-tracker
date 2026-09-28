export function formatCurrency(amount, currencySymbol = '$') {
  const numericAmount = Number(amount) || 0
  return `${currencySymbol}${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  if (!year || !month || !day) return dateString
  
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getMonthYearKey(dateString) {
  if (!dateString) return ''
  return dateString.slice(0, 7) // Returns YYYY-MM
}

export function formatMonthYear(monthYearString) {
  if (!monthYearString || monthYearString === 'all') return 'All Time'
  const [year, month] = monthYearString.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}
