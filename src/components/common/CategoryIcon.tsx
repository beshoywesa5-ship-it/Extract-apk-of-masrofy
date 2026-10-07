import React from 'react';
import { 
  Utensils, 
  ShoppingCart, 
  Car, 
  Receipt, 
  ShoppingBag, 
  HeartPulse, 
  Film, 
  GraduationCap, 
  User, 
  MoreHorizontal,
  Coffee,
  Home,
  Tv,
  Briefcase,
  Plane,
  Gift,
  Smartphone,
  Dumbbell,
  CreditCard,
  Banknote,
  Laptop,
  TrendingUp,
  Award,
  PlusCircle
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  color = '#2563EB',
  size = 20,
  className = '',
  showBackground = false,
}) => {
  const getIcon = () => {
    switch (name) {
      case 'Utensils': return <Utensils size={size} />;
      case 'ShoppingCart': return <ShoppingCart size={size} />;
      case 'Car': return <Car size={size} />;
      case 'Receipt': return <Receipt size={size} />;
      case 'ShoppingBag': return <ShoppingBag size={size} />;
      case 'HeartPulse': return <HeartPulse size={size} />;
      case 'Film': return <Film size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'User': return <User size={size} />;
      case 'Coffee': return <Coffee size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Tv': return <Tv size={size} />;
      case 'Briefcase': return <Briefcase size={size} />;
      case 'Plane': return <Plane size={size} />;
      case 'Gift': return <Gift size={size} />;
      case 'Smartphone': return <Smartphone size={size} />;
      case 'Dumbbell': return <Dumbbell size={size} />;
      case 'CreditCard': return <CreditCard size={size} />;
      case 'Banknote': return <Banknote size={size} />;
      case 'Laptop': return <Laptop size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Award': return <Award size={size} />;
      case 'PlusCircle': return <PlusCircle size={size} />;
      default: return <MoreHorizontal size={size} />;
    }
  };

  if (!showBackground) {
    return (
      <span style={{ color }} className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {getIcon()}
      </span>
    );
  }

  return (
    <div
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
      className={`inline-flex items-center justify-center rounded-xl p-2.5 shrink-0 ${className}`}
    >
      {getIcon()}
    </div>
  );
};
