import { useState, useMemo } from 'react'
import Navbar from './components/Navbar'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ChartsSection from './components/ChartsSection'
import ConfirmModal from './components/ConfirmModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { INITIAL_TRANSACTIONS } from './utils/sampleData'
import { CURRENCIES } from './constants/categories'
import { exportTransactionsToCSV } from './utils/exportCsv'
import { LayoutDashboard, PieChart as ChartIcon, CheckCircle2 } from 'lucide-react'

export default function App() {
  // Persistent transactions & settings
  const [transactions, setTransactions] = useLocalStorage(
    'expense_tracker_transactions_v2',
    INITIAL_TRANSACTIONS
  )
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(
    'expense_tracker_currency',
    CURRENCIES[0]
  )

  // View state
  const [viewTab, setViewTab] = useState('all') // 'all' | 'transactions' | 'charts'
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    confirmVariant: 'danger',
    onConfirm: () => {},
  })

  // Show temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3000)
  }

  // Derive unique months from transactions (format YYYY-MM), newest first
  const availableMonths = useMemo(() => {
    const monthsSet = new Set()
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.slice(0, 7))
      }
    })
    return Array.from(monthsSet).sort().reverse()
  }, [transactions])

  // Current selected month filter
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to the first available month if present, else 'all'
    const monthsSet = new Set()
    INITIAL_TRANSACTIONS.forEach((t) => {
      if (t.date) monthsSet.add(t.date.slice(0, 7))
    })
    const sorted = Array.from(monthsSet).sort().reverse()
    return sorted[0] || 'all'
  })

  // Filtered transactions for active monthly summary
  const currentPeriodTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions
    return transactions.filter((t) => t.date.startsWith(selectedMonth))
  }, [transactions, selectedMonth])

  // Financial Metrics Calculations
  const { totalIncome, totalExpense, netBalance, savingsRate } = useMemo(() => {
    let income = 0
    let expense = 0

    currentPeriodTransactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount
      } else {
        expense += t.amount
      }
    })

    const balance = income - expense
    const savings = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: balance,
      savingsRate: savings,
    }
  }, [currentPeriodTransactions])

  // Handlers
  const handleOpenAdd = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionData.id ? transactionData : t))
      )
      triggerToast('Transaction updated successfully!')
    } else {
      setTransactions((prev) => [transactionData, ...prev])
      triggerToast('New transaction added successfully!')
    }
  }

  const handleDeletePrompt = (transaction) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to delete "${transaction.title}" (${selectedCurrency.symbol}${transaction.amount})? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmVariant: 'danger',
      onConfirm: () => {
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id))
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast('Transaction deleted.')
      },
    })
  }

  const handleResetDemoDataPrompt = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset to Sample Data',
      message:
        'This will replace your current transactions with rich sample demonstration data. Continue?',
      confirmText: 'Reset Data',
      confirmVariant: 'primary',
      onConfirm: () => {
        setTransactions(INITIAL_TRANSACTIONS)
        setSelectedMonth('all')
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast('Demo data restored!')
      },
    })
  }

  const handleClearAllPrompt = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear All Transactions',
      message:
        'Are you sure you want to permanently clear all transaction records? This action cannot be reversed.',
      confirmText: 'Clear All',
      confirmVariant: 'danger',
      onConfirm: () => {
        setTransactions([])
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast('All transactions cleared.')
      },
    })
  }

  const handleExportCSV = () => {
    exportTransactionsToCSV(
      transactions,
      `all-transactions-${new Date().toISOString().split('T')[0]}.csv`
    )
    triggerToast('Transactions exported to CSV!')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenAddModal={handleOpenAdd}
        onExportCSV={handleExportCSV}
        onResetDemoData={handleResetDemoDataPrompt}
        onClearAllData={handleClearAllPrompt}
        transactionCount={transactions.length}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Monthly Summary Section */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          netBalance={netBalance}
          savingsRate={savingsRate}
          currencySymbol={selectedCurrency.symbol}
          selectedMonth={selectedMonth}
          availableMonths={availableMonths}
          onMonthChange={setSelectedMonth}
          transactionCount={currentPeriodTransactions.length}
        />

        {/* View Switcher Tabs (All Overview / Transactions / Visual Charts) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('all')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                viewTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Full Overview</span>
            </button>

            <button
              onClick={() => setViewTab('charts')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                viewTab === 'charts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ChartIcon size={16} />
              <span>Charts & Analytics</span>
            </button>

            <button
              onClick={() => setViewTab('transactions')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                viewTab === 'transactions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Transactions ({transactions.length})</span>
            </button>
          </div>
        </div>

        {/* Content Views */}
        {viewTab === 'all' && (
          <div className="space-y-6">
            {/* Charts Section */}
            <ChartsSection
              transactions={transactions}
              selectedMonth={selectedMonth}
              currencySymbol={selectedCurrency.symbol}
            />

            {/* Transactions Section */}
            <TransactionList
              transactions={transactions}
              currencySymbol={selectedCurrency.symbol}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
              onOpenAddModal={handleOpenAdd}
            />
          </div>
        )}

        {viewTab === 'charts' && (
          <div className="space-y-6">
            <ChartsSection
              transactions={transactions}
              selectedMonth={selectedMonth}
              currencySymbol={selectedCurrency.symbol}
            />
          </div>
        )}

        {viewTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionList
              transactions={transactions}
              currencySymbol={selectedCurrency.symbol}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
              onOpenAddModal={handleOpenAdd}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Assignment 8: Expense Tracker SPA &bull; React &bull; Controlled Components &bull; Charts &bull; localStorage
          </p>
          <p className="text-slate-400">
            Saved on Desktop &bull; VS Code Ready
          </p>
        </div>
      </footer>

      {/* Add / Edit Transaction Modal Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveTransaction}
        editingTransaction={editingTransaction}
        currencySymbol={selectedCurrency.symbol}
      />

      {/* Reusable Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
