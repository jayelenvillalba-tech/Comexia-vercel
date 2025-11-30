import { Search, TrendingUp, Calculator, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function HeroSection() {
  const { t } = useLanguage();

  const quickActions = [
    {
      icon: Search,
      titleKey: "hero.actions.hsSearch.title",
      descKey: "hero.actions.hsSearch.desc",
      bgColor: "bg-blue-100",
      iconColor: "text-kora-primary"
    },
    {
      icon: TrendingUp,
      titleKey: "hero.actions.research.title",
      descKey: "hero.actions.research.desc",
      bgColor: "bg-green-100",
      iconColor: "text-kora-success"
    },
    {
      icon: Calculator,
      titleKey: "hero.actions.calculator.title",
      descKey: "hero.actions.calculator.desc",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Truck,
      titleKey: "hero.actions.tracking.title",
      descKey: "hero.actions.tracking.desc",
      bgColor: "bg-orange-100",
      iconColor: "text-kora-warning"
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-8 mb-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("hero.title")}</h2>
      <p className="text-lg text-gray-600 mb-6">{t("hero.subtitle")}</p>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <div className={`${action.bgColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`${action.iconColor} text-xl w-6 h-6`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t(action.titleKey)}</h3>
              <p className="text-sm text-gray-600">{t(action.descKey)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
