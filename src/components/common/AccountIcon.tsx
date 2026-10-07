import React from 'react';
import { 
  Banknote, 
  CreditCard, 
  Landmark, 
  Smartphone, 
  PiggyBank, 
  Wallet,
  ArrowLeftRight
} from 'lucide-react';
import { AccountType } from '../../types';

interface AccountIconProps {
  type?: AccountType | string;
  name?: string;
  color?: string;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export const AccountIcon: React.FC<AccountIconProps> = ({
  type = 'other',
  name,
  color = '#3B82F6',
  size = 18,
  className = '',
  showBackground = false,
}) => {
  const getIcon = () => {
    switch (name || type) {
      case 'cash':
      case 'Banknote':
        return <Banknote size={size} />;
      case 'bank':
      case 'Landmark':
      case 'Building2':
        return <Landmark size={size} />;
      case 'credit_card':
      case 'debit_card':
      case 'card':
      case 'CreditCard':
        return <CreditCard size={size} />;
      case 'mobile_wallet':
      case 'Smartphone':
        return <Smartphone size={size} />;
      case 'savings':
      case 'PiggyBank':
        return <PiggyBank size={size} />;
      case 'transfer':
      case 'ArrowLeftRight':
        return <ArrowLeftRight size={size} />;
      case 'wallet':
      default:
        return <Wallet size={size} />;
    }
  };

  if (showBackground) {
    return (
      <div 
        className={`inline-flex items-center justify-center rounded-xl transition-all ${className}`}
        style={{ 
          backgroundColor: `${color}18`,
          color: color,
        }}
      >
        {getIcon()}
      </div>
    );
  }

  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ color }}
    >
      {getIcon()}
    </span>
  );
};
