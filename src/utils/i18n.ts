export type Language = 'en' | 'ar';

export interface Translations {
  nav: {
    home: string;
    transactions: string;
    insights: string;
    settings: string;
    addExpense: string;
  };
  home: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    dayOf: string;
    todaySpending: string;
    transactionsLoggedToday_one: string;
    transactionsLoggedToday_other: string;
    dailyAverage: string;
    overDays: string;
    thisMonth: string;
    setBudget: string;
    remaining: string;
    dailyAllowance: string;
    monthEndForecast: string;
    finalMonthSpending: string;
    of: string;
    netWorth: string;
    assets: string;
    liabilities: string;
    transfer: string;
    manage: string;
    debt: string;
    available: string;
    trend7Days: string;
    avgPerDay: string;
    monthlyCategoryBreakdown: string;
    monthOverMonth: string;
    recentTransactions: string;
    viewAll: string;
    noTransactionsYet: string;
    noTransactionsDesc: string;
    paceWatch: string;
    paceOverBudget: string;
    paceNoBudget: string;
  };
  transactions: {
    title: string;
    searchPlaceholder: string;
    filter: string;
    all: string;
    expenses: string;
    income: string;
    transfers: string;
    today: string;
    yesterday: string;
    noTransactionsFound: string;
    noMatchingFilters: string;
    resetFilters: string;
    clearFilters: string;
    filterTransactions: string;
    dateRange: string;
    account: string;
    category: string;
    type: string;
    minAmount: string;
    maxAmount: string;
    applyFilters: string;
    sortBy: string;
    newest: string;
    oldest: string;
    highest: string;
    lowest: string;
    clearAll: string;
    from: string;
    to: string;
    amountRange: string;
    noLimit: string;
  };
  addExpense: {
    newExpense: string;
    newIncome: string;
    newTransfer: string;
    editExpense: string;
    editIncome: string;
    editTransfer: string;
    amount: string;
    category: string;
    account: string;
    paidFrom: string;
    depositedTo: string;
    noteOptional: string;
    merchantOptional: string;
    date: string;
    time: string;
    saveExpense: string;
    saveIncome: string;
    saveTransfer: string;
    update: string;
    typeExpense: string;
    typeIncome: string;
    typeTransfer: string;
    showMore: string;
    showLess: string;
    duplicateWarning: string;
    discardConfirm: string;
    discardDesc: string;
    keepEditing: string;
    discard: string;
    suggestedCategory: string;
    tapToApply: string;
    fromAccount: string;
    toAccount: string;
    cancel: string;
    save: string;
  };
  detail: {
    title: string;
    edit: string;
    editTransfer: string;
    delete: string;
    close: string;
    amount: string;
    date: string;
    time: string;
    category: string;
    account: string;
    fromAccount: string;
    toAccount: string;
    merchant: string;
    notes: string;
    type: string;
    confirmDelete: string;
    confirmDeleteDesc: string;
  };
  insights: {
    title: string;
    subtitle: string;
    totalSpending: string;
    vsPreviousMonth: string;
    topCategory: string;
    largestExpense: string;
    largestTransaction: string;
    highestSpendingDay: string;
    dailySpendingTrend: string;
    spendingByCategory: string;
    spendingByAccount: string;
    monthComparison: string;
    noExpensesRecorded: string;
    previousMonth: string;
    nextMonth: string;
    ofTotal: string;
    whereDidMoneyGo: string;
    rankBreakdown: string;
    tapCategoryToView: string;
    dailyActivityAcross: string;
    dailyTrendTitle: string;
    dailyAverage: string;
    transactionsCount: string;
    loggedExpenses: string;
    totalSpent: string;
    highestDay: string;
    averageTransaction: string;
    perTransaction: string;
    spendingByAccountTitle: string;
    accountDistribution: string;
    sixMonthTrend: string;
    historicalMonthlyTotals: string;
    noDataForMonth: string;
    noExpensesForMonthDesc: string;
    jumpToCurrentMonth: string;
    addExpense: string;
    current: string;
    dayOf: string;
    calendarDays: string;
    singleLargest: string;
    txns: string;
    avg: string;
    noPrevData: string;
    firstPeriod: string;
    catModalTotal: string;
    catModalShare: string;
    catModalAverage: string;
    catModalLargest: string;
    catModalTxns: string;
    catModalDateTime: string;
    catModalEmpty: string;
  };
  settings: {
    title: string;
    subtitle: string;
    preferences: string;
    currency: string;
    currencyDesc: string;
    language: string;
    english: string;
    arabic: string;
    theme: string;
    lightMode: string;
    darkMode: string;
    lightActive: string;
    darkActive: string;
    switchToLight: string;
    switchToDark: string;
    fontSize: string;
    fontSizeDesc: string;
    fontSizeCompact: string;
    fontSizeNormal: string;
    fontSizeLarge: string;
    fontSizeXLarge: string;
    fontSizePreview: string;
    numberFormat: string;
    numberFormatDesc: string;
    arabicNumbers: string;
    englishNumbers: string;
    monthlyBudget: string;
    currentBudget: string;
    saveBudget: string;
    clearBudget: string;
    change: string;
    noBudgetSet: string;
    allocatedPerMonth: string;
    accounts: string;
    addAccount: string;
    editAccount: string;
    addAccountModal: string;
    editAccountModal: string;
    accountName: string;
    accountType: string;
    openingBalance: string;
    themeColor: string;
    cash: string;
    bank: string;
    mobileWallet: string;
    creditCard: string;
    debitCard: string;
    savings: string;
    archive: string;
    unarchive: string;
    categories: string;
    addCategory: string;
    editCategory: string;
    categoryName: string;
    recurring: string;
    addRecurring: string;
    showWalletsOnHome: string;
    showWalletsOnHomeDesc: string;
    lockNow: string;
    frequency: string;
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
    dataStorage: string;
    exportCsv: string;
    importCsv: string;
    backupJson: string;
    restoreJson: string;
    restoreConfirmTitle: string;
    restoreConfirmDesc: string;
    restoreConfirmAction: string;
    resetData: string;
    confirmReset: string;
    confirmResetDesc: string;
    resetNow: string;
    cancel: string;
    offlineNotice: string;
    offlineDesc: string;
    color: string;
    icon: string;
    active: string;
    archived: string;
    delete: string;
    notifications: string;
    budgetAlert: string;
    budgetAlertDesc: string;
    security: string;
    biometricLock: string;
    biometricDesc: string;
    about: string;
    aboutDesc: string;
    version: string;
    processNow: string;
    recordNow: string;
  };
  onboarding: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    skip: string;
    next: string;
    start: string;
    currency: string;
    budget: string;
  };
  toasts: {
    expenseCreated: string;
    expenseUpdated: string;
    expenseDeleted: string;
    undo: string;
    expenseRestored: string;
    incomeCreated: string;
    incomeUpdated: string;
    transferCreated: string;
    settingsSaved: string;
    budgetUpdated: string;
    backupExported: string;
    backupRestored: string;
    csvExported: string;
    csvImported: string;
    invalidFile: string;
    accountSaved: string;
    accountArchived: string;
    accountUnarchived: string;
    categorySaved: string;
    categoryArchived: string;
    categoryUnarchived: string;
    recurringCreated: string;
    recurringDeleted: string;
    dataReset: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      transactions: 'Transactions',
      insights: 'Insights',
      settings: 'Settings',
      addExpense: 'Add',
    },
    home: {
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      dayOf: 'Day {day} of {total}',
      todaySpending: "Today's spending",
      transactionsLoggedToday_one: '{count} transaction logged today',
      transactionsLoggedToday_other: '{count} transactions logged today',
      dailyAverage: 'Daily average',
      overDays: 'over {days} days',
      thisMonth: 'This month',
      setBudget: 'Set budget',
      remaining: 'Remaining',
      dailyAllowance: 'Daily allowance',
      monthEndForecast: 'Month-end forecast',
      finalMonthSpending: 'Final Month Spending',
      of: 'of',
      netWorth: 'Total Across Wallets',
      assets: 'Money in Accounts',
      liabilities: 'Debts & Payables',
      transfer: 'Transfer',
      manage: 'Manage',
      debt: 'Debt',
      available: 'Available',
      trend7Days: '7-Day Trend',
      avgPerDay: 'avg / day',
      monthlyCategoryBreakdown: 'Monthly category breakdown',
      monthOverMonth: 'Month-over-month',
      recentTransactions: 'Recent Transactions',
      viewAll: 'View all',
      noTransactionsYet: 'No transactions logged yet',
      noTransactionsDesc: 'Tap + below to record your first expense or transfer.',
      paceWatch: 'Watch pace',
      paceOverBudget: 'Over budget',
      paceNoBudget: 'No budget',
    },
    transactions: {
      title: 'Transactions',
      searchPlaceholder: 'Search note, merchant, category...',
      filter: 'Filter',
      all: 'All',
      expenses: 'Expenses',
      income: 'Income',
      transfers: 'Transfers',
      today: 'Today',
      yesterday: 'Yesterday',
      noTransactionsFound: 'No transactions found',
      noMatchingFilters: 'Try adjusting your search or active filters.',
      resetFilters: 'Reset filters',
      clearFilters: 'Clear filters',
      filterTransactions: 'Filter Transactions',
      dateRange: 'Date Range',
      account: 'Account',
      category: 'Category',
      type: 'Transaction Type',
      minAmount: 'Min Amount',
      maxAmount: 'Max Amount',
      applyFilters: 'Apply Filters',
      sortBy: 'Sort By',
      newest: 'Newest Date',
      oldest: 'Oldest Date',
      highest: 'Highest Amount',
      lowest: 'Lowest Amount',
      clearAll: 'Clear All',
      from: 'From',
      to: 'To',
      amountRange: 'Amount Range',
      noLimit: 'No limit',
    },
    addExpense: {
      newExpense: 'Add',
      newIncome: 'New Income',
      newTransfer: 'New Transfer',
      editExpense: 'Edit Expense',
      editIncome: 'Edit Income',
      editTransfer: 'Edit Transfer',
      amount: 'Amount',
      category: 'Category',
      account: 'Account / Card',
      paidFrom: 'Paid From (Source)',
      depositedTo: 'Deposited To (Destination)',
      noteOptional: 'Note (Optional)',
      merchantOptional: 'Merchant or Payee (Optional)',
      date: 'Date',
      time: 'Time',
      saveExpense: 'Add',
      saveIncome: 'Save Income',
      saveTransfer: 'Save Transfer',
      update: 'Update Transaction',
      typeExpense: 'Expense',
      typeIncome: 'Income',
      typeTransfer: 'Transfer',
      showMore: 'Show more options',
      showLess: 'Show less',
      duplicateWarning: 'A similar expense was already recorded on this date.',
      discardConfirm: 'Discard unsaved changes?',
      discardDesc: 'You have entered details that will be lost.',
      keepEditing: 'Keep editing',
      discard: 'Discard',
      suggestedCategory: 'Suggested category',
      tapToApply: 'Tap to apply',
      fromAccount: 'From Account',
      toAccount: 'To Account',
      cancel: 'Cancel',
      save: 'Save',
    },
    detail: {
      title: 'Transaction Details',
      edit: 'Edit Transaction',
      editTransfer: 'Edit Transfer',
      delete: 'Delete',
      close: 'Close',
      amount: 'Amount',
      date: 'Date',
      time: 'Time',
      category: 'Category',
      account: 'Account',
      fromAccount: 'From Account',
      toAccount: 'To Account',
      merchant: 'Merchant / Payee',
      notes: 'Notes',
      type: 'Type',
      confirmDelete: 'Delete this transaction?',
      confirmDeleteDesc: 'Are you sure you want to delete this transaction? You can restore it immediately using Undo.',
    },
    insights: {
      title: 'Spending Intelligence',
      subtitle: 'Objective financial clarity without judgments.',
      totalSpending: 'Total Spending',
      vsPreviousMonth: 'vs Previous Month',
      topCategory: 'Top Category',
      largestExpense: 'Largest Transaction',
      largestTransaction: 'Largest Transaction',
      highestSpendingDay: 'Highest Spending Day',
      dailySpendingTrend: 'Daily Spending Trend',
      spendingByCategory: 'Spending by Category',
      spendingByAccount: 'Spending by Account',
      monthComparison: 'Month Comparison',
      noExpensesRecorded: 'No expenses recorded in {month}',
      previousMonth: 'Previous Month',
      nextMonth: 'Next Month',
      ofTotal: 'of total',
      whereDidMoneyGo: 'Where did your money go?',
      rankBreakdown: 'Ranked breakdown for',
      tapCategoryToView: 'Tap any category to view transactions',
      dailyActivityAcross: 'Daily activity across {days} days in {month}',
      dailyTrendTitle: 'Daily Spending Trend',
      dailyAverage: 'Daily average',
      transactionsCount: 'Transactions',
      loggedExpenses: 'logged expenses',
      totalSpent: 'Total Spent',
      highestDay: 'Highest Day',
      averageTransaction: 'Avg / Transaction',
      perTransaction: 'per transaction',
      spendingByAccountTitle: 'Spending by Account & Wallet',
      accountDistribution: 'Distribution across payment methods',
      sixMonthTrend: '6-Month Trend',
      historicalMonthlyTotals: 'Historical monthly spending totals',
      noDataForMonth: 'No data recorded for this month',
      noExpensesForMonthDesc: 'No expenses were logged for the selected period.',
      jumpToCurrentMonth: 'Jump to current month',
      addExpense: 'Add',
      current: 'Current',
      dayOf: 'Day {day} of {total}',
      calendarDays: 'calendar days',
      singleLargest: 'Single largest item',
      txns: 'txns',
      avg: 'avg',
      noPrevData: 'No previous data',
      firstPeriod: 'First tracked period',
      catModalTotal: 'Total',
      catModalShare: 'Share',
      catModalAverage: 'Average',
      catModalLargest: 'Largest',
      catModalTxns: 'Transactions',
      catModalDateTime: 'Date & Time',
      catModalEmpty: 'No transactions for this category in the selected period.',
    },
    settings: {
      title: 'Settings & Preferences',
      subtitle: 'Personalize your spending intelligence and manage your local data.',
      preferences: 'Preferences',
      currency: 'Currency',
      currencyDesc: 'All transaction inputs and reports will use this currency.',
      language: 'Language',
      english: 'English',
      arabic: 'العربية',
      theme: 'Theme',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      lightActive: 'Light theme active',
      darkActive: 'Dark theme active',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      fontSize: 'Text Size & Display',
      fontSizeDesc: 'Adjust text scaling for optimal reading comfort across all screens.',
      fontSizeCompact: 'Compact (90%)',
      fontSizeNormal: 'Standard (100%)',
      fontSizeLarge: 'Large (110%)',
      fontSizeXLarge: 'Extra Large (120%)',
      fontSizePreview: 'Preview: Expense of 150 EGP recorded.',
      numberFormat: 'Numeral System',
      numberFormatDesc: 'Choose whether numbers appear in Arabic digits (١٢٣) or English digits (123).',
      arabicNumbers: 'Arabic (١٢٣)',
      englishNumbers: 'English (123)',
      monthlyBudget: 'Monthly Budget',
      currentBudget: 'Current Budget',
      saveBudget: 'Save Budget',
      clearBudget: 'Clear Budget',
      change: 'Change',
      noBudgetSet: 'No budget set',
      allocatedPerMonth: 'Allocated per calendar month',
      accounts: 'Accounts & Wallets',
      addAccount: 'Add Account',
      editAccount: 'Edit Account',
      addAccountModal: 'Add New Account',
      editAccountModal: 'Edit Account',
      accountName: 'Account Name',
      accountType: 'Account Type',
      openingBalance: 'Opening Balance',
      themeColor: 'Theme Color',
      cash: 'Cash',
      bank: 'Bank Account',
      mobileWallet: 'Mobile Wallet',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      savings: 'Savings',
      archive: 'Archive',
      unarchive: 'Unarchive',
      categories: 'Categories',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      categoryName: 'Category Name',
      recurring: 'Recurring Transactions',
      addRecurring: 'Add Transaction',
      showWalletsOnHome: 'Show Wallets on Home',
      showWalletsOnHomeDesc: 'Display wallet balances on your home dashboard',
      lockNow: 'Lock App Now',
      frequency: 'Frequency',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      dataStorage: 'Data & Storage',
      exportCsv: 'Export CSV',
      importCsv: 'Import CSV',
      backupJson: 'Full Backup (JSON)',
      restoreJson: 'Restore Backup (JSON)',
      restoreConfirmTitle: 'Restore Full JSON Backup',
      restoreConfirmDesc: 'Restoring from a backup will overwrite your current ledger, accounts, categories, and settings with the data in this backup file. Are you sure you want to proceed?',
      restoreConfirmAction: 'Restore Backup',
      resetData: 'Reset All Data',
      confirmReset: 'Reset All Application Data',
      confirmResetDesc: 'This action will permanently delete all expenses, accounts, and categories.',
      resetNow: 'Reset Everything',
      cancel: 'Cancel',
      offlineNotice: '100% Offline & Private',
      offlineDesc: 'All your financial records are stored securely on this device only.',
      color: 'Color',
      icon: 'Icon',
      active: 'Active',
      archived: 'Archived',
      delete: 'Delete',
      notifications: 'Notifications & Alerts',
      budgetAlert: 'Budget Threshold Alert',
      budgetAlertDesc: 'Notify when monthly spending exceeds 80%',
      security: 'Security',
      biometricLock: 'Biometric / Passcode Lock',
      biometricDesc: 'Require authentication when opening the app.',
      about: 'About Daily Expense',
      aboutDesc: 'Privacy-focused offline expense intelligence app.',
      version: 'Version',
      processNow: 'Process now',
      recordNow: 'Record now',
    },
    onboarding: {
      step1Title: 'Track spending in seconds',
      step1Desc: 'Record an expense in 2–5 seconds with minimal keystrokes. Instant calculation with zero friction.',
      step2Title: 'Understand where money goes',
      step2Desc: 'Gain clarity on category breakdowns, daily pace, and month-over-month shifts automatically.',
      step3Title: 'Stay comfortably within budget',
      step3Desc: 'Real-time daily allowances and non-judgmental spending pace alerts keep you ahead of month end.',
      skip: 'Skip',
      next: 'Next',
      start: 'Start Tracking',
      currency: 'Your Currency',
      budget: 'Monthly Spending Budget',
    },
    toasts: {
      expenseCreated: 'Expense recorded successfully',
      expenseUpdated: 'Expense updated',
      expenseDeleted: 'Expense deleted',
      undo: 'Undo',
      expenseRestored: 'Expense restored',
      incomeCreated: 'Income recorded successfully',
      incomeUpdated: 'Income updated',
      transferCreated: 'Transfer completed successfully',
      settingsSaved: 'Settings saved',
      budgetUpdated: 'Monthly budget updated',
      backupExported: 'Backup exported successfully',
      backupRestored: 'Backup restored successfully',
      csvExported: 'CSV exported successfully',
      csvImported: 'CSV imported successfully',
      invalidFile: 'Invalid backup file format',
      accountSaved: 'Account saved successfully',
      accountArchived: 'Account archived',
      accountUnarchived: 'Account unarchived',
      categorySaved: 'Category saved successfully',
      categoryArchived: 'Category archived',
      categoryUnarchived: 'Category unarchived',
      recurringCreated: 'Recurring transaction scheduled',
      recurringDeleted: 'Recurring transaction removed',
      dataReset: 'All application data reset',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      transactions: 'المعاملات',
      insights: 'التحليلات',
      settings: 'الإعدادات',
      addExpense: 'إضافة',
    },
    home: {
      goodMorning: 'صباح الخير',
      goodAfternoon: 'مساء الخير',
      goodEvening: 'مساء الخير',
      dayOf: 'اليوم {day} من {total}',
      todaySpending: 'صرفت اليوم',
      transactionsLoggedToday_one: 'حركة واحدة اليوم',
      transactionsLoggedToday_other: '{count} حركات اليوم',
      dailyAverage: 'المعدل اليومي',
      overDays: 'خلال {days} يوماً',
      thisMonth: 'هذا الشهر',
      setBudget: 'تحديد الميزانية',
      remaining: 'المتبقي في الميزانية',
      dailyAllowance: 'المتاح لك اليوم',
      monthEndForecast: 'التوقع لنهاية الشهر',
      finalMonthSpending: 'إجمالي إنفاق الشهر المتوقع',
      of: 'من',
      netWorth: 'إجمالي رصيدك',
      assets: 'أموالك ومحافظك',
      liabilities: 'ديون ومستحقات',
      transfer: 'تحويل',
      manage: 'إدارة',
      debt: 'مستحق',
      available: 'متاح',
      trend7Days: 'اتجاه الإنفاق (7 أيام)',
      avgPerDay: 'متوسط / يوم',
      monthlyCategoryBreakdown: 'تفصيل الفئات لهذا الشهر',
      monthOverMonth: 'مقارنة بالشهر السابق',
      recentTransactions: 'أحدث الحركات',
      viewAll: 'عرض الكل',
      noTransactionsYet: 'لا توجد حركات بعد',
      noTransactionsDesc: 'اضغط على + بالأسفل لتسجيل أول حركة.',
      paceWatch: 'انتبه للوتيرة',
      paceOverBudget: 'تجاوزت الميزانية',
      paceNoBudget: 'لا توجد ميزانية',
    },
    transactions: {
      title: 'المعاملات',
      searchPlaceholder: 'ابحث في الملاحظات، الفئات، المتاجر...',
      filter: 'تصفية',
      all: 'الكل',
      expenses: 'المصاريف',
      income: 'الدخل',
      transfers: 'التحويلات',
      today: 'اليوم',
      yesterday: 'أمس',
      noTransactionsFound: 'لا توجد معاملات مطابقة',
      noMatchingFilters: 'جرّب تعديل البحث أو الفلاتر النشطة.',
      resetFilters: 'إعادة ضبط الفلاتر',
      clearFilters: 'مسح الفلاتر',
      filterTransactions: 'تصفية المعاملات',
      dateRange: 'النطاق الزمني',
      account: 'الحساب',
      category: 'الفئة',
      type: 'نوع المعاملة',
      minAmount: 'الحد الأدنى',
      maxAmount: 'الحد الأقصى',
      applyFilters: 'تطبيق التصفية',
      sortBy: 'الترتيب',
      newest: 'الأحدث أولاً',
      oldest: 'الأقدم أولاً',
      highest: 'الأعلى مبلغاً',
      lowest: 'الأقل مبلغاً',
      clearAll: 'مسح الكل',
      from: 'من',
      to: 'إلى',
      amountRange: 'نطاق المبلغ',
      noLimit: 'بلا حد',
    },
    addExpense: {
      newExpense: 'إضافة',
      newIncome: 'دخل جديد',
      newTransfer: 'تحويل جديد',
      editExpense: 'تعديل المصروف',
      editIncome: 'تعديل الدخل',
      editTransfer: 'تعديل التحويل',
      amount: 'المبلغ',
      category: 'الفئة',
      account: 'الحساب / البطاقة',
      paidFrom: 'الدفع من (حساب المصدر)',
      depositedTo: 'الإيداع في (حساب الوجهة)',
      noteOptional: 'ملاحظة (اختياري)',
      merchantOptional: 'المتجر أو المستفيد (اختياري)',
      date: 'التاريخ',
      time: 'الوقت',
      saveExpense: 'إضافة',
      saveIncome: 'حفظ الدخل',
      saveTransfer: 'إتمام التحويل',
      update: 'تحديث المعاملة',
      typeExpense: 'مصروف',
      typeIncome: 'دخل',
      typeTransfer: 'تحويل',
      showMore: 'خيارات إضافية',
      showLess: 'خيارات أقل',
      duplicateWarning: 'تم تسجيل معاملة مطابقة بنفس التفاصيل في هذا اليوم.',
      discardConfirm: 'تجاهل التغييرات؟',
      discardDesc: 'لديك تفاصيل غير محفوظة سيتم فقدانها.',
      keepEditing: 'متابعة التعديل',
      discard: 'تجاهل',
      suggestedCategory: 'فئة مقترحة',
      tapToApply: 'اضغط للتطبيق',
      fromAccount: 'حساب المصدر',
      toAccount: 'حساب الوجهة',
      cancel: 'إلغاء',
      save: 'حفظ',
    },
    detail: {
      title: 'تفاصيل المعاملة',
      edit: 'تعديل المعاملة',
      editTransfer: 'تعديل التحويل',
      delete: 'حذف',
      close: 'إغلاق',
      amount: 'المبلغ',
      date: 'التاريخ',
      time: 'الوقت',
      category: 'الفئة',
      account: 'الحساب',
      fromAccount: 'حساب المصدر',
      toAccount: 'حساب الوجهة',
      merchant: 'المتجر / المستفيد',
      notes: 'الملاحظات',
      type: 'النوع',
      confirmDelete: 'حذف هذه المعاملة؟',
      confirmDeleteDesc: 'هل أنت متأكد من حذف هذه المعاملة نهائياً؟ يمكنك التراجع فوراً عبر زر التراجع.',
    },
    insights: {
      title: 'ذكاء الإنفاق',
      subtitle: 'رؤية مالية واضحة وموضوعية بدون أحكام مسبقة.',
      totalSpending: 'إجمالي الإنفاق',
      vsPreviousMonth: 'مقارنة بالشهر السابق',
      topCategory: 'أعلى فئة إنفاق',
      largestExpense: 'أكبر معاملة',
      largestTransaction: 'أكبر معاملة',
      highestSpendingDay: 'اليوم الأعلى إنفاقاً',
      dailySpendingTrend: 'معدل الإنفاق اليومي',
      spendingByCategory: 'الإنفاق حسب الفئة',
      spendingByAccount: 'الإنفاق حسب الحساب',
      monthComparison: 'مقارنة الشهور',
      noExpensesRecorded: 'لا توجد مصاريف مسجلة في {month}',
      previousMonth: 'الشهر السابق',
      nextMonth: 'الشهر التالي',
      ofTotal: 'من الإجمالي',
      whereDidMoneyGo: 'أين ذهبت أموالك؟',
      rankBreakdown: 'الترتيب التنازلي لمصاريف',
      tapCategoryToView: 'اضغط لاستعراض المعاملات',
      dailyActivityAcross: 'النشاط اليومي عبر {days} يوماً في شهر {month}',
      dailyTrendTitle: 'اتجاه الإنفاق اليومي',
      dailyAverage: 'المتوسط اليومي',
      transactionsCount: 'المعاملات',
      loggedExpenses: 'مصاريف مسجلة',
      totalSpent: 'إجمالي المصروف',
      highestDay: 'أعلى يوم',
      averageTransaction: 'المتوسط',
      perTransaction: 'لكل معاملة',
      spendingByAccountTitle: 'الإنفاق حسب الحساب والمحفظة',
      accountDistribution: 'توزيع الإنفاق عبر وسائل الدفع',
      sixMonthTrend: 'اتجاه 6 أشهر',
      historicalMonthlyTotals: 'سجل إجمالي المصاريف الشهرية',
      noDataForMonth: 'لا توجد بيانات مسجلة لهذا الشهر',
      noExpensesForMonthDesc: 'لم يتم تسجيل أي مصاريف في هذه الفترة.',
      jumpToCurrentMonth: 'الانتقال للشهر الحالي',
      addExpense: 'إضافة',
      current: 'الحالي',
      dayOf: 'اليوم {day} من {total}',
      calendarDays: 'أيام الشهر',
      singleLargest: 'أعلى معاملة فردية',
      txns: 'معاملات',
      avg: 'المتوسط',
      noPrevData: 'لا توجد بيانات سابقة',
      firstPeriod: 'الفترة الأولى المسجلة',
      catModalTotal: 'الإجمالي',
      catModalShare: 'النسبة',
      catModalAverage: 'المتوسط',
      catModalLargest: 'الأكبر',
      catModalTxns: 'المعاملات',
      catModalDateTime: 'التاريخ والوقت',
      catModalEmpty: 'لا توجد معاملات لهذه الفئة في الفترة المحددة.',
    },
    settings: {
      title: 'الإعدادات والتفضيلات',
      subtitle: 'تخصيص تجربة تتبع المصاريف وإدارة البيانات المحلية.',
      preferences: 'التفضيلات',
      currency: 'العملة',
      currencyDesc: 'تُستخدم هذه العملة في كافة المعاملات والتقارير.',
      language: 'اللغة',
      english: 'English',
      arabic: 'العربية',
      theme: 'المظهر',
      lightMode: 'الوضع الفاتح',
      darkMode: 'الوضع الداكن',
      lightActive: 'الوضع الفاتح مفعل',
      darkActive: 'الوضع الداكن مفعل',
      switchToLight: 'التبديل إلى الوضع الفاتح',
      switchToDark: 'التبديل إلى الوضع الداكن',
      fontSize: 'حجم الخط والتكبير',
      fontSizeDesc: 'ضبط حجم ونصوص التطبيق بما يوفر أفضل قراءة وراحة للعين.',
      fontSizeCompact: 'مدمج (90%)',
      fontSizeNormal: 'قياسي (100%)',
      fontSizeLarge: 'كبير (110%)',
      fontSizeXLarge: 'كبير جداً (120%)',
      fontSizePreview: 'معاينة: تم تسجيل مصروف بقيمة 150 ج.م.',
      numberFormat: 'نظام الأرقام',
      numberFormatDesc: 'اختيار عرض الأرقام بالأرقام العربية (١٢٣) أو الأرقام الإنجليزية (123).',
      arabicNumbers: 'أرقام عربية (١٢٣)',
      englishNumbers: 'أرقام إنجليزية (123)',
      monthlyBudget: 'الميزانية الشهرية',
      currentBudget: 'الميزانية الحالية',
      saveBudget: 'حفظ الميزانية',
      clearBudget: 'إلغاء الميزانية',
      change: 'تغيير',
      noBudgetSet: 'لم يتم تحديد ميزانية',
      allocatedPerMonth: 'مخصصة لكل شهر ميلادي',
      accounts: 'الحسابات والمحافظ',
      addAccount: 'إضافة حساب',
      editAccount: 'تعديل الحساب',
      addAccountModal: 'إضافة حساب جديد',
      editAccountModal: 'تعديل الحساب',
      accountName: 'اسم الحساب',
      accountType: 'نوع الحساب',
      openingBalance: 'الرصيد الافتتاحي',
      themeColor: 'لون المحفظة',
      cash: 'نقدي (كاش)',
      bank: 'حساب بنكي',
      mobileWallet: 'محفظة إلكترونية',
      creditCard: 'بطاقة ائتمانية',
      debitCard: 'بطاقة خصم مباشر',
      savings: 'حساب توفير',
      archive: 'أرشفة',
      unarchive: 'إلغاء الأرشفة',
      categories: 'فئات المصاريف',
      addCategory: 'إضافة فئة',
      editCategory: 'تعديل الفئة',
      categoryName: 'اسم الفئة',
      recurring: 'المعاملات المتكررة',
      addRecurring: 'إضافة معاملة',
      showWalletsOnHome: 'إظهار المحافظ في الرئيسية',
      showWalletsOnHomeDesc: 'عرض أرصدة الحسابات والمحافظ في الشاشة الرئيسية',
      lockNow: 'قفل التطبيق الآن',
      frequency: 'التكرار',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      yearly: 'سنوي',
      dataStorage: 'البيانات والنسخ الاحتياطي',
      exportCsv: 'تصدير كملف CSV',
      importCsv: 'استيراد من CSV',
      backupJson: 'نسخة احتياطية كاملة (JSON)',
      restoreJson: 'استعادة نسخة احتياطية (JSON)',
      restoreConfirmTitle: 'استعادة النسخة الاحتياطية (JSON)',
      restoreConfirmDesc: 'ستؤدي الاستعادة إلى استبدال كافة البيانات الحالية، الحسابات، الفئات والإعدادات بالبيانات الموجودة في ملف النسخة الاحتياطية. هل تريد المتابعة؟',
      restoreConfirmAction: 'استعادة النسخة',
      resetData: 'إعادة ضبط كافة البيانات',
      confirmReset: 'إعادة تعيين كافة البيانات',
      confirmResetDesc: 'سيؤدي هذا الإجراء لحذف كافة المعاملات والحسابات والفئات المسجلة نهائياً.',
      resetNow: 'إعادة ضبط الآن',
      cancel: 'إلغاء',
      offlineNotice: 'يعمل محلياً وبخصوصية 100%',
      offlineDesc: 'جميع سجلاتك المالية مخزنة بأمان على هذا الجهاز فقط ولا تغادره مطلقاً.',
      color: 'اللون',
      icon: 'الأيقونة',
      active: 'نشط',
      archived: 'مؤرشف',
      delete: 'حذف',
      notifications: 'التنبيهات والإشعارات',
      budgetAlert: 'تنبيه تجاوز الميزانية',
      budgetAlertDesc: 'تنبيهك عند وصول الإنفاق إلى 80% من الميزانية',
      security: 'الأمان والقفل',
      biometricLock: 'قفل التطبيق بالبصمة / الرمز',
      biometricDesc: 'طلب المصادقة عند فتح التطبيق.',
      about: 'حول مصروفي (Daily Expense)',
      aboutDesc: 'تطبيق ذكي لإدارة وتتبع المصاريف بخصوصية تامة ودون اتصال.',
      version: 'الإصدار',
      processNow: 'تسجيل الآن',
      recordNow: 'تسجيل الآن',
    },
    onboarding: {
      step1Title: 'تتبع مصاريفك في ثوانٍ',
      step1Desc: 'سجّل أي مصروف خلال ثانيتين إلى خمس ثوانٍ بأقل مجهود وبحسابات فورية.',
      step2Title: 'افهم أين تذهب أموالك',
      step2Desc: 'تعرّف بوضوح على توزيع الفئات، ومعدل الصرف اليومي، والمقارنات الشهرية تلقائياً.',
      step3Title: 'التزم بميزانيتك بأمان',
      step3Desc: 'معدلات الصرف الآمنة يومياً وتنبيهات وتيرة الإنفاق تبقيك متقدماً قبل نهاية الشهر.',
      skip: 'تخطي',
      next: 'التالي',
      start: 'ابدأ التتبع',
      currency: 'العملة المفضلة',
      budget: 'ميزانية الإنفاق الشهري',
    },
    toasts: {
      expenseCreated: 'تم تسجيل المصروف بنجاح',
      expenseUpdated: 'تم تحديث المصروف',
      expenseDeleted: 'تم حذف المصروف',
      undo: 'تراجع',
      expenseRestored: 'تمت استعادة المصروف',
      incomeCreated: 'تم تسجيل الدخل بنجاح',
      incomeUpdated: 'تم تحديث الدخل',
      transferCreated: 'تم التحويل بين الحسابات بنجاح',
      settingsSaved: 'تم حفظ الإعدادات',
      budgetUpdated: 'تم تحديث الميزانية الشهرية',
      backupExported: 'تم تصدير النسخة الاحتياطية بنجاح',
      backupRestored: 'تمت استعادة البيانات بنجاح',
      csvExported: 'تم تصدير ملف CSV بنجاح',
      csvImported: 'تم استيراد ملف CSV بنجاح',
      invalidFile: 'صيغة ملف النسخة الاحتياطية غير صالحة',
      accountSaved: 'تم حفظ الحساب بنجاح',
      accountArchived: 'تم أرشفة الحساب',
      accountUnarchived: 'تم إلغاء أرشفة الحساب',
      categorySaved: 'تم حفظ الفئة بنجاح',
      categoryArchived: 'تم أرشفة الفئة',
      categoryUnarchived: 'تم إلغاء أرشفة الفئة',
      recurringCreated: 'تمت جدولة المعاملة المتكررة',
      recurringDeleted: 'تم حذف المعاملة المتكررة',
      dataReset: 'تمت إعادة ضبط كافة البيانات',
    },
  },
};

