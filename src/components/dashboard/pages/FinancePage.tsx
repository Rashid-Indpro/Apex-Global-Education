import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  FileText, 
  Receipt, 
  Trash2, 
  Search, 
  RefreshCw, 
  Filter, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  X,
  CreditCard,
  Building,
  Lock
} from 'lucide-react';

export type CurrencyCode = 'UGX' | 'USD' | 'KES' | 'GBP' | 'EUR';
export type TransactionType = 'Income' | 'Expense';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  applicantName?: string;
  applicantId?: string;
  receiptNo?: string;
  paymentMethod?: string;
  category?: string;
  recordedBy: string;
  createdAt: string;
}

interface CurrencyBalance {
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
  count: number;
}

export const FinancePage: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [summary, setSummary] = useState<Record<CurrencyCode, CurrencyBalance>>({
    UGX: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    USD: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    KES: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    GBP: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    EUR: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [filterCurrency, setFilterCurrency] = useState<'All' | CurrencyCode>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrencyTab, setSelectedCurrencyTab] = useState<CurrencyCode>('GBP');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptView, setActiveReceiptView] = useState<FinanceTransaction | null>(null);

  // Add Expense form state
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCurrency, setExpCurrency] = useState<CurrencyCode>('GBP');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expCategory, setExpCategory] = useState('Office & Utilities');
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Generate Receipt form state
  const [recApplicantName, setRecApplicantName] = useState('');
  const [recApplicantId, setRecApplicantId] = useState('');
  const [recAmount, setRecAmount] = useState('');
  const [recCurrency, setRecCurrency] = useState<CurrencyCode>('GBP');
  const [recDescription, setRecDescription] = useState('');
  const [recDate, setRecDate] = useState(new Date().toISOString().split('T')[0]);
  const [recPaymentMethod, setRecPaymentMethod] = useState('Bank Wire Transfer');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  // Fetch summary & transactions
  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [sumRes, txRes] = await Promise.all([
        fetch('/api/finance/summary', { headers }),
        fetch('/api/finance/transactions', { headers }),
      ]);

      const sumJson = await sumRes.json();
      const txJson = await txRes.json();

      if (sumRes.ok && sumJson.success) {
        setSummary(sumJson.summary);
      }
      if (txRes.ok && txJson.success) {
        setTransactions(txJson.data);
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not fetch fiscal ledger records from server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [token]);

  // Handle Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expAmount);
    if (!expDescription.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a valid description and a positive expense amount.',
      });
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const res = await fetch('/api/finance/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          description: expDescription.trim(),
          amount: parsedAmount,
          currency: expCurrency,
          date: expDate,
          category: expCategory,
        }),
      });

      const json = await res.json();
      setIsSubmittingExpense(false);

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Expense Recorded',
          message: `Logged ${formatCurrency(parsedAmount, expCurrency)} for "${expDescription}".`,
        });
        setIsExpenseModalOpen(false);
        setExpDescription('');
        setExpAmount('');
        fetchFinanceData();
      } else {
        showToast({
          type: 'error',
          title: 'Failed to Save Expense',
          message: json.error || 'Server rejected expense record.',
        });
      }
    } catch {
      setIsSubmittingExpense(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to fiscal ledger server.',
      });
    }
  };

  // Handle Generate Receipt
  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(recAmount);
    if (!recApplicantName.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !recDescription.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Applicant name, valid amount, and description are required.',
      });
      return;
    }

    setIsSubmittingReceipt(true);
    try {
      const res = await fetch('/api/finance/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          applicantName: recApplicantName.trim(),
          applicantId: recApplicantId.trim() || undefined,
          amount: parsedAmount,
          currency: recCurrency,
          description: recDescription.trim(),
          date: recDate,
          paymentMethod: recPaymentMethod,
          category: 'Tuition & Application Escrow',
        }),
      });

      const json = await res.json();
      setIsSubmittingReceipt(false);

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Receipt Generated',
          message: `Official fiscal receipt ${json.receiptNo} created.`,
        });
        setIsReceiptModalOpen(false);
        setActiveReceiptView(json.data);
        setRecApplicantName('');
        setRecApplicantId('');
        setRecAmount('');
        setRecDescription('');
        fetchFinanceData();
      } else {
        showToast({
          type: 'error',
          title: 'Receipt Generation Failed',
          message: json.error || 'Server rejected receipt record.',
        });
      }
    } catch {
      setIsSubmittingReceipt(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to fiscal ledger server.',
      });
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string, desc: string) => {
    if (!window.confirm(`Are you sure you want to remove "${desc}" from the fiscal ledger?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/finance/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Transaction Removed',
          message: 'The record has been pruned from the audit trail.',
        });
        fetchFinanceData();
      } else {
        showToast({
          type: 'error',
          title: 'Deletion Failed',
          message: json.error || 'Could not delete transaction.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to fiscal ledger server.',
      });
    }
  };

  // Helper currency formatter
  const formatCurrency = (val: number, curr: CurrencyCode) => {
    const symbolMap: Record<CurrencyCode, string> = {
      GBP: '£',
      USD: '$',
      EUR: '€',
      UGX: 'UGX ',
      KES: 'KES ',
    };
    return `${symbolMap[curr]}${val.toLocaleString(undefined, {
      minimumFractionDigits: curr === 'UGX' || curr === 'KES' ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'All' || tx.type === filterType;
    const matchesCurrency = filterCurrency === 'All' || tx.currency === filterCurrency;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      tx.description.toLowerCase().includes(q) ||
      (tx.applicantName && tx.applicantName.toLowerCase().includes(q)) ||
      (tx.receiptNo && tx.receiptNo.toLowerCase().includes(q)) ||
      (tx.category && tx.category.toLowerCase().includes(q));

    return matchesType && matchesCurrency && matchesSearch;
  });

  const currenciesList: CurrencyCode[] = ['UGX', 'USD', 'KES', 'GBP', 'EUR'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Executive Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Super Admin Restricted · Financial Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Financial Ledger & Escrow Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time multi-currency income, expense logging, official receipts, and net fiscal liquidity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFinanceData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpenseModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-rose-600" />}
          >
            Add Expense
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReceiptModalOpen(true)}
            leftIcon={<Receipt className="w-4 h-4" />}
          >
            Generate Receipt
          </Button>
        </div>
      </div>

      {/* ================= 1. NET POSITION SUMMARY (Grouped by Currency) ================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Net Liquidity & Position by Currency
            </h2>
            <p className="text-xs text-slate-500">
              Calculates Net Position (Gross Income minus Operating Expenses) across all operational jurisdictions.
            </p>
          </div>

          {/* Currency Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto overflow-x-auto">
            {currenciesList.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCurrencyTab(c)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedCurrencyTab === c
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Highlighted Net Position Card for Active Tab */}
        {(() => {
          const activeBal = summary[selectedCurrencyTab] || {
            totalIncome: 0,
            totalExpenses: 0,
            netPosition: 0,
            count: 0,
          };
          const isPositive = activeBal.netPosition >= 0;

          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
              
              {/* Net Position */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Net Position ({selectedCurrencyTab})
                </span>
                <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight flex items-baseline gap-1.5 ${
                  isPositive ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-rose-600 shrink-0 self-center" />
                  )}
                  <span>{formatCurrency(activeBal.netPosition, selectedCurrencyTab)}</span>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Total Income minus Disbursed Expenses
                </span>
              </div>

              {/* Total Income */}
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Total Realized Income</span>
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                  {formatCurrency(activeBal.totalIncome, selectedCurrencyTab)}
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Candidate retainers, escrow & consultation fees
                </span>
              </div>

              {/* Total Expenses */}
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                  <span>Total Operating Expenses</span>
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                  {formatCurrency(activeBal.totalExpenses, selectedCurrencyTab)}
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Accreditation, office overhead & software
                </span>
              </div>

            </div>
          );
        })()}

        {/* Currency Quick Matrix (All 5 Currencies at a Glance) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {currenciesList.map((curr) => {
            const bal = summary[curr] || { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 };
            const isPos = bal.netPosition >= 0;
            return (
              <div
                key={curr}
                onClick={() => setSelectedCurrencyTab(curr)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                  selectedCurrencyTab === curr
                    ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                  <span>{curr}</span>
                  <span className="text-[10px] font-mono font-normal">{bal.count} tx</span>
                </div>
                <div className={`mt-1 font-mono font-bold text-sm ${isPos ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatCurrency(bal.netPosition, curr)}
                </div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">
                  +{formatCurrency(bal.totalIncome, curr)} / -{formatCurrency(bal.totalExpenses, curr)}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ================= 2. TRANSACTION LEDGER & AUDIT TRAIL ================= */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
        
        {/* Table Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by description, applicant, receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Type selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-md">
              {(['All', 'Income', 'Expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    filterType === t
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Currency Filter Dropdown */}
            <select
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-700"
            >
              <option value="All">All Currencies</option>
              {currenciesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Description / Applicant</th>
                <th className="py-3 px-3">Category / Method</th>
                <th className="py-3 px-3">Receipt / Ref</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-600" />
                    <span>Loading fiscal ledger records...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600">No financial transactions match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Use &quot;Add Expense&quot; or &quot;Generate Receipt&quot; to log entries.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        {tx.date}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isIncome 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{tx.type}</span>
                        </span>
                      </td>

                      {/* Description & Applicant */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">
                          {tx.description}
                        </div>
                        {tx.applicantName && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>Applicant: {tx.applicantName}</span>
                            {tx.applicantId && (
                              <span className="font-mono text-sky-800">({tx.applicantId})</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Category & Payment Method */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        <div>{tx.category || 'General'}</div>
                        {tx.paymentMethod && (
                          <div className="text-[10px] text-slate-400 font-mono">{tx.paymentMethod}</div>
                        )}
                      </td>

                      {/* Receipt / Reference */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {tx.receiptNo ? (
                          <button
                            type="button"
                            onClick={() => setActiveReceiptView(tx)}
                            className="font-mono text-sky-700 hover:text-sky-950 hover:underline font-bold text-[11px] cursor-pointer"
                            title="Click to view and print official receipt"
                          >
                            {tx.receiptNo}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Internal</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className={`py-3 px-3 text-right font-mono font-bold text-sm whitespace-nowrap ${
                        isIncome ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isIncome && tx.receiptNo && (
                            <button
                              type="button"
                              onClick={() => setActiveReceiptView(tx)}
                              className="p-1 text-slate-500 hover:text-sky-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTransaction(tx.id, tx.description)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= MODAL 1: ADD EXPENSE ================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Operating Expense</h3>
                  <p className="text-[11px] text-slate-500">Record operational overhead and disbursements</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Expense Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. British Council Global Licensing Fee"
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 1250"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={expCurrency}
                    onChange={(e) => setExpCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    {currenciesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    <option value="Office & Utilities">Office & Utilities</option>
                    <option value="Immigration & Accreditation">Immigration & Accreditation</option>
                    <option value="IT & Infrastructure">IT & Infrastructure</option>
                    <option value="Travel & Conferences">Travel & Conferences</option>
                    <option value="Marketing & Outreach">Marketing & Outreach</option>
                    <option value="Legal & Audit">Legal & Audit</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpenseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingExpense}
                >
                  Save Expense
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: GENERATE RECEIPT ================= */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Generate Official Income Receipt</h3>
                  <p className="text-[11px] text-slate-500">Issues candidate receipt and records revenue</p>
                </div>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReceipt} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Applicant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={recApplicantName}
                    onChange={(e) => setRecApplicantName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Applicant ID / File No (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. APX-2026-8941"
                    value={recApplicantId}
                    onChange={(e) => setRecApplicantId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 3200"
                    value={recAmount}
                    onChange={(e) => setRecAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={recCurrency}
                    onChange={(e) => setRecCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    {currenciesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  For / Purpose Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAS Lodgment Retainer & Visa Legal Representation"
                  value={recDescription}
                  onChange={(e) => setRecDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Payment Method</label>
                  <select
                    value={recPaymentMethod}
                    onChange={(e) => setRecPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                    <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
                    <option value="M-Pesa Express">M-Pesa Express</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="SEPA Direct Wire">SEPA Direct Wire</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReceiptModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingReceipt}
                  leftIcon={<Receipt className="w-3.5 h-3.5" />}
                >
                  Generate & Issue Receipt
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: OFFICIAL PRINTABLE RECEIPT CARD ================= */}
      {activeReceiptView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-sky-400" />
                <span>Official Fiscal Receipt Document</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setActiveReceiptView(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Printable Paper Body */}
            <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 bg-white" id="printable-receipt">
              
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    APEX GLOBAL EDUCATION ADVISORY
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Accredited International Education Advisory & Escrow
                  </p>
                  <p className="text-[10px] text-slate-400">
                    London · Toronto · Melbourne · Dhaka HQ
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Receipt Number
                  </span>
                  <span className="text-sm font-bold font-mono text-sky-900 block">
                    {activeReceiptView.receiptNo}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Date: {activeReceiptView.date}
                  </span>
                </div>
              </div>

              {/* Client & Payment Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Received From (Student)
                  </span>
                  <span className="font-bold text-slate-900 block text-sm">
                    {activeReceiptView.applicantName}
                  </span>
                  {activeReceiptView.applicantId && (
                    <span className="text-[10px] text-slate-500 font-mono block">
                      File ID: {activeReceiptView.applicantId}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Payment Method
                  </span>
                  <span className="font-medium text-slate-900 block">
                    {activeReceiptView.paymentMethod || 'Bank Wire'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Realized into Ledger
                  </span>
                </div>
              </div>

              {/* Purpose & Amount Row */}
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex justify-between font-bold text-slate-700 pb-1 border-b border-slate-100 text-[11px] uppercase">
                  <span>Description / Purpose</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-800 pr-4">{activeReceiptView.description}</span>
                  <span className="font-mono font-bold text-base text-slate-900 shrink-0">
                    {formatCurrency(activeReceiptView.amount, activeReceiptView.currency)}
                  </span>
                </div>
              </div>

              {/* Total Balance Card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Total Amount Paid ({activeReceiptView.currency})
                </span>
                <span className="text-lg font-bold font-mono text-emerald-900">
                  {formatCurrency(activeReceiptView.amount, activeReceiptView.currency)}
                </span>
              </div>

              {/* Security Seal & Authorized Sign-off */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                <div>
                  <span className="block font-semibold text-slate-600">Authorized Governance:</span>
                  <span>{activeReceiptView.recordedBy}</span>
                </div>
                <div className="text-right font-mono">
                  <span>AUTHENTICATED FISCAL SEAL</span>
                  <span className="block text-emerald-700 font-bold">VERIFIED & ARCHIVED</span>
                </div>
              </div>

            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveReceiptView(null)}
              >
                Close Receipt View
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
