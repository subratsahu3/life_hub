import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Transaction, FinanceSummary } from '../types';

interface FinanceViewProps {
  transactions: Transaction[];
  summary: FinanceSummary | null;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: number) => void;
  onSetBudget: (category: string, limit: number) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  summary,
  onAddTransaction,
  onDeleteTransaction,
  onSetBudget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  // New Transaction Form
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txCategory, setTxCategory] = useState('Groceries');
  const [txAmount, setTxAmount] = useState(45);
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Budget Adjust Form
  const [budgetCategory, setBudgetCategory] = useState('Groceries');
  const [budgetLimit, setBudgetLimit] = useState(500);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmount <= 0) return;
    onAddTransaction({
      type: txType,
      category: txCategory,
      amount: txAmount,
      description: txDescription.trim(),
      date: txDate,
    });
    setTxDescription('');
    setIsModalOpen(false);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetLimit <= 0) return;
    onSetBudget(budgetCategory, budgetLimit);
    setIsBudgetModalOpen(false);
  };

  const filteredTx = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Financial Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Monthly Inflow
            </span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              ${summary?.total_income.toLocaleString() || '0'}
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Total Expenses
            </span>
            <div className="text-2xl font-black text-rose-300 font-mono mt-0.5">
              ${summary?.total_expense.toLocaleString() || '0'}
            </div>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Net Savings
            </span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              ${summary?.net_savings.toLocaleString() || '0'}
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Savings Rate
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {summary?.savings_rate_percent || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Limits & Categories */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>Category Spending vs. Monthly Caps</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time thresholds with proactive alerts before overspending occurs.
            </p>
          </div>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <span>Adjust Monthly Caps</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary?.categories.map((cat) => {
            const isExceeded = cat.status === 'exceeded';
            const isWarning = cat.status === 'warning';

            return (
              <div
                key={cat.category}
                className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{cat.category}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      isExceeded
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {isExceeded ? 'Exceeded' : isWarning ? 'Warning 85%+' : 'Within Cap'}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>${cat.spent} spent</span>
                  <span>Limit: ${cat.monthly_limit}</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-indigo-400" />
              <span>Financial Ledger & Cashflow</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Audit line-items, track income deposits, and log discretionary costs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs space-x-1">
              {(['all', 'expense', 'income'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    filterType === filter
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredTx.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">
                      {tx.description || tx.category}
                    </h5>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm font-mono font-bold ${
                      isIncome ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Transaction</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Flow Type</label>
                  <select
                    value={txType}
                    onChange={(e: any) => setTxType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Health">Health</option>
                    <option value="Dining">Dining</option>
                    <option value="Transport">Transport</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Salary">Salary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min={0.01}
                  value={txAmount}
                  onChange={(e) => setTxAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="e.g. Weekly farmer's market haul"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Adjust Category Cap</h3>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Housing">Housing</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Health">Health</option>
                  <option value="Dining">Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Leisure">Leisure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Save Cap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