// Default Category translations in Arabic
const DEFAULT_CATEGORY_NAMES_AR: Record<string, string> = {
  'Food': 'طعام ومشروبات',
  'Food & Dining': 'طعام ومشروبات',
  'Groceries': 'بقالة وتموين',
  'Transportation': 'مواصلات ونقل',
  'Housing & Rent': 'سكن وإيجار',
  'Bills': 'فواتير وخدمات',
  'Utilities & Bills': 'فواتير وخدمات',
  'Entertainment': 'ترفيه ونزهات',
  'Health': 'صحة وأدوية',
  'Health & Medical': 'صحة وأدوية',
  'Shopping': 'تسوق ومشتريات',
  'Education': 'تعليم ودراسة',
  'Personal': 'شخصي وعناية',
  'Travel': 'سفر ورحلات',
  'Investments': 'أرباح واستثمارات',
  'Salary': 'راتب شهري',
  'Freelance': 'عمل حر / فريلانس',
  'Bonus': 'مكافأة أو حافز',
  'Sales': 'مبيعات وتجارة',
  'Gift': 'هدية',
  'Other Income': 'دخل إضافي',
  'Transfer': 'تحويل',
  'Other': 'أخرى',
};

// Default Account translations in Arabic
const DEFAULT_ACCOUNT_NAMES_AR: Record<string, string> = {
  'Cash': 'نقدية (كاش)',
  'Debit Card': 'بطاقة خصم مباشر',
  'Credit Card': 'بطاقة اائتمانية',
  'Bank Account': 'حساب بنكي',
  'Mobile Wallet': 'محفظة إلكترونية',
  'Savings': 'حساب توفير',
  'Main Bank': 'البنك الرئيسي',
};

