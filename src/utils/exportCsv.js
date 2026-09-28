import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'

export function exportTransactionsToCSV(transactions, filename = 'expense-tracker-export.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export.')
    return
  }

  const categoryMap = {}
  ;[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].forEach((cat) => {
    categoryMap[cat.id] = cat.name
  })

  const headers = ['ID', 'Date', 'Type', 'Category', 'Title / Description', 'Amount', 'Payment Method', 'Notes']

  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type.toUpperCase(),
    categoryMap[t.category] || t.category,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
