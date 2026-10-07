import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { AccountIcon } from '../common/AccountIcon';
import { 
  predictCategoryFromText, 
  detectDuplicateExpense,
  parseMoneyInput,
  validateTransfer,
  getLocalDateString,
  getLocalTimeString,
  formatCurrency,
  normalizeArabicNumerals,
  safeEvalMath
} from '../../utils/calculations';
import { getCategoryDisplayName, getAccountDisplayName } from '../../utils/i18n';
import { triggerHaptic } from '../../utils/haptics';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useBackHandler } from '../../hooks/useBackHandler';
import { 
  X, 
  ArrowLeft,
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Calendar, 
  Clock, 
  ArrowRightLeft,
  ArrowRight,
  Calculator,
  Trash2,
  Building2,
  Delete,
  Wallet,
  Tag,
  PenLine,
  Plus
} from 'lucide-react';
import { StyledIconSelector } from '../common/StyledIconSelector';
import { Expense } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editExpense?: Expense | null;
}

// Quick suggested tags for super fast 1-tap note logging
const QUICK_EXPENSE_TAGS = ['طعام وغداء', 'سوبرماركت', 'مواصلات', 'كافيه', 'فواتير', 'صيدلية'];
const QUICK_INCOME_TAGS = ['راتب شهري', 'فريلانس', 'مكافأة', 'أرباح', 'تحويل'];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  editExpense,
}) => {
  const {
    categories,
    accounts,
    createExpense,
    modifyExpense,
    removeExpense,
    createTransfer,
    expenses,
    settings,
    lastUsedCategoryId,
    lastUsedPaymentMethodId,
    prefillExpense,
    language,
    t,
    accountSummaries,
    saveCategoryItem,
    saveAccountItem,
  } = useApp();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [merchant, setMerchant] = useState('');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [date, setDate] = useState(getLocalDateString());
  const [time, setTime] = useState(getLocalTimeString());
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [suggestedCatId, setSuggestedCatId] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Quick Inline Category and Account creation states
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatIcon, setQuickCatIcon] = useState('Tag');
  const [quickCatColor, setQuickCatColor] = useState('#3B82F6');

  const [showQuickAddAccount, setShowQuickAddAccount] = useState(false);
  const [quickAccName, setQuickAccName] = useState('');
  const [quickAccIcon, setQuickAccIcon] = useState('Banknote');
  const [quickAccColor, setQuickAccColor] = useState('#10B981');
  const [quickAccOpeningBalance, setQuickAccOpeningBalance] = useState('0');

  useBodyScrollLock(isOpen);
  useBackHandler(isOpen, () => handleRequestClose(), 'add-expense');
  useBackHandler(showDiscardConfirm, () => setShowDiscardConfirm(false), 'add-discard');
  useBackHandler(showDeleteConfirm, () => setShowDeleteConfirm(false), 'add-delete');
  useBackHandler(showQuickAddCategory, () => setShowQuickAddCategory(false), 'add-quick-cat');
  useBackHandler(showQuickAddAccount, () => setShowQuickAddAccount(false), 'add-quick-acc');

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Live in-line math expression evaluator (e.g. 50 + 20 => 70)
  const liveMathResult = useMemo(() => safeEvalMath(amount), [amount]);

  // Active accounts
  const activeAccounts = useMemo(() => accounts.filter(a => a.isActive), [accounts]);

  // Active categories filtered by transaction type (Expense vs Income)
  const activeCategories = useMemo(() => {
    return categories.filter(c => {
      if (!c.isActive) return false;
      if (type === 'income') {
        return c.type === 'income' || c.id.startsWith('cat-inc-');
      }
      if (type === 'expense') {
        return !c.type || c.type === 'expense' || !c.id.startsWith('cat-inc-');
      }
      return true;
    });
  }, [categories, type]);

  // Handle switching transaction type smoothly
  const handleTypeChange = (newType: 'expense' | 'income' | 'transfer') => {
    triggerHaptic('light');
    setType(newType);
    setError(null);
    setSuggestedCatId(null);

    if (newType === 'income') {
      const firstIncome = categories.find(c => c.isActive && (c.type === 'income' || c.id.startsWith('cat-inc-')));
      if (firstIncome) {
        setCategoryId(firstIncome.id);
      }
    } else if (newType === 'expense') {
      const firstExpense = categories.find(c => c.isActive && (!c.type || c.type === 'expense' || !c.id.startsWith('cat-inc-')));
      const fallback = (lastUsedCategoryId && categories.some(c => c.id === lastUsedCategoryId && (!c.type || c.type === 'expense')))
        ? lastUsedCategoryId
        : (firstExpense?.id || categories[0]?.id || 'cat-general');
      setCategoryId(fallback);
    }
  };

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editExpense) {
        setAmount(editExpense.amount.toString());
        setCategoryId(editExpense.categoryId || 'cat-other');
        setNote(editExpense.note || '');
        setMerchant(editExpense.merchant || '');
        setType(editExpense.type);
        setDate(editExpense.date);
        setTime(editExpense.time || getLocalTimeString());
        setPaymentMethodId(editExpense.paymentMethodId || editExpense.accountId || accounts[0]?.id || 'acc-cash');
        setFromAccountId(editExpense.fromAccountId || editExpense.accountId || accounts[0]?.id || 'acc-cash');
        setToAccountId(editExpense.toAccountId || accounts.find(a => a.id !== (editExpense.fromAccountId || editExpense.accountId))?.id || accounts[1]?.id || 'acc-card');
        setShowMoreDetails(Boolean(editExpense.merchant || editExpense.date !== getLocalDateString()));
      } else {
        // New transaction defaults
        const initialType = prefillExpense?.type || 'expense';
        setType(initialType);

        let defaultCat = '';
        if (initialType === 'income') {
          const inc = categories.find(c => c.isActive && (c.type === 'income' || c.id.startsWith('cat-inc-')));
          defaultCat = prefillExpense?.categoryId || inc?.id || 'cat-inc-salary';
        } else {
          const exp = categories.find(c => c.isActive && (!c.type || c.type === 'expense' || !c.id.startsWith('cat-inc-')));
          defaultCat = prefillExpense?.categoryId || (lastUsedCategoryId && categories.some(c => c.id === lastUsedCategoryId && (!c.type || c.type === 'expense')) ? lastUsedCategoryId : exp?.id) || categories[0]?.id || 'cat-general';
        }

        const defaultPay = prefillExpense?.paymentMethodId || lastUsedPaymentMethodId || accounts[0]?.id || 'acc-cash';
        setAmount(prefillExpense?.amount ? prefillExpense.amount.toString() : '');
        setCategoryId(defaultCat);
        setNote(prefillExpense?.note || '');
        setMerchant(prefillExpense?.merchant || '');
        setDate(prefillExpense?.date || getLocalDateString());
        setTime(getLocalTimeString());
        setPaymentMethodId(defaultPay);
        const defaultFrom = prefillExpense?.fromAccountId || accounts[0]?.id || 'acc-cash';
        setFromAccountId(defaultFrom);
        setToAccountId(prefillExpense?.toAccountId || accounts.find(a => a.id !== defaultFrom)?.id || accounts[1]?.id || 'acc-card');
        setShowMoreDetails(false);
      }
      setSuggestedCatId(null);
      setDuplicateWarning(null);
      setError(null);
      setShowDiscardConfirm(false);
    }
  }, [isOpen, editExpense, prefillExpense, lastUsedCategoryId, lastUsedPaymentMethodId, accounts, categories]);

  // Check if form is meaningfully dirty
  const isDirty = Boolean(
    (amount.trim() && amount !== editExpense?.amount.toString()) ||
    (note.trim() && note !== (editExpense?.note || '')) ||
    (merchant.trim() && merchant !== (editExpense?.merchant || ''))
  );

  const handleRequestClose = () => {
    if (isDirty && !showDiscardConfirm) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  // Smart categorization suggestion when typing note or merchant
  const handleNoteChange = (text: string) => {
    setNote(text);
    if (!editExpense) {
      const predicted = predictCategoryFromText(text, expenses);
      if (predicted && predicted !== categoryId) {
        const catObj = categories.find(c => c.id === predicted);
        if (catObj) {
          const isIncomeCat = catObj.type === 'income' || catObj.id.startsWith('cat-inc-');
          if ((type === 'income' && isIncomeCat) || (type === 'expense' && !isIncomeCat)) {
            setSuggestedCatId(predicted);
          } else {
            setSuggestedCatId(null);
          }
        }
      } else {
        setSuggestedCatId(null);
      }
    }
  };

  const handleSaveQuickCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    const newCatId = `cat-${Date.now()}`;
    const newCat = {
      id: newCatId,
      name: quickCatName.trim(),
      icon: quickCatIcon || 'Tag',
      color: quickCatColor || '#3B82F6',
      type: type === 'income' ? ('income' as const) : ('expense' as const),
      isDefault: false,
      isActive: true,
      sortOrder: categories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveCategoryItem(newCat);
    setCategoryId(newCatId);
    setQuickCatName('');
    setShowQuickAddCategory(false);
  };

  const handleSaveQuickAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAccName.trim()) return;
    const newAccId = `acc-${Date.now()}`;
    const newAcc = {
      id: newAccId,
      name: quickAccName.trim(),
      type: 'cash' as const,
      openingBalance: parseFloat(quickAccOpeningBalance) || 0,
      color: quickAccColor || '#10B981',
      icon: quickAccIcon || 'Banknote',
      currency: settings.currency || 'EGP',
      isActive: true,
      isArchived: false,
      showOnHome: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveAccountItem(newAcc);
    setPaymentMethodId(newAccId);
    setFromAccountId(newAccId);
    setQuickAccName('');
    setQuickAccOpeningBalance('0');
    setShowQuickAddAccount(false);
  };

  const applySuggestedCategory = () => {
    if (suggestedCatId) {
      triggerHaptic('light');
      setCategoryId(suggestedCatId);
      setSuggestedCatId(null);
    }
  };

  // Quick increment buttons (+20, +50, +100, +200, +500)
  const handleQuickAdd = (addVal: number) => {
    triggerHaptic('light');
    setAmount(prev => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return addVal.toString();
      }
      // If expression ends with an operator, append the number
      if (/[+\-*/×÷]$/.test(trimmed)) {
        return `${trimmed} ${addVal}`;
      }
      // If it's a compound math expression, evaluate it first, then add
      const mathResult = safeEvalMath(trimmed);
      if (mathResult !== null) {
        return (mathResult + addVal).toString();
      }
      // Otherwise regular single number increment
      const current = parseFloat(normalizeArabicNumerals(trimmed)) || 0;
      return (current + addVal).toString();
    });
    setError(null);
  };

  // Clear amount
  const handleClearAmount = () => {
    triggerHaptic('light');
    setAmount('');
    setError(null);
  };

  // Quick swap from & to accounts in transfer mode
  const handleSwapAccounts = () => {
    triggerHaptic('medium');
    setFromAccountId(toAccountId);
    setToAccountId(fromAccountId);
  };

  // Submit handler
  const handleSave = async (e?: React.FormEvent, bypassDuplicate = false) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Check for trailing operator
    const trimmedAmount = amount.trim();
    if (/[+\-*/×÷]$/.test(trimmedAmount)) {
      setError(language === 'ar' ? 'يرجى إكمال العملية الحسابية أو مسح الرمز الأخير.' : 'Please finish the calculation or remove the trailing operator.');
      return;
    }

    // Auto-evaluate math if present
    let finalAmountStr = trimmedAmount;
    const mathEval = safeEvalMath(trimmedAmount);
    if (mathEval !== null) {
      finalAmountStr = mathEval.toString();
      setAmount(finalAmountStr);
    }

    const parsed = parseMoneyInput(finalAmountStr);
    if (!parsed.valid) {
      setError(parsed.error || (language === 'ar' ? 'أدخل مبلغاً أكبر من 0.' : 'Enter an amount greater than 0.'));
      amountInputRef.current?.focus();
      return;
    }

    if (type === 'transfer') {
      const val = validateTransfer({ amount: parsed.amount, fromAccountId, toAccountId }, accounts);
      if (!val.valid) {
        setError(val.error || (language === 'ar' ? 'تفاصيل التحويل غير صالحة' : 'Invalid transfer details'));
        return;
      }

      try {
        setIsSubmitting(true);
        const fromAcc = accounts.find(a => a.id === fromAccountId);
        const toAcc = accounts.find(a => a.id === toAccountId);
        const fromName = fromAcc?.name || 'Account';
        const toName = toAcc?.name || 'Account';

        if (editExpense) {
          await modifyExpense(editExpense.id, {
            type: 'transfer',
            amount: parsed.amount,
            accountId: fromAccountId,
            fromAccountId,
            toAccountId,
            paymentMethodId: fromAccountId,
            note: note.trim() || `${fromName} → ${toName}`,
            merchant: `Transfer: ${fromName} → ${toName}`,
            date,
            time,
          });
        } else {
          await createTransfer({
            amount: parsed.amount,
            fromAccountId,
            toAccountId,
            note: note.trim(),
            date,
            time,
          });
        }
        triggerHaptic('success');
        onClose();
      } catch (err: any) {
        console.error(err);
        setError(err?.message || (language === 'ar' ? 'تعذر إتمام التحويل.' : "Couldn't complete transfer."));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!categoryId) {
      setError(language === 'ar' ? 'يرجى اختيار فئة.' : 'Please choose a category.');
      return;
    }

    const chosenAccountId = paymentMethodId || accounts[0]?.id || 'acc-cash';

    // Duplicate check for expenses
    if (!editExpense && !bypassDuplicate && type === 'expense') {
      const duplicate = detectDuplicateExpense(
        { amount: parsed.amount, categoryId, note, date },
        expenses
      );
      if (duplicate) {
        setDuplicateWarning(duplicate);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      if (editExpense) {
        await modifyExpense(editExpense.id, {
          type,
          amount: parsed.amount,
          categoryId,
          accountId: chosenAccountId,
          paymentMethodId: chosenAccountId,
          note: note.trim(),
          merchant: merchant.trim() || note.trim(),
          date,
          time,
        });
      } else {
        await createExpense({
          type,
          amount: parsed.amount,
          categoryId,
          accountId: chosenAccountId,
          paymentMethodId: chosenAccountId,
          note: note.trim(),
          merchant: merchant.trim() || note.trim(),
          date,
          time,
        });
      }
      triggerHaptic('success');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || (language === 'ar' ? 'تعذر حفظ المعاملة.' : "Couldn't save transaction."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const suggestedCategoryObj = categories.find(c => c.id === suggestedCatId);
  const currencySymbol = language === 'ar' ? 'ج.م' : (settings.currency || 'EGP');

  // Human friendly parsed amount for dynamic button text
  const numericAmount = parseFloat(normalizeArabicNumerals(amount.trim()));
  const formattedButtonAmount = !isNaN(numericAmount) && numericAmount > 0
    ? `(${numericAmount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${currencySymbol})`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={handleRequestClose} />

      <div 
        className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200/90 dark:border-slate-800 z-10 transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Drag Pill */}
        <div className="w-full flex items-center justify-center pt-2 pb-0.5 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-slate-300 dark:bg-slate-700 select-none" />
        </div>

        {/* 1. Header with Type Switcher - Compact & Modern */}
        <div className="px-4 pt-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequestClose}
                className="p-1 -ms-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'ar' ? 'إلغاء' : 'Cancel'}
              >
                <ArrowLeft size={18} className="rtl:rotate-180" />
              </button>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {editExpense 
                  ? (language === 'ar' ? 'تعديل' : 'Edit')
                  : (language === 'ar' 
                      ? (type === 'income' ? 'إضافة دخل' : type === 'transfer' ? 'تحويل رصيد' : 'إضافة مصروف')
                      : (type === 'income' ? 'Add Income' : type === 'transfer' ? 'Transfer' : 'Add Expense'))
                }
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRequestClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t.detail.close}
            >
              <X size={18} />
            </button>
          </div>

          {/* Segmented Type Switcher - Clean & Slim */}
          <div className="grid grid-cols-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 p-0.5 text-xs font-semibold gap-1">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-1.5 text-center rounded-lg transition-all cursor-pointer font-bold ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              {t.transactions.expenses}
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-1.5 text-center rounded-lg transition-all cursor-pointer font-bold ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'
              }`}
            >
              {t.transactions.income}
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('transfer')}
              className={`py-1.5 text-center rounded-lg transition-all cursor-pointer font-bold ${
                type === 'transfer'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
              }`}
            >
              {t.transactions.transfers}
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body: Clean, Compact Flow */}
        <form onSubmit={e => handleSave(e)} className="flex-1 overflow-y-auto no-scrollbar px-4 py-2.5 space-y-3">
          
          {/* AMOUNT HERO: Delete button on Right (RTL start), Amount Center, Currency on Left (RTL end) */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-3.5 text-center shadow-2xs relative">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              {language === 'ar' ? 'المبلغ المطلوب' : 'Amount'}
            </span>

            <div className="relative flex items-center justify-center w-full max-w-xs mx-auto">
              {/* 1. Right Side (in RTL): Delete / Clear Button */}
              <div className="w-9 flex items-center justify-center shrink-0">
                {amount.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClearAmount}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer active:scale-95"
                    title={language === 'ar' ? 'مسح' : 'Clear'}
                  >
                    <Delete size={17} className="rtl:rotate-180" />
                  </button>
                ) : (
                  <div className="w-8 h-8" aria-hidden="true" />
                )}
              </div>

              {/* 2. Center: Input Field */}
              <div className="flex-1 max-w-[190px] sm:max-w-[210px] flex justify-center">
                <input
                  id="amount-input"
                  ref={amountInputRef}
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => {
                    const normalized = normalizeArabicNumerals(e.target.value);
                    setAmount(normalized);
                    setError(null);
                    setDuplicateWarning(null);
                  }}
                  placeholder="0.00"
                  className="w-full text-3xl sm:text-4xl font-black text-slate-900 dark:text-white text-center bg-transparent focus:outline-hidden border-b-2 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 transition-colors pb-1 tracking-tight"
                  autoComplete="off"
                />
              </div>

              {/* 3. Left Side (in RTL): Currency Symbol (ج.م) */}
              <div className="w-9 flex items-center justify-center shrink-0">
                <span className="text-sm sm:text-base font-bold text-slate-400 dark:text-slate-500 select-none">
                  {currencySymbol}
                </span>
              </div>
            </div>

            {/* Live Arithmetic Result */}
            {liveMathResult !== null && (
              <div className="mt-2 flex items-center justify-center animate-in fade-in">
                <button
                  type="button"
                  onClick={() => setAmount(liveMathResult.toString())}
                  className="px-2.5 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  <Calculator size={12} />
                  <span>= {liveMathResult} {currencySymbol}</span>
                  <span className="text-[10px] text-blue-500 font-medium">({language === 'ar' ? 'تطبيق' : 'Apply'})</span>
                </button>
              </div>
            )}

            {/* Quick Increment Chips: Sleek, Subtle, Fast */}
            <div className="flex items-center justify-center gap-1 mt-2.5 flex-wrap">
              {[20, 50, 100, 200, 500].map(addVal => (
                <button
                  key={addVal}
                  type="button"
                  onClick={() => handleQuickAdd(addVal)}
                  className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  +{addVal}
                </button>
              ))}
            </div>
          </div>

          {/* ACCOUNT / WALLET SELECTOR */}
          {type === 'transfer' ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تفاصيل التحويل بين المحافظ' : 'Transfer details'}
                </label>
                <button
                  type="button"
                  onClick={handleSwapAccounts}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <ArrowRightLeft size={12} />
                  <span>{language === 'ar' ? 'تبديل' : 'Swap'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* From Account */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">
                    {language === 'ar' ? 'من محفظة:' : 'From:'}
                  </span>
                  <div className="space-y-1">
                    {activeAccounts.map(acc => {
                      const isSelected = fromAccountId === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            setFromAccountId(acc.id);
                            if (toAccountId === acc.id) {
                              const other = activeAccounts.find(a => a.id !== acc.id);
                              if (other) setToAccountId(other.id);
                            }
                            setError(null);
                          }}
                          className={`w-full p-1.5 rounded-xl border flex items-center gap-1.5 text-start transition-all cursor-pointer text-xs ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-600/30'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <AccountIcon type={acc.type} color={acc.color} size={14} />
                          <span className="truncate">{getAccountDisplayName(acc.name, language)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* To Account */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">
                    {language === 'ar' ? 'إلى محفظة:' : 'To:'}
                  </span>
                  <div className="space-y-1">
                    {activeAccounts.map(acc => {
                      const isSelected = toAccountId === acc.id;
                      const isSameAsFrom = acc.id === fromAccountId;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          disabled={isSameAsFrom}
                          onClick={() => {
                            setToAccountId(acc.id);
                            setError(null);
                          }}
                          className={`w-full p-1.5 rounded-xl border flex items-center gap-1.5 text-start transition-all text-xs ${
                            isSameAsFrom
                              ? 'opacity-40 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
                              : isSelected
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-600/30 cursor-pointer'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <AccountIcon type={acc.type} color={acc.color} size={14} />
                          <span className="truncate">{getAccountDisplayName(acc.name, language)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Wallet size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    {type === 'income' 
                      ? (language === 'ar' ? 'الإيداع في محفظة:' : 'Deposit to:') 
                      : (language === 'ar' ? 'طريقة الدفع / المحفظة:' : 'Paid from:')
                    }
                  </span>
                </label>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {activeAccounts.map(acc => {
                  const isSelected = paymentMethodId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setPaymentMethodId(acc.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? (type === 'income'
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-2xs'
                              : 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 font-bold ring-2 ring-blue-500/30 shadow-2xs')
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold shadow-2xs'
                      }`}
                    >
                      <AccountIcon type={acc.type} color={acc.color} size={14} />
                      <span className="font-semibold text-xs text-inherit">{getAccountDisplayName(acc.name, language)}</span>
                    </button>
                  );
                })}

                {/* Quick Add Account Button */}
                <button
                  type="button"
                  onClick={() => setShowQuickAddAccount(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-700/80 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 font-bold text-xs shrink-0 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                  title={language === 'ar' ? 'إضافة محفظة جديدة' : 'Add Wallet'}
                >
                  <Plus size={13} />
                  <span>{language === 'ar' ? 'محفظة جديدة' : 'New Wallet'}</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORIES SELECTOR: Compact Horizontal Chips */}
          {type !== 'transfer' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Tag size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    {type === 'income' 
                      ? (language === 'ar' ? 'فئة الدخل:' : 'Income Category:') 
                      : (language === 'ar' ? 'فئة المصروف:' : 'Expense Category:')
                    }
                  </span>
                </label>
              </div>

              {/* Horizontal Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {activeCategories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setCategoryId(cat.id);
                        setError(null);
                        setSuggestedCatId(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? (type === 'income'
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-2xs'
                              : 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 font-bold ring-2 ring-blue-500/30 shadow-2xs')
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold shadow-2xs'
                      }`}
                    >
                      <div 
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}25` }}
                      >
                        <CategoryIcon name={cat.icon} color={cat.color} size={12} />
                      </div>
                      <span className="font-semibold text-xs text-inherit">
                        {getCategoryDisplayName(cat.name, language)}
                      </span>
                    </button>
                  );
                })}

                {/* Quick Add Category Button */}
                <button
                  type="button"
                  onClick={() => setShowQuickAddCategory(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-700/80 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 font-bold text-xs shrink-0 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                  title={language === 'ar' ? 'إضافة فئة جديدة' : 'Add Category'}
                >
                  <Plus size={13} />
                  <span>{language === 'ar' ? 'فئة جديدة' : 'New Category'}</span>
                </button>
              </div>

              {/* Smart Auto-Suggestion Banner */}
              {suggestedCategoryObj && (
                <div className="mt-2 flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-blue-950 dark:text-blue-100 font-medium">
                    <Sparkles size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>
                      {language === 'ar' ? 'فئة مقترحة:' : 'Suggested:'} <strong className="font-bold">{getCategoryDisplayName(suggestedCategoryObj.name, language)}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={applySuggestedCategory}
                    className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* NOTE FIELD WITH 1-TAP QUICK TAGS */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <PenLine size={12} className="text-slate-400" />
                <span>{t.addExpense.noteOptional}</span>
              </label>
            </div>
            
            <input
              type="text"
              value={note}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder={type === 'income' 
                ? (language === 'ar' ? 'اكتب ملاحظة (مثال: راتب، مكافأة)...' : 'Add a note (e.g. Salary, Project)...') 
                : (language === 'ar' ? 'اكتب ملاحظة (مثال: غداء، مشاوير، قهوة)...' : 'Add a note (e.g. Lunch, Coffee)...')
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden transition-all shadow-2xs"
            />

            {/* Quick Suggestions Chips to fill note in 1 second */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
              {(type === 'income' ? QUICK_INCOME_TAGS : QUICK_EXPENSE_TAGS).map(tagText => (
                <button
                  key={tagText}
                  type="button"
                  onClick={() => {
                    handleNoteChange(tagText);
                    triggerHaptic('light');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 shrink-0 transition-colors cursor-pointer active:scale-95"
                >
                  {tagText}
                </button>
              ))}
            </div>
          </div>

          {/* DUPLICATE WARNING */}
          {duplicateWarning && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle size={14} className="text-amber-600 shrink-0" />
                <span>{t.addExpense.duplicateWarning}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                {language === 'ar'
                  ? `تم تسجيل معاملة مطابقة بقيمة ${formatCurrency(duplicateWarning.amount, settings.currency)} بتاريخ ${duplicateWarning.date}.`
                  : `An identical expense of ${formatCurrency(duplicateWarning.amount, settings.currency)} was recorded on ${duplicateWarning.date}.`
                }
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSave(undefined, true)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ على أي حال' : 'Save anyway'}
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(null)}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'مراجعة' : 'Review'}
                </button>
              </div>
            </div>
          )}

          {/* COLLAPSIBLE DETAILS: Merchant, Date, Time */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>
                  {showMoreDetails 
                    ? (language === 'ar' ? 'إخفاء التفاصيل الإضافية' : 'Hide extra details') 
                    : (language === 'ar' ? `خيارات التاريخ والمتجر (${date})` : `Date & Merchant (${date})`)}
                </span>
              </span>
              {showMoreDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showMoreDetails && (
              <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 animate-in fade-in duration-150 text-xs">
                {type !== 'transfer' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Building2 size={13} />
                      {type === 'income' 
                        ? (language === 'ar' ? 'جهة أو مصدر الدخل (اختياري)' : 'Income source (Optional)') 
                        : t.addExpense.merchantOptional
                      }
                    </label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={e => setMerchant(e.target.value)}
                      placeholder={type === 'income' 
                        ? (language === 'ar' ? 'مثال: الشركة، العميل' : 'e.g. Employer, Client') 
                        : (language === 'ar' ? 'مثال: كارفور، أوبر' : 'e.g. Carrefour, Uber')
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar size={13} /> {t.addExpense.date}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Clock size={13} /> {t.addExpense.time}
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Validation error notice */}
          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-bold pt-0.5 animate-in fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </form>

        {/* 3. Sticky Action Footer - Sleek & Tactile */}
        <div className="p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shrink-0 flex items-center gap-2">
          {editExpense && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
              title={language === 'ar' ? 'حذف المعاملة' : 'Delete'}
            >
              <Trash2 size={15} />
              <span>{language === 'ar' ? 'حذف' : 'Delete'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={e => handleSave(e)}
            disabled={isSubmitting}
            className={`flex-1 py-2.5 px-4 text-white font-bold rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] active:scale-[0.99] ${
              type === 'income'
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 shadow-emerald-600/20'
                : type === 'transfer'
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-blue-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60 shadow-rose-600/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check size={17} strokeWidth={2.4} />
                <span>
                  {editExpense 
                    ? t.addExpense.update
                    : (language === 'ar' 
                        ? (type === 'income' 
                            ? `حفظ الدخل ${formattedButtonAmount}` 
                            : type === 'transfer' 
                                ? `تأكيد التحويل ${formattedButtonAmount}` 
                                : `حفظ المصروف ${formattedButtonAmount}`) 
                        : (type === 'income' 
                            ? `Save Income ${formattedButtonAmount}` 
                            : type === 'transfer' 
                                ? `Confirm Transfer ${formattedButtonAmount}` 
                                : `Save Expense ${formattedButtonAmount}`))}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Discard Confirmation Dialog */}
        {showDiscardConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.addExpense.discardConfirm}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {t.addExpense.discardDesc}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  {t.addExpense.keepEditing}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {t.addExpense.discard}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && editExpense && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.detail.confirmDelete}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {t.detail.confirmDeleteDesc}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  {t.settings.cancel}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = editExpense.id;
                    setShowDeleteConfirm(false);
                    onClose();
                    await removeExpense(id);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {t.detail.delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Category Sub-Dialog */}
        {showQuickAddCategory && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowQuickAddCategory(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveQuickCategory} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'اسم الفئة:' : 'Category Name:'}
                  </label>
                  <input
                    type="text"
                    value={quickCatName}
                    onChange={e => setQuickCatName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: قهوة، مطاعم، بقالة' : 'e.g. Coffee, Groceries'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-blue-600"
                    autoFocus
                  />
                </div>

                <StyledIconSelector
                  selectedIcon={quickCatIcon}
                  selectedColor={quickCatColor}
                  onSelect={(icon, color) => {
                    setQuickCatIcon(icon);
                    setQuickCatColor(color);
                  }}
                  language={language}
                />

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAddCategory(false)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={!quickCatName.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl"
                  >
                    {language === 'ar' ? 'حفظ الفئة' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Add Account Sub-Dialog */}
        {showQuickAddAccount && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'إضافة محفظة جديدة' : 'Add New Wallet'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowQuickAddAccount(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveQuickAccount} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'اسم المحفظة:' : 'Wallet Name:'}
                  </label>
                  <input
                    type="text"
                    value={quickAccName}
                    onChange={e => setQuickAccName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: فودافون كاش، محفظتي' : 'e.g. Mobile Wallet'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-blue-600"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'الرصيد الافتتاحي:' : 'Opening Balance:'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quickAccOpeningBalance}
                    onChange={e => setQuickAccOpeningBalance(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-blue-600"
                  />
                </div>

                <StyledIconSelector
                  selectedIcon={quickAccIcon}
                  selectedColor={quickAccColor}
                  onSelect={(icon, color) => {
                    setQuickAccIcon(icon);
                    setQuickAccColor(color);
                  }}
                  language={language}
                />

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAddAccount(false)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={!quickAccName.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl"
                  >
                    {language === 'ar' ? 'حفظ المحفظة' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
