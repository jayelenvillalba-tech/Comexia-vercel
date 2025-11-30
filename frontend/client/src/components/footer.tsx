import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-kora-primary text-white p-2 rounded-lg">
                <Globe className="text-sm w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Che.Comex</h3>
            </div>
            <p className="text-sm text-gray-600">{t("footer.description")}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t("footer.services.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-kora-primary">{t("footer.services.hsSearch")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.services.marketResearch")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.services.companyDirectory")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.services.costCalculator")}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t("footer.resources.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-kora-primary">{t("footer.resources.tradeGuides")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.resources.apiDocs")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.resources.helpCenter")}</a></li>
              <li><a href="#" className="hover:text-kora-primary">{t("footer.resources.blog")}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t("footer.contact.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Mail className="mr-2 w-4 h-4" /> 
                info@che.comex
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 w-4 h-4" /> 
                +54 11 1234-5678
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 w-4 h-4" /> 
                Buenos Aires, Argentina
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
