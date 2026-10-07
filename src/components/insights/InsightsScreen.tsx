import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategoryDetailModal } from './CategoryDetailModal';
import { 
  formatCurrency, 
  getCurrentMonthPrefix, 
  getPreviousMonthString, 
  getNextMonthString, 
  calculateMonthInsights, 
  toArabicNumerals 
} from '../../utils/calculations';
import { 
  formatMonthLabel, 
  formatMonthShortLabel, 
  getCategoryDisplayName 
} from '../../utils/i18n';
import { 
  ChevronLeft, 
  ChevronRight, 
  Receipt, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';
import { Category } from '../../types';

export const InsightsScreen: React.FC = () => {
  const { 
    expenses, 
    categories, 
    accounts,
    settings, 
    referenceDate, 
    setViewingExpense, 
    setActiveTab, 
    openAddExpense, 
    language, 
    numberFormat,
    t 
  } = useApp();

  const formatNum = (val: number | string) => {
    return language === 'ar' ? toArabicNumerals(val) : String(val);
  };

  const currentMonthPrefix = useMemo(() => getCurrentMonthPrefix(referenceDate), [referenceDate]);

  // Selected month state (default to current month)
  const [selectedMonthPrefix, setSelectedMonthPrefix] = useState<string>(currentMonthPrefix);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);

  const pillsScrollRef = useRef<HTMLDivElement>(null);

  // Centralized, high-performance month analytics (O(N) single-pass)
  const insights = useMemo(() => {
    return calculateMonthInsights(expenses, categories, selectedMonthPrefix, referenceDate, accounts, language);
  }, [expenses, categories, selectedMonthPrefix, referenceDate, accounts, language]);

  // Earliest logged month from insights timeline
  const earliestMonthPrefix = useMemo(() => {
    return insights.historical6Months[0]?.monthPrefix || currentMonthPrefix;
  }, [insights.historical6Months, currentMonthPrefix]);

  // Month navigation guards: cannot go before earliest month or after current month
  const canGoPrev = selectedMonthPrefix > earliestMonthPrefix;
  const canGoNext = selectedMonthPrefix < currentMonthPrefix;

  const handlePrevMonth = () => {
    if (canGoPrev) {
      setSelectedMonthPrefix(prev => getPreviousMonthString(prev));
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setSelectedMonthPrefix(prev => getNextMonthString(prev));
    }
  };

  // Auto-scroll timeline to selected month pill
  useEffect(() => {
    if (pillsScrollRef.current) {
      const selectedEl = pillsScrollRef.current.querySelector('[data-selected="true"]');
      if (selectedEl && typeof (selectedEl as HTMLElement).scrollIntoView === 'function') {
        (selectedEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedMonthPrefix]);

  // Filtered expenses for category detail drill-down (strictly selected month, non-deleted, expense-only)
  const selectedMonthExpenses = useMemo(() => {
    return expenses.filter(e => 
      !e.isDeleted && 
      e.type === 'expense' && 
      e.date.startsWith(selectedMonthPrefix)
    );
  }, [expenses, selectedMonthPrefix]);

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header with Back to Home Button */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs shrink-0"
          title={language === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}
          aria-label={language === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}
        >
          <ArrowLeft size={18} className="rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t.insights.title}
          </h1>
        </div>
      </div>

      {/* 1. DYNAMIC MONTH TIMELINE SELECTOR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              canGoPrev
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
            }`}
            aria-label={t.insights.previousMonth}
          >
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatMonthLabel(selectedMonthPrefix, language)}
              </h2>
              {insights.isCurrentMonth && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  {t.insights.current}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {insights.isCurrentMonth 
                ? t.insights.dayOf.replace('{day}', formatNum(insights.daysElapsed)).replace('{total}', formatNum(insights.daysInMonth))
                : t.insights.calendarDays.replace('{days}', formatNum(insights.daysInMonth))}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={!canGoNext}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              canGoNext 
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' 
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
            }`}
            aria-label={t.insights.nextMonth}
          >
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
        </div>

        {/* Dynamic Month Timeline Scrolling Pills (from earliest recorded to current month) */}
        <div 
          ref={pillsScrollRef}
          className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {insights.historical6Months.map(m => {
            const isSelected = m.monthPrefix === selectedMonthPrefix;
            const isCurrent = m.monthPrefix === currentMonthPrefix;
            return (
              <button
                key={m.monthPrefix}
                type="button"
                data-selected={isSelected ? 'true' : undefined}
                onClick={() => setSelectedMonthPrefix(m.monthPrefix)}
                className={`flex-1 min-w-[76px] py-1.5 px-2.5 rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{formatMonthShortLabel(m.monthPrefix, language)}</span>
                {isCurrent && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected 
                      ? 'bg-blue-500 text-white font-bold' 
                      : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold'
                  }`}>
                    {t.insights.current}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SPARSE DATA CHECK: Zero transactions empty state */}
      {insights.transactionCount === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t.insights.noDataForMonth.replace('{month}', formatMonthLabel(selectedMonthPrefix, language))}
            </h2>
          </div>
          <div className="pt-2 flex justify-center gap-2">
            {!insights.isCurrentMonth && (
              <button
                type="button"
                onClick={() => setSelectedMonthPrefix(currentMonthPrefix)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t.insights.jumpToCurrentMonth}
              </button>
            )}
            <button
              type="button"
              onClick={() => openAddExpense()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <span>{t.insights.addExpense}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* INCOME & SAVINGS CASHFLOW BANNER */}
          {Boolean(insights.totalIncome && insights.totalIncome > 0) && (
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/40 rounded-2xl p-4 border border-emerald-500/20 dark:border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{language === 'ar' ? 'صافي الحركة المالية للشهر' : 'Monthly Cashflow'}</span>
                <span className={(insights.netSavings ?? 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-extrabold'}>
                  {(insights.netSavings ?? 0) >= 0 
                    ? (language === 'ar' ? `+ فائض: ${formatCurrency(insights.netSavings || 0, settings.currency, language, false, numberFormat)}` : `+ Surplus: ${formatCurrency(insights.netSavings || 0, settings.currency, language, false, numberFormat)}`)
                    : (language === 'ar' ? `− عجز: ${formatCurrency(Math.abs(insights.netSavings || 0), settings.currency, language, false, numberFormat)}` : `− Deficit: ${formatCurrency(Math.abs(insights.netSavings || 0), settings.currency, language, false, numberFormat)}`)
                  }
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-500/10">
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إجمالي الدخل:' : 'Total income:'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(insights.totalIncome || 0, settings.currency, language, false, numberFormat)}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إجمالي المصاريف:' : 'Total spent:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">−{formatCurrency(insights.totalSpent, settings.currency, language, false, numberFormat)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. MONTHLY OVERVIEW METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.totalSpent}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight truncate">
                {formatCurrency(insights.totalSpent, settings.currency, language, false, numberFormat)}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                {formatMonthLabel(selectedMonthPrefix, language)}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.dailyAverage}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight truncate">
                {formatCurrency(insights.dailyAverage, settings.currency, language, false, numberFormat)}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                {insights.isCurrentMonth 
                  ? t.home.overDays.replace('{days}', formatNum(insights.daysElapsed)) 
                  : t.home.overDays.replace('{days}', formatNum(insights.daysInMonth))}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.transactionsCount}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                {formatNum(insights.transactionCount)}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                {t.insights.loggedExpenses}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.vsPreviousMonth}
              </span>
              {insights.monthComparison.hasPrevData ? (
                <>
                  <div className="text-base sm:text-lg font-bold mt-1 tracking-tight flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    {insights.monthComparison.difference >= 0 ? '+' : '−'}
                    {formatCurrency(Math.abs(insights.monthComparison.difference), settings.currency, language, false, numberFormat)}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block truncate">
                    {insights.monthComparison.percentageChange !== null && insights.monthComparison.percentageChange >= 0 ? '+' : ''}
                    {formatNum(insights.monthComparison.percentageChange ?? 0)}{language === 'ar' ? '٪' : '%'} {language === 'ar' ? `مقارنة بـ ${formatMonthShortLabel(insights.monthComparison.prevMonthPrefix, 'ar')}` : `vs ${formatMonthShortLabel(insights.monthComparison.prevMonthPrefix, 'en')}`}
                  </span>
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    {language === 'ar' ? 'لا توجد بيانات سابقة' : 'No previous data'}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {language === 'ar' ? 'الفترة الأولى المسجلة' : 'First tracked period'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 3. TOP CATEGORY & SPENDING CONCENTRATION */}
          {insights.topCategory && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {t.insights.topCategory}
                </h2>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatNum(insights.top3Share)}{language === 'ar' ? '٪' : '%'} {t.insights.ofTotal}
                </span>
              </div>

              {/* Factual Statement (Clear readable 14px body text) */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {getCategoryDisplayName(insights.topCategory.category.name, 'ar')}
                    </span>
                    {' '}تمثل{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatNum(insights.topCategory.percentage)}٪
                    </span>
                    {' '}من إنفاق شهر {formatMonthLabel(selectedMonthPrefix, 'ar')} ({formatCurrency(insights.topCategory.total, settings.currency, 'ar', false, 'arabic')} عبر {formatNum(insights.topCategory.count)} {insights.topCategory.count === 1 ? 'معاملة' : 'معاملات'}).
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {insights.topCategory.category.name}
                    </span>
                    {' '}represents{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatNum(insights.topCategory.percentage)}%
                    </span>
                    {' '}of {formatMonthLabel(selectedMonthPrefix, 'en')} spending ({formatCurrency(insights.topCategory.total, settings.currency, 'en', false, 'western')} across {formatNum(insights.topCategory.count)} {insights.topCategory.count === 1 ? 'transaction' : 'transactions'}).
                  </>
                )}
              </div>

              {/* Top 3 Distribution Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                {insights.top3Categories.map((item) => (
                  <div 
                    key={item.category.id}
                    onClick={() => setSelectedCategoryForModal(item.category)}
                    className="p-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.category.color }} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {getCategoryDisplayName(item.category.name, language)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {formatNum(item.percentage)}{language === 'ar' ? '٪' : '%'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                      {formatCurrency(item.total, settings.currency, language, false, numberFormat)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CATEGORY INTELLIGENCE: Ranked Breakdown (Where Did My Money Go?) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {t.insights.whereDidMoneyGo}
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t.insights.tapCategoryToView}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {insights.categoryBreakdown.map(item => {
                const avgTxn = item.count > 0 ? Math.round(item.total / item.count) : 0;
                return (
                  <div
                    key={item.category.id}
                    onClick={() => setSelectedCategoryForModal(item.category)}
                    className="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryIcon
                          name={item.category.icon}
                          color={item.category.color}
                          size={18}
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors block leading-tight">
                            {getCategoryDisplayName(item.category.name, language)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                            {formatNum(item.count)} {t.insights.txns} · {formatCurrency(avgTxn, settings.currency, language, false, numberFormat)} {t.insights.avg}
                          </span>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">
                          {formatCurrency(item.total, settings.currency, language, false, numberFormat)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                          {formatNum(item.percentage)}{language === 'ar' ? '٪' : '%'}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(1, item.percentage))}%`,
                          backgroundColor: item.category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. ADDITIONAL FACTUAL INSIGHTS */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.largestTransaction}
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
                {insights.largestExpense ? formatCurrency(insights.largestExpense.amount, settings.currency) : '—'}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                {insights.largestExpense?.note || insights.largestExpense?.merchant || t.insights.singleLargest}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.highestDay}
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
                {insights.highestSpendingDay ? formatCurrency(insights.highestSpendingDay.amount, settings.currency, language, false, numberFormat) : '—'}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                {insights.highestSpendingDay ? `${t.insights.dayOf.replace('{day}', formatNum(insights.highestSpendingDay.day)).replace('{total}', formatNum(insights.daysInMonth))} (${formatNum(insights.highestSpendingDay.count)} ${t.insights.txns})` : '—'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.insights.averageTransaction}
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
                {insights.averageTransaction > 0 ? formatCurrency(insights.averageTransaction, settings.currency, language, false, numberFormat) : '—'}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                {t.insights.perTransaction}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Category Detail Modal (Enhanced with month context) */}
      <CategoryDetailModal
        category={selectedCategoryForModal}
        expenses={selectedMonthExpenses}
        currency={settings.currency}
        totalPeriodSpend={insights.totalSpent}
        monthLabel={formatMonthLabel(selectedMonthPrefix, language)}
        onClose={() => setSelectedCategoryForModal(null)}
        onSelectTransaction={(exp) => setViewingExpense(exp)}
      />
    </div>
  );
};
