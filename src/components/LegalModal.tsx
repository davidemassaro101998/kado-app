import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, FileText, ShoppingBag } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

// TODO: Iubenda embed — in attesa di site ID da davidemassaro101998.
// Questo modal custom (privacy/terms/affiliate) resta la fonte
// attuale dei testi legali e deve continuare a funzionare finche'
// Iubenda non viene integrato al suo posto (o in aggiunta).

export type LegalDocType = "privacy" | "terms" | "affiliate" | null;

interface LegalModalProps {
  isOpen: boolean;
  type: LegalDocType;
  onClose: () => void;
  language: Language;
}

export const LegalModal: React.FC<LegalModalProps> = React.memo(({
  isOpen,
  type,
  onClose,
  language,
}) => {
  if (!isOpen || !type) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getTitle = () => {
    if (type === "privacy") return t.legalPrivacyTitle;
    if (type === "terms") return t.legalTermsTitle;
    return t.legalAffiliateTitle;
  };

  const getIcon = () => {
    if (type === "privacy") return <ShieldCheck className="w-5 h-5 text-[#FF4D6D]" />;
    if (type === "terms") return <FileText className="w-5 h-5 text-[#FF4D6D]" />;
    return <ShoppingBag className="w-5 h-5 text-[#FF4D6D]" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white text-[#000000] rounded-[28px] p-5 sm:p-6 max-w-lg w-full border border-[#E5E5EA] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden gpu-layer"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F2F2F7]">
                {getIcon()}
              </div>
              <h3 className="font-extrabold text-base text-[#000000]">
                {getTitle()}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F2F2F7] text-[#68686D] hover:text-[#000000] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs leading-relaxed font-normal text-[#000000] pr-1">
            {type === "privacy" && (
              <>
                <p className="font-bold text-sm text-[#FF4D6D]">
                  {t.legalPrivacyHeading}
                </p>
                <p>
                  <strong>{t.legalPrivacyItem1Title}</strong> {t.legalPrivacyItem1Text}
                </p>
                <p>
                  <strong>{t.legalPrivacyItem2Title}</strong> {t.legalPrivacyItem2Text}
                </p>
                <p>
                  <strong>{t.legalPrivacyItem3Title}</strong> {t.legalPrivacyItem3Text}
                </p>
                <p>
                  <strong>{t.legalPrivacyItem4Title}</strong> {t.legalPrivacyItem4Text}
                </p>
                <p>
                  <strong>{t.legalPrivacyItem5Title}</strong> {t.legalPrivacyItem5Text}
                </p>
              </>
            )}

            {type === "terms" && (
              <>
                <p className="font-bold text-sm text-[#FF4D6D]">
                  {t.legalTermsHeading}
                </p>
                <p>
                  <strong>{t.legalTermsItem1Title}</strong> {t.legalTermsItem1Text}
                </p>
                <p>
                  <strong>{t.legalTermsItem2Title}</strong> {t.legalTermsItem2Text}
                </p>
                <p>
                  <strong>{t.legalTermsItem3Title}</strong> {t.legalTermsItem3Text}
                </p>
                <p>
                  <strong>{t.legalTermsItem4Title}</strong> {t.legalTermsItem4Text}
                </p>
              </>
            )}

            {type === "affiliate" && (
              <>
                <p className="font-bold text-sm text-[#FF4D6D]">
                  {t.legalAffiliateHeading}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[#E5E5EA] font-semibold text-xs text-[#000000] space-y-2">
                  <p>
                    {t.legalAffiliateQuote}
                  </p>
                  <p className="text-[11px] font-normal text-[#68686D]">
                    {t.legalAffiliateProgramText}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[#E5E5EA] space-y-1.5">
                  <span className="font-bold text-xs text-[#000000] block">
                    {t.legalAffiliatePriceDisclaimerTitle}
                  </span>
                  <p className="text-[11px] text-[#68686D] leading-relaxed">
                    {t.legalAffiliatePriceDisclaimerText}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E5E5EA] mt-3 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-[#FF4D6D] text-white font-bold text-xs cursor-pointer hover:bg-[#E63354] transition-colors"
            >
              {t.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