export function getCategoryDisplayName(name: string, lang: Language): string {
  if (lang === 'ar' && DEFAULT_CATEGORY_NAMES_AR[name]) {
    return DEFAULT_CATEGORY_NAMES_AR[name];
  }
  return name;
}

export function getAccountDisplayName(name: string, lang: Language): string {
  if (lang === 'ar' && DEFAULT_ACCOUNT_NAMES_AR[name]) {
    return DEFAULT_ACCOUNT_NAMES_AR[name];
  }
  return name;
}

export function getAccountTypeDisplayName(type: string, lang: Language): string {
  if (lang === 'ar') {
    switch (type) {
      case 'cash': return 'نقدي (كاش)';
      case 'bank': return 'حساب بنكي';
      case 'debit_card': return 'بطاقة خصم مباشر';
      case 'credit_card': return 'بطاقة ائتمانية';
      case 'mobile_wallet': return 'محفظة إلكترونية';
      case 'savings': return 'حساب توفير';
      case 'other': return 'أخرى';
      default: return type;
    }
  }
  switch (type) {
    case 'cash': return 'Cash';
    case 'bank': return 'Bank Account';
    case 'debit_card': return 'Debit Card';
    case 'credit_card': return 'Credit Card';
    case 'mobile_wallet': return 'Mobile Wallet';
    case 'savings': return 'Savings';
    case 'other': return 'Other';
    default: return type;
  }
}

