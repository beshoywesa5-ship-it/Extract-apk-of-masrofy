export interface StyledIconChoice {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
}

export const PRESET_STYLED_ICONS: StyledIconChoice[] = [
  { id: 'food', nameAr: 'طعام ومشروبات', nameEn: 'Food & Drinks', icon: 'Utensils', color: '#EF4444' },
  { id: 'groceries', nameAr: 'سوبرماركت', nameEn: 'Groceries', icon: 'ShoppingCart', color: '#F97316' },
  { id: 'transport', nameAr: 'مواصلات وبنزين', nameEn: 'Transport', icon: 'Car', color: '#3B82F6' },
  { id: 'bills', nameAr: 'فواتير وكهرباء', nameEn: 'Bills & Utilities', icon: 'Receipt', color: '#EAB308' },
  { id: 'shopping', nameAr: 'تسوق وملابس', nameEn: 'Shopping', icon: 'ShoppingBag', color: '#8B5CF6' },
  { id: 'health', nameAr: 'صحة وعلاج', nameEn: 'Health & Pharmacy', icon: 'HeartPulse', color: '#EC4899' },
  { id: 'entertainment', nameAr: 'ترفيه وخروجات', nameEn: 'Entertainment', icon: 'Film', color: '#06B6D4' },
  { id: 'education', nameAr: 'تعليم وكورسات', nameEn: 'Education', icon: 'GraduationCap', color: '#10B981' },
  { id: 'personal', nameAr: 'شخصي', nameEn: 'Personal', icon: 'User', color: '#6366F1' },
  { id: 'cash', nameAr: 'كاش ونقد', nameEn: 'Cash', icon: 'Banknote', color: '#10B981' },
  { id: 'card', nameAr: 'بطاقة وفيزا', nameEn: 'Card', icon: 'CreditCard', color: '#2563EB' },
  { id: 'bank', nameAr: 'حساب بنكي', nameEn: 'Bank', icon: 'Landmark', color: '#0284C7' },
  { id: 'wallet', nameAr: 'محفظة إلكترونية', nameEn: 'Mobile Wallet', icon: 'Smartphone', color: '#EA580C' },
  { id: 'savings', nameAr: 'مدخرات', nameEn: 'Savings', icon: 'PiggyBank', color: '#059669' },
  { id: 'salary', nameAr: 'راتب ودخل', nameEn: 'Salary', icon: 'Briefcase', color: '#059669' },
  { id: 'freelance', nameAr: 'عمل حر', nameEn: 'Freelance', icon: 'Laptop', color: '#4F46E5' },
  { id: 'gift', nameAr: 'هدايا ومكافآت', nameEn: 'Gifts', icon: 'Gift', color: '#D946EF' },
  { id: 'tag', nameAr: 'عام وأخرى', nameEn: 'General', icon: 'Tag', color: '#64748B' },
];
