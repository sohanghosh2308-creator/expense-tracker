import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  X,
  FileQuestion,
  Download,
  Plus,
} from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import TransactionItem from './TransactionItem'
import { exportTransactionsToCSV } from '../utils/exportCsv'

export default function TransactionList({
  transactions,
  currencySymbol,
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all') // 'all' | 'expense' | 'income'
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  const allCategories = useMemo(
    () => [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES],
    []
  )

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false
        }
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false
        }
        // Search query (title, notes, or category name)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const catMeta = allCategories.find((c) => c.id === item.category)
          const catName = catMeta ? catMeta.name.toLowerCase() : ''
          const matchTitle = item.title.toLowerCase().includes(q)
          const matchNotes = (item.notes || '').toLowerCase().includes(q)
          const matchCat = catName.includes(q)
          if (!matchTitle && !matchNotes && !matchCat) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date)
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date)
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount
        }
        return 0
      })
  }, [transactions, selectedType, selectedCategory, searchQuery, sortBy, allCategories])

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedType !== 'all' || selectedCategory !== 'all'

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedCategory('all')
    setSortBy('date-desc')
  }

  const handleExportFiltered = () => {
    exportTransactionsToCSV(
      filteredTransactions,
      `filtered-transactions-${new Date().toISOString().split('T')[0]}.csv`
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Search and Filters Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Transaction History
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTransactions.length} of {transactions.length} record{transactions.length === 1 ? '' : 's'}
            </p>
          </div>

          {/* Quick type filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedType === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedType === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Search Bar + Category Filter + Sort Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title, notes, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="sm:col-span-4 relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <optgroup label="Expense Categories">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Income Categories">
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-700 cursor-pointer"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-600 bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 py-1.5">
            <span className="flex items-center gap-1.5">
              <Filter size={13} className="text-indigo-600" />
              <span>Filters active ({filteredTransactions.length} results found)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportFiltered}
                className="hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} />
                <span>Export these</span>
              </button>
              <span>•</span>
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List Body */}
      <div className="p-4 sm:p-5">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <FileQuestion size={28} />
            </div>
            <h4 className="text-base font-semibold text-slate-800">
              No transactions found
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              {hasActiveFilters
                ? 'Try adjusting your search criteria or resetting filters to view more records.'
                : 'Get started by adding your first income or expense transaction!'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              ) : (
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add First Transaction</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                currencySymbol={currencySymbol}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
