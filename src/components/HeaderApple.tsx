import React, { useState } from "react";
import { Ribbon3D } from "./Ribbon3D";
import { CountryConfig } from "../types";
import { COUNTRIES } from "../data/countries";
import { Globe, Check, X, Languages, Settings } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";
import { FlagIcon } from "./FlagIcon";

interface HeaderAppleProps {
  currentCountry: CountryConfig;
  onSelectCountry: (country: CountryConfig) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenSettings?: () => void;
  onGoHome: () => void;
}

export const HeaderApple: React.FC<HeaderAppleProps> = React.memo(({
  currentCountry,
  onSelectCountry,
  language,
  onSelectLanguage,
  onOpenSettings,
  onGoHome,
}) => {
  const [showGeoModal, setShowGeoModal] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <>
      <header className="w-full shrink-0 border-b border-[#2B2130] bg-[#0E0910]/90 backdrop-blur-xl z-30 pt-[max(12px,env(safe-area-inset-top,0px))] pb-2.5 px-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] min-h-[52px] flex items-center justify-between">
        <div className="w-full max-w-lg sm:max-w-2xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group active:scale-95 transition-transform"
          >
            <Ribbon3D size="sm" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#F7F0F2]">
              Kado <span className="text-[#FF3D7F] font-black">AI</span>
            </span>
          </button>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Country & Language Picker Pill */}
            <button
              onClick={() => setShowGeoModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1520] hover:bg-[#241A28] active:scale-95 border border-[#2B2130] text-[#F7F0F2] text-xs font-semibold shadow-2xs transition-transform cursor-pointer h-[34px]"
            >
              <FlagIcon code={language} className="w-4 h-3" />
              <span className="font-extrabold text-[#F7F0F2] uppercase">
                {language.toUpperCase()}
              </span>
              {currentCountry.code.toLowerCase() !== language.toLowerCase() && (
                <span className="text-[10px] text-[#9B8A93] font-extrabold uppercase border-l border-[#2B2130] pl-1.5 flex items-center gap-1">
                  <FlagIcon code={currentCountry.code} className="w-3.5 h-2.5" />
                  {currentCountry.code}
                </span>
              )}
              <Globe className="w-3.5 h-3.5 text-[#9B8A93] ml-0.5" />
            </button>

            {/* Settings Gear Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                aria-label="Settings"
                className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#1C1520] hover:bg-[#241A28] active:scale-95 border border-[#2B2130] text-[#F7F0F2] shadow-2xs transition-transform cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#F7F0F2]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Language & Region Modal */}
      {showGeoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-[#17111A] border border-[#2B2130] p-5 shadow-2xl relative max-h-[85vh] flex flex-col my-auto text-[#F7F0F2]">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FF3D7F] text-white shadow-xs">
                  <Languages className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-[#F7F0F2]">{t.selectLanguageRegion}</h3>
              </div>
              <button
                onClick={() => setShowGeoModal(false)}
                aria-label={language === "it" ? "Chiudi" : "Close"}
                className="p-1.5 rounded-full hover:bg-[#1C1520] text-[#9B8A93] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9B8A93] font-medium mb-3 shrink-0">
              {t.regionNotice}
            </p>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Language Selector */}
              <div className="p-3 rounded-2xl bg-[#1C1520] border border-[#2B2130] space-y-2">
                <span className="text-xs font-bold text-[#F7F0F2] uppercase tracking-wider block">
                  {t.language}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectLanguage("en")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      language === "en"
                        ? "bg-[#FF3D7F] text-white border-[#FF3D7F] shadow-xs"
                        : "bg-[#17111A] text-[#F7F0F2] border-[#2B2130] hover:bg-[#2B2130]"
                    }`}
                  >
                    <FlagIcon code="GB" className="w-4 h-3" />
                    <span>English</span>
                    {language === "en" && <Check className="w-3.5 h-3.5 text-white ml-auto" />}
                  </button>

                  <button
                    onClick={() => onSelectLanguage("it")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      language === "it"
                        ? "bg-[#FF3D7F] text-white border-[#FF3D7F] shadow-xs"
                        : "bg-[#17111A] text-[#F7F0F2] border-[#2B2130] hover:bg-[#2B2130]"
                    }`}
                  >
                    <FlagIcon code="IT" className="w-4 h-3" />
                    <span>Italiano</span>
                    {language === "it" && <Check className="w-3.5 h-3.5 text-white ml-auto" />}
                  </button>
                </div>
              </div>

              {/* Store Region */}
              <div className="p-3 rounded-2xl bg-[#1C1520] border border-[#2B2130] space-y-2">
                <span className="text-xs font-bold text-[#F7F0F2] uppercase tracking-wider block">
                  {t.storeRegion}
                </span>
                <div className="space-y-1.5">
                  {COUNTRIES.map((c) => {
                    const isSelected = c.code === currentCountry.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => {
                          onSelectCountry(c);
                          if (c.code === "IT" && language !== "it") {
                            onSelectLanguage("it");
                          }
                          setShowGeoModal(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FF3D7F] text-white font-bold shadow-xs"
                            : "bg-[#17111A] text-[#F7F0F2] hover:bg-[#2B2130] border border-[#2B2130]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FlagIcon code={c.code} className="w-5 h-3.5" />
                          <div className="text-left">
                            <div className="font-extrabold">{c.name}</div>
                            <div className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#9B8A93]"}`}>
                              {c.amazonDomain} ({c.currency})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
