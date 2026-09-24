import { RiRobot2Fill } from "react-icons/ri";
import { useLanguageContext } from "../../context/LanguageContext";

export default function Header({ rightSlot }) {
    const { t } = useLanguageContext();
  return (
    <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:rounded-t-2xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
          <RiRobot2Fill size={18} />
        </div>
        <div>
       

<h1 className="text-sm font-semibold text-gray-800">{t("app_title")}</h1>
<p className="text-xs text-gray-400">{t("app_subtitle")}</p>
        </div>
      </div>

      {rightSlot}
    </div>
  );
}