import { Badge } from "@/components/ui/badge";
import { Wrench, Briefcase, Truck, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const { language } = useLanguage();
  
  const getRoleConfig = (role: string) => {
    switch (role.toLowerCase()) {
      case 'tecnico':
      case 'técnico':
        return {
          label: language === 'es' ? 'Técnico' : 'Technical',
          icon: Wrench,
          style: "bg-blue-500/20 text-blue-300 border-blue-500/30"
        };
      case 'compras':
        return {
          label: language === 'es' ? 'Compras' : 'Purchasing',
          icon: Briefcase,
          style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
      case 'logistica':
      case 'logística':
        return {
          label: language === 'es' ? 'Logística' : 'Logistics',
          icon: Truck,
          style: "bg-amber-500/20 text-amber-300 border-amber-500/30"
        };
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          style: "bg-purple-500/20 text-purple-300 border-purple-500/30"
        };
      default:
        return {
          label: role,
          icon: null,
          style: "bg-slate-500/20 text-slate-300 border-slate-500/30"
        };
    }
  };
  
  const config = getRoleConfig(role);
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${config.style} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </Badge>
  );
}
