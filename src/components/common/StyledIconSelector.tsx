import React from 'react';
import { PRESET_STYLED_ICONS } from '../../utils/iconPresets';
import { CategoryIcon } from './CategoryIcon';

interface StyledIconSelectorProps {
  selectedIcon: string;
  selectedColor?: string;
  onSelect: (icon: string, color: string) => void;
  language?: string;
}

export const StyledIconSelector: React.FC<StyledIconSelectorProps> = ({
  selectedIcon,
  selectedColor,
  onSelect,
  language = 'ar',
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
        {language === 'ar' ? 'اختر أيقونة الفئة / المحفظة:' : 'Choose Icon & Color:'}
      </label>
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
        {PRESET_STYLED_ICONS.map(item => {
          const isSelected = selectedIcon === item.icon || (selectedColor && selectedColor === item.color && selectedIcon === item.icon);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.icon, item.color)}
              title={language === 'ar' ? item.nameAr : item.nameEn}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer relative ${
                isSelected
                  ? 'scale-110 shadow-sm ring-2 ring-blue-600 dark:ring-blue-400 bg-white dark:bg-slate-700'
                  : 'hover:bg-white/80 dark:hover:bg-slate-700/60 opacity-85 hover:opacity-100'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-2xs"
                style={{ backgroundColor: item.color }}
              >
                <CategoryIcon name={item.icon} color="#FFFFFF" size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
