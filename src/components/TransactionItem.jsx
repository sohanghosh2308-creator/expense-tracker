import { Trash2, Edit2, CreditCard } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { formatCurrency, formatDate } from '../utils/formatters'
import CategoryIcon from './CategoryIcon'

export default function TransactionItem({
  transaction,
  currencySymbol,
  onEdit,
  onDelete,
}) {
  const isIncome = transaction.type === 'income'
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
  const categoryMeta = allCategories.find((c) => c.id === transaction.category) || {
    name: transaction.category,
    color: '#64748b',
    icon: 'MoreHorizontal',
  }

  return (
    <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Icon with category color */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
          style={{ backgroundColor: categoryMeta.color }}
        >
          <CategoryIcon iconName={categoryMeta.icon} size={20} />
        </div>

        {/* Transaction details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-800 truncate" title={transaction.title}>
              {transaction.title}
            </h4>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${categoryMeta.color}15`,
                color: categoryMeta.color,
              }}
            >
              {categoryMeta.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
            <span>{formatDate(transaction.date)}</span>
            {transaction.paymentMethod && (
              <span className="flex items-center gap-1 text-slate-400">
                <CreditCard size={12} />
                <span>{transaction.paymentMethod}</span>
              </span>
            )}
            {transaction.notes && (
              <span className="text-slate-400 italic truncate max-w-[200px]" title={transaction.notes}>
                "{transaction.notes}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <div className="text-right">
          <div
            className={`text-sm sm:text-base font-bold tracking-tight ${
              isIncome ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, currencySymbol)}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {transaction.type}
          </span>
        </div>

        {/* Hover / persistent action buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Transaction"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Transaction"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
