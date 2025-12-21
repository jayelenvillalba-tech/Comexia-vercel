import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface Alert {
  id: string;
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export function AlertsTicker() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    queryFn: async () => {
        const res = await fetch("/api/alerts?urgency=high");
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    }
  });

  const criticalAlert = alerts?.find(a => a.severity === 'critical' || a.severity === 'high');

  if (!isVisible || !criticalAlert) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center justify-between relative z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer flex-1"
        onClick={() => setLocation('/alerts')}
      >
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span className="uppercase tracking-wider font-bold text-red-100 mr-2">
            REGULATORY ALERT:
        </span>
        <span className="truncate">
            {criticalAlert.title}
        </span>
        <span className="ml-2 underline text-red-200 text-xs hidden md:inline">
            Read more
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-red-200 hover:text-white ml-4 p-1 rounded-full hover:bg-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