export function getFrequencyDisplayName(freq: string, lang: Language): string {
  if (lang === 'ar') {
    switch (freq) {
      case 'daily': return 'يومي';
      case 'weekly': return 'أسبوعي';
      case 'monthly': return 'شهري';
      case 'yearly': return 'سنوي';
      default: return freq;
    }
  }
  switch (freq) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'yearly': return 'Yearly';
    default: return freq;
  }
}

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ENGLISH_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ARABIC_DAYS_SHORT = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
export const ENGLISH_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatDayShort(dayIdx: number, lang: Language): string {
  const idx = ((dayIdx % 7) + 7) % 7;
  return lang === 'ar' ? ARABIC_DAYS_SHORT[idx] : ENGLISH_DAYS_SHORT[idx];
}

function toArabicDigits(val: string | number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(val).replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

export function formatMonthLabel(monthPrefix: string, lang: Language): string {
  const parts = monthPrefix.split('-');
  if (parts.length < 2) return monthPrefix;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return monthPrefix;

  if (lang === 'ar') {
    const displayYear = toArabicDigits(year);
    return `${ARABIC_MONTHS[monthIdx]} ${displayYear}`;
  }
  return `${ENGLISH_MONTHS[monthIdx]} ${year}`;
}

export function formatMonthShortLabel(monthPrefix: string, lang: Language): string {
  const parts = monthPrefix.split('-');
  if (parts.length < 2) return monthPrefix;
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return monthPrefix;

  if (lang === 'ar') {
    return ARABIC_MONTHS[monthIdx];
  }
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthsShort[monthIdx] || parts[1];
}

export function formatDateLabel(dateStr: string, lang: Language): string {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, monthIdx, day);

  if (lang === 'ar') {
    const dayName = ARABIC_DAYS[d.getDay()];
    const monthName = ARABIC_MONTHS[monthIdx];
    const displayDay = toArabicDigits(day);
    return `${dayName}، ${displayDay} ${monthName}`;
  }
  const dayName = ENGLISH_DAYS[d.getDay()];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayName}, ${day} ${monthsShort[monthIdx]}`;
}
