
import { Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReputationBadgeProps {
  score: number;
  reviews?: number;
  verified?: boolean;
  showStars?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ReputationBadge({ 
  score, 
  reviews, 
  verified = false, 
  showStars = true,
  className,
  size = "md"
}: ReputationBadgeProps) {
  
  const starCount = Math.round(score);
  const stars = Array(5).fill(0).map((_, i) => i < starCount);

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const starSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {verified && (
        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20">
          <ShieldCheck className={cn("mr-1", starSizeClasses[size])} />
          Verificado
        </Badge>
      )}
      
      {showStars && (
        <div className="flex items-center gap-1">
          <div className="flex">
            {stars.map((filled, i) => (
              <Star 
                key={i} 
                className={cn(
                  starSizeClasses[size], 
                  filled ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
                )} 
              />
            ))}
          </div>
          <span className={cn("font-medium text-slate-200 ml-1", sizeClasses[size])}>
            {score.toFixed(1)}
          </span>
          {reviews !== undefined && (
            <span className={cn("text-slate-400", sizeClasses[size])}>
              ({reviews})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
