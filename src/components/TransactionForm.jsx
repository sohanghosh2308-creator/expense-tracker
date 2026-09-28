import { useState } from 'react'
import { X, Check, Sparkles } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants/categories'

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction = null,
  currencySymbol = '$',
}) {
  if (!isOpen) return null

  return (
    <TransactionFormModal
      onClose={onClose}
      onSubmit={onSubmit}
      editingTransaction={editingTransaction}
      currencySymbol={currencySymbol}
      key={editingTransaction ? editingTransaction.id : 'new-transaction'}
    />
  )
}

function TransactionFormModal({
  onClose,
  onSubmit,
  editingTransaction,
  currencySymbol,
}) {
  const [type, setType] = useState(editingTransaction?.type || 'expense')
  const [title, setTitle] = useState(editingTransaction?.title || '')
  const [amount, setAmount] = useState(editingTransaction?.amount ? String(editingTransaction.amount) : '')
  const [category, setCategory] = useState(
    editingTransaction?.category ||
      (editingTransaction?.type === 'income' ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id)
  )
  const [date, setDate] = useState(
    () => editingTransaction?.date || new Date().toISOString().split('T')[0]
  )
  const [paymentMethod, setPaymentMethod] = useState(
    editingTransaction?.paymentMethod || PAYMENT_METHODS[0]
  )
  const [notes, setNotes] = useState(editingTransaction?.notes || '')
  const [errors, setErrors] = useState({})

  // Adjust default category when type toggles
  const handleTypeChange = (newType) => {
    setType(newType)
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].id)
    } else {
      setCategory(EXPENSE_CATEGORIES[0].id)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title or description is required'
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
    }

    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0'
    }

    if (!date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const transactionData = {
      id: editingTransaction ? editingTransaction.id : `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title: title.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category,
      date,
      paymentMethod,
      notes: notes.trim(),
    }

    onSubmit(transactionData)
    onClose()
  }

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h2 id="form-dialog-title" className="text-base font-semibold text-slate-800">
              {editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body - Controlled Components */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type Toggle (Expense / Income) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>Expense (-)</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>Income (+)</span>
              </button>
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label htmlFor="tx-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Title / Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="tx-title"
                type="text"
                placeholder={type === 'expense' ? 'e.g. Grocery store, Netflix, Uber ride' : 'e.g. Monthly salary, Freelance design'}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Amount & Date in a 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label htmlFor="tx-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Amount ({currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                  {currencySymbol}
                </div>
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }))
                  }}
                  className={`w-full rounded-xl border pl-8 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 ${
                    errors.amount
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="tx-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }))
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 ${
                    errors.date
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="tx-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  id="tx-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="tx-payment" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Payment Method
              </label>
              <select
                id="tx-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label htmlFor="tx-notes" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              id="tx-notes"
              rows={2}
              placeholder="Add extra context or remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100 flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>{editingTransaction ? 'Save Changes' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
