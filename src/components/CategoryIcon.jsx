import {
  Utensils,
  Home,
  Car,
  Zap,
  Film,
  Activity,
  ShoppingBag,
  BookOpen,
  Plane,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Gift,
  PlusCircle,
  HelpCircle,
} from 'lucide-react'

const ICON_MAP = {
  Utensils,
  Home,
  Car,
  Zap,
  Film,
  Activity,
  ShoppingBag,
  BookOpen,
  Plane,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Gift,
  PlusCircle,
}

export default function CategoryIcon({ iconName, size = 18, className = '' }) {
  const IconComponent = ICON_MAP[iconName] || HelpCircle
  return <IconComponent size={size} className={className} />
}
