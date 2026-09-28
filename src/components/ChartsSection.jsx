import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PieChart as PieIcon, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../constants/categories'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function ChartsSection({
  transactions,
  selectedMonth,
  currencySymbol = '$',
}) {
  // Filter transactions based on selectedMonth ('all' or 'YYYY-MM')
  const periodTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions
    return transactions.filter((t) => t.date.startsWith(selectedMonth))
  }, [transactions, selectedMonth])

  // 1. Data for Pie Chart: Expenses by Category
  const pieData = useMemo(() => {
    const expenses = periodTransactions.filter((t) => t.type === 'expense')
    const categoryTotals = {}

    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

    const totalExpenseAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)

    const data = Object.keys(categoryTotals).map((catId) => {
      const meta = EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
        name: catId,
        color: '#94a3b8',
      }
      const value = categoryTotals[catId]
      const percentage = totalExpenseAmount > 0 ? ((value / totalExpenseAmount) * 100).toFixed(1) : 0

      return {
        name: meta.name,
        value: Number(value.toFixed(2)),
        color: meta.color,
        percentage: Number(percentage),
      }
    })

    return data.sort((a, b) => b.value - a.value)
  }, [periodTransactions])

  // 2. Data for Bar Chart: Income vs Expense Comparison
  // If selectedMonth is 'all', show by month (e.g., '2026-08', '2026-09')
  // If selectedMonth is a specific month, show week-by-week or overall comparison
  const barData = useMemo(() => {
    if (selectedMonth === 'all') {
      const monthsMap = {}
      transactions.forEach((t) => {
        const m = t.date.slice(0, 7)
        if (!monthsMap[m]) {
          monthsMap[m] = { month: m, Income: 0, Expense: 0 }
        }
        if (t.type === 'income') {
          monthsMap[m].Income += t.amount
        } else {
          monthsMap[m].Expense += t.amount
        }
      })

      return Object.keys(monthsMap)
        .sort()
        .map((m) => {
          const [year, month] = m.split('-')
          const dateObj = new Date(Number(year), Number(month) - 1, 1)
          const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          return {
            period: label,
            Income: Number(monthsMap[m].Income.toFixed(2)),
            Expense: Number(monthsMap[m].Expense.toFixed(2)),
          }
        })
    } else {
      // Breakdown by 4 weeks for the chosen month
      const weeks = [
        { period: 'Days 1-7', Income: 0, Expense: 0 },
        { period: 'Days 8-14', Income: 0, Expense: 0 },
        { period: 'Days 15-21', Income: 0, Expense: 0 },
        { period: 'Days 22+', Income: 0, Expense: 0 },
      ]

      periodTransactions.forEach((t) => {
        const day = parseInt(t.date.split('-')[2], 10)
        let weekIndex = 3
        if (day <= 7) weekIndex = 0
        else if (day <= 14) weekIndex = 1
        else if (day <= 21) weekIndex = 2

        if (t.type === 'income') {
          weeks[weekIndex].Income += t.amount
        } else {
          weeks[weekIndex].Expense += t.amount
        }
      })

      return weeks.map((w) => ({
        ...w,
        Income: Number(w.Income.toFixed(2)),
        Expense: Number(w.Expense.toFixed(2)),
      }))
    }
  }, [transactions, periodTransactions, selectedMonth])

  // 3. Data for Line Chart: Per Day Expenses Trend
  const lineData = useMemo(() => {
    const expenses = periodTransactions.filter((t) => t.type === 'expense')
    const dailyMap = {}

    expenses.forEach((t) => {
      dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount
    })

    return Object.keys(dailyMap)
      .sort()
      .map((date) => {
        const [, month, day] = date.split('-')
        return {
          fullDate: date,
          dateLabel: `${month}/${day}`,
          amount: Number(dailyMap[date].toFixed(2)),
        }
      })
  }, [periodTransactions])

  return (
    <div className="space-y-6">
      {/* Top Section: Pie Chart & Bar Chart in 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Pie Chart: Expenses by Category */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <PieIcon size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Expenses by Category
                </h3>
                <p className="text-xs text-slate-500">Distribution of spending across categories</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-rose-50 text-rose-700">
              Pie Chart
            </span>
          </div>

          {pieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No expenses recorded for this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value, name) => [
                        `${formatCurrency(value, currencySymbol)}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {pieData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-slate-700 font-medium" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 shrink-0 ml-1">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Bar Chart: Income vs Expense */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Income vs Expense
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMonth === 'all'
                    ? 'Monthly financial comparison'
                    : 'Weekly breakdown for selected month'}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-50 text-indigo-700">
              Bar Chart
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val}`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${formatCurrency(value, currencySymbol)}`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                  formatter={(val) => <span className="text-slate-700 font-semibold">{val}</span>}
                />
                <Bar
                  dataKey="Income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Expense"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Line Chart: Per Day Expenses Trend */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Per Day Expenses Trend
              </h3>
              <p className="text-xs text-slate-500">
                Daily expenditure trajectory over time
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-violet-50 text-violet-700">
            Line Chart
          </span>
        </div>

        {lineData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No daily expense data available to plot trend</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${formatCurrency(value, currencySymbol)}`,
                    'Spent on this day',
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0 && payload[0].payload.fullDate) {
                      return formatDate(payload[0].payload.fullDate)
                    }
                    return label
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Daily Expense"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#6d28d9', stroke: '#ede9fe', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
