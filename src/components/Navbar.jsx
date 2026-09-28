import { Wallet, Plus, Download, RotateCcw, Trash2 } from 'lucide-react'
import { CURRENCIES } from '../constants/categories'

export default function Navbar({
  selectedCurrency,
  onCurrencyChange,
  onOpenAddModal,
  onExportCSV,
  onResetDemoData,
  onClearAllData,
  transactionCount,
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Wallet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Expense<span className="text-indigo-600">Tracker</span>
                </span>
                <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SPA
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Assignment 8: Controlled Components, Charts & Storage
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value)
                if (found) onCurrencyChange(found)
              }}
              className="text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2.5 py-2 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              title="Select Display Currency"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              disabled={transactionCount === 0}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
              title="Export all transactions to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={onResetDemoData}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
              title="Reset to Sample Demo Data"
            >
              <RotateCcw size={17} />
            </button>

            {/* Clear All Data */}
            <button
              onClick={onClearAllData}
              disabled={transactionCount === 0}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 disabled:opacity-30 disabled:pointer-events-none"
              title="Clear All Transactions"
            >
              <Trash2 size={17} />
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
