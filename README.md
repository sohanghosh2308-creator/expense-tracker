# Assignment 8: Expense Tracker Single Page Application (SPA)

A modern, responsive, and feature-complete Expense Tracker SPA built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🎯 Problem Statement Fulfillment

| Feature Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Controlled Components / Forms** | ✅ | Form inputs (`type`, `title`, `amount`, `category`, `date`, `paymentMethod`, `notes`) fully controlled via React state with real-time validation and error feedback. |
| **Add Expense & Income** | ✅ | Dual-mode transaction recorder with curated categories for both expenses and income, and payment method selector. |
| **Delete Expense** | ✅ | Instant deletion with a confirmation modal to avoid accidental loss of records. |
| **Edit Transaction** | ✅ | Edit existing records in place with pre-filled controlled components. |
| **Monthly Summary** | ✅ | Live summary metrics (Net Balance with Surplus/Deficit badges, Total Income, Total Expenses, and Savings Rate %) filtered by month or all-time. |
| **Category Filter & Search** | ✅ | Real-time text search (titles, notes, categories), category dropdown filter, and type toggles (All / Expenses / Income). |
| **Pie Chart for Expenses by Category** | ✅ | Interactive Recharts Donut/Pie Chart with custom tooltips, legend, and percentage breakdown. |
| **Bar Chart for Income vs Expense** | ✅ | Comparative Recharts Bar Chart showing income vs expenses across periods. |
| **Line Chart for Per Day Expenses Trend** | ✅ | Recharts Line Chart plotting daily spending trends and spikes. |
| **Export CSV** | ✅ | Formatted CSV export utility that downloads transaction logs for Excel/Google Sheets. |
| **Persist Data with `localStorage`** | ✅ | Automatic synchronization with browser `localStorage`, with pre-seeded demo data on first launch. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Make sure **Node.js** (v18+) is installed on your computer.

### 2. Open in VS Code
Open the project directory in VS Code:
```bash
code .
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
Expense-Tracker/
├── .vscode/
│   ├── settings.json         # Workspace formatting settings
│   └── extensions.json       # Recommended VS Code plugins
├── public/
├── src/
│   ├── components/
│   │   ├── CategoryIcon.jsx  # Dynamic Lucide icon loader
│   │   ├── ChartsSection.jsx # Pie, Bar, and Line charts (Recharts)
│   │   ├── ConfirmModal.jsx  # Reusable confirmation dialog
│   │   ├── Navbar.jsx        # Navigation, Currency Selector, & actions
│   │   ├── SummaryCards.jsx  # Net Balance, Income, Expense, Savings Rate
│   │   ├── TransactionForm.jsx # Controlled Component Form (Add/Edit)
│   │   ├── TransactionItem.jsx # Single transaction row
│   │   └── TransactionList.jsx # Search, Category/Type filters, & List
│   ├── constants/
│   │   └── categories.js     # Categories, colors, payment methods, currencies
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom hook for localStorage sync
│   ├── utils/
│   │   ├── exportCsv.js      # CSV generator and file downloader
│   │   ├── formatters.js     # Currency and Date formatting
│   │   └── sampleData.js     # Pre-populated realistic demo data
│   ├── App.jsx               # Main state container and layout tabs
│   ├── index.css             # Tailwind CSS & global styles
│   └── main.jsx              # React 19 entry point
├── index.html
├── package.json
└── vite.config.js            # Vite + Tailwind + chunk optimization
```

---

## 🛠️ Built With
- **React 19** - Component architecture with Hooks (`useState`, `useEffect`, `useMemo`)
- **Vite** - High-performance next-generation frontend tooling
- **Tailwind CSS v4** - Clean, responsive UI design
- **Recharts** - SVG charts (Pie, Bar, Line)
- **Lucide React** - Vector iconography
