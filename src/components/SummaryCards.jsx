import { ArrowUpRight, ArrowDownRight, Scale, PiggyBank, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency, formatMonthYear } from '../utils/formatters'

export default function SummaryCards({
  totalIncome,
  totalExpense,
  netBalance,
  savingsRate,
  currencySymbol,
  selectedMonth,
  availableMonths,
  onMonthChange,
  transactionCount,
}) {
  const isSurplus = netBalance >= 0

  const handlePrevMonth = () => {
    const idx = availableMonths.indexOf(selectedMonth)
    if (idx < availableMonths.length - 1) {
      onMonthChange(availableMonths[idx + 1])
    }
  }

  const handleNextMonth = () => {
    const idx = availableMonths.indexOf(selectedMonth)
    if (idx > 0) {
      onMonthChange(availableMonths[idx - 1])
    }
  }

  return (
    <div className="space-y-4">
      {/* Month Filter Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Summary Period: <span className="text-indigo-600">{formatMonthYear(selectedMonth)}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {transactionCount} transaction{transactionCount === 1 ? '' : 's'} recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {selectedMonth !== 'all' && (
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <button
                onClick={handlePrevMonth}
                disabled={availableMonths.indexOf(selectedMonth) >= availableMonths.length - 1}
                className="p-1.5 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Older Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                disabled={availableMonths.indexOf(selectedMonth) <= 0}
                className="p-1.5 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Newer Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-slate-50 text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Time History</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthYear(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Balance
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isSurplus ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Scale size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isSurplus ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {formatCurrency(netBalance, currencySymbol)}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isSurplus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isSurplus ? 'Positive Savings' : 'Overspending'}
              </span>
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
              +{formatCurrency(totalIncome, currencySymbol)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Recorded revenue & earnings</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600">
              -{formatCurrency(totalExpense, currencySymbol)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Total outflows & payments</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Savings Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600">
              {savingsRate}%
            </div>
            <p className="mt-1 text-xs text-slate-500">Of total income preserved</p>
          </div>
        </div>
      </div>
    </div>
  )
}
