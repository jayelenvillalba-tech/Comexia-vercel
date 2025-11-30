import { useState } from "react";
import { Truck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { Shipment } from "@shared/schema";

export default function ShipmentTracking() {
  const { t } = useLanguage();
  const [trackingQuery, setTrackingQuery] = useState("");

  const { data: shipments = [] } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-green-100 text-green-800";
      case "customs":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_transit":
        return t("tracking.status.inTransit");
      case "customs":
        return t("tracking.status.customs");
      case "delivered":
        return t("tracking.status.delivered");
      case "delayed":
        return t("tracking.status.delayed");
      default:
        return status;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-kora-success";
      case "customs":
        return "bg-kora-warning";
      case "delivered":
        return "bg-blue-500";
      case "delayed":
        return "bg-kora-error";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Truck className="mr-3 text-kora-warning w-5 h-5" />
        {t("tracking.title")}
      </h3>
      
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("tracking.searchPlaceholder")}
            value={trackingQuery}
            onChange={(e) => setTrackingQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        </div>
      </div>
      
      {/* Active Shipments */}
      <div className="space-y-3">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{shipment.trackingNumber}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(shipment.status)}`}>
                {getStatusLabel(shipment.status)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{shipment.origin} → {shipment.destination}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(shipment.status)}`}
                style={{ width: `${shipment.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {shipment.eta 
                ? `ETA: ${new Date(shipment.eta).toLocaleDateString()}`
                : t("tracking.pending")
              }
            </p>
          </div>
        ))}
        
        {shipments.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Truck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t("tracking.noShipments")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
