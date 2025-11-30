import { PieChart } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function QuickStats() {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("stats.todayQueries"),
      value: "1,247"
    },
    {
      label: t("stats.registeredCompanies"),
      value: "12,589"
    },
    {
      label: t("stats.availableCountries"),
      value: "195"
    },
    {
      label: t("stats.hsCodes"),
      value: "5,387"
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <PieChart className="mr-3 text-kora-success w-5 h-5" />
        {t("stats.title")}
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{stat.label}:</span>
            <span className="font-bold text-lg text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
