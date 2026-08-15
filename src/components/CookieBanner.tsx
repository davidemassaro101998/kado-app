import React, { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

interface CookieBannerProps {
  language: Language;
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = React.memo(({
  language,
  onOpenPrivacy,
}) => {
  const [accepted, setAccepted] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kado_cookie_accepted");
      if (stored !== "true") {
        setAccepted(false);
      }
    } catch (e) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("kado_cookie_accepted", "true");
    } catch (e) {
      // ignore
    }
    setAccepted(true);
  };

  if (accepted) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[95] bg-[#000000]/95 backdrop-blur-md text-white border-t border-white/10 px-3.5 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom,0px))] sm:py-3 text-xs flex items-center justify-between gap-3 shadow-2xl">
      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/90 max-w-2xl">
        <Cookie className="w-4 h-4 text-[#007AFF] shrink-0" />
        <span className="leading-snug">{t.cookieText}</span>
        <button
          onClick={onOpenPrivacy}
          className="underline text-[#007AFF] font-bold hover:text-white shrink-0 cursor-pointer ml-1"
        >
          {t.legalPrivacyTitle}
        </button>
      </div>

      <button
        onClick={handleAccept}
        className="py-1.5 px-4 rounded-xl bg-[#007AFF] text-white font-bold text-xs hover:bg-[#0062CC] active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm"
      >
        {t.cookieAccept}
      </button>
    </div>
  );
});
