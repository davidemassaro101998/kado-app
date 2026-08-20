import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Vibrate,
  Mic,
  ShieldCheck,
  FileText,
  ShoppingBag,
  ExternalLink,
  Mail,
  Settings,
} from "lucide-react";
import { LegalDocType } from "./LegalModal";
import { Language, TRANSLATIONS } from "../data/translations";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  hapticEnabled: boolean;
  onToggleHaptic: (enabled: boolean) => void;
  onOpenLegalModal: (docType: LegalDocType) => void;
  onSendFeedback: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = React.memo(({
  isOpen,
  onClose,
  language = "it",
  hapticEnabled,
  onToggleHaptic,
  onOpenLegalModal,
  onSendFeedback,
}) => {
  const t = TRANSLATIONS[language || "it"] || TRANSLATIONS.en;
  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown");

  // Legge lo stato REALE del permesso (non solo se esiste hardware audio).
  // Supportato su Chrome/Edge; su Safari resta "unknown" finche l'utente
  // non prova ad attivarlo col bottone qui sotto.
  useEffect(() => {
    if (!isOpen || typeof navigator === "undefined" || !(navigator as any).permissions?.query) return;
    let status: PermissionStatus | null = null;
    (navigator as any).permissions
      .query({ name: "microphone" as PermissionName })
      .then((s: PermissionStatus) => {
        status = s;
        setMicPermission(s.state as any);
        s.onchange = () => setMicPermission(s.state as any);
      })
      .catch(() => setMicPermission("unknown"));
    return () => {
      if (status) status.onchange = null;
    };
  }, [isOpen]);

  // Unico punto dell'app, oltre al tap sul microfono nel drawer vocale,
  // che puo far comparire il prompt nativo del browser: e chiamato in
  // modo sincrono dal click dell'utente, quindi rispetta il requisito
  // di "user gesture" anche sui browser piu restrittivi.
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicPermission("granted");
    } catch {
      setMicPermission("denied");
    }
  };

  const triggerHaptic = () => {
    if (
      hapticEnabled &&
      typeof window !== "undefined" &&
      "navigator" in window &&
      window.navigator.vibrate
    ) {
      try {
        window.navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm h-full bg-white backdrop-blur-2xl border-l border-[#E5E5EA] pt-[max(16px,env(safe-area-inset-top,0px))] pb-[max(20px,env(safe-area-inset-bottom,0px))] px-5 shadow-2xl flex flex-col justify-between text-[#000000] font-sans overflow-hidden gpu-layer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA] mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FF4D6D] text-white shadow-xs">
                  <Settings className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#000000]">
                  {t.settingsTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F2F2F7] text-[#68686D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* 1. SEZIONE INTERAZIONE */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#68686D] uppercase tracking-wider block px-1">
                  {t.interactionSection}
                </span>

                {/* Haptic Switch */}
                <div className="p-3.5 rounded-[22px] bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Vibrate className="w-4 h-4 text-[#FF4D6D]" />
                    <span className="text-xs font-semibold">
                      {t.hapticFeedbackLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onToggleHaptic(!hapticEnabled);
                      if (!hapticEnabled && typeof window !== "undefined" && window.navigator.vibrate) {
                        window.navigator.vibrate(20);
                      }
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      hapticEnabled ? "bg-[#FF4D6D]" : "bg-[#E5E5EA]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        hapticEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 2. SEZIONE PERMESSI & PRIVACY */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#68686D] uppercase tracking-wider block px-1">
                  {t.permissionsSection}
                </span>

                {/* Microfono */}
                <div className="p-3.5 rounded-[22px] bg-[#F2F2F7] border border-[#E5E5EA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-[#FF4D6D]" />
                      <div>
                        <span className="text-xs font-semibold block">
                          {t.micLabel}
                        </span>
                        <span className="text-[10px] text-[#68686D] font-normal">
                          {micPermission === "granted"
                            ? t.micStatusGranted
                            : micPermission === "denied"
                            ? t.micStatusDenied
                            : micPermission === "prompt"
                            ? t.micStatusPrompt
                            : t.micStatusUnknown}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white border ${
                        micPermission === "granted"
                          ? "border-[#34C759] text-[#34C759]"
                          : micPermission === "denied"
                          ? "border-[#FF4D6D] text-[#FF4D6D]"
                          : "border-[#E5E5EA] text-[#68686D]"
                      }`}
                    >
                      {micPermission === "granted"
                        ? t.micBadgeOn
                        : micPermission === "denied"
                        ? t.micBadgeBlocked
                        : "—"}
                    </span>
                  </div>

                  {micPermission !== "granted" && (
                    <button
                      onClick={() => {
                        triggerHaptic();
                        requestMicAccess();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5E5EA] hover:border-[#FF4D6D] text-xs font-bold text-[#FF4D6D] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#FF4D6D]" />
                      <span>{t.micEnableBtn}</span>
                    </button>
                  )}

                  {micPermission === "denied" && (
                    <p className="text-[10px] text-[#68686D] text-center px-1 leading-relaxed">
                      {t.micBlockedHint}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. SEZIONE LEGALE & COMPLIANCE */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#68686D] uppercase tracking-wider block px-1">
                  {t.legalSection}
                </span>

                <div className="p-1 rounded-[22px] bg-[#F2F2F7] border border-[#E5E5EA] space-y-1">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("privacy");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#FF4D6D]" />
                      <span>{t.legalPrivacyTitle}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#68686D]" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("terms");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#FF4D6D]" />
                      <span>{t.termsLabel}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#68686D]" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("affiliate");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-[#FF4D6D]" />
                      <span>{t.affiliateLabel}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#68686D]" />
                  </button>
                </div>
              </div>

              {/* 4. SEZIONE SUPPORTO */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#68686D] uppercase tracking-wider block px-1">
                  {t.supportSection}
                </span>

                <div className="p-3.5 rounded-[22px] bg-[#F2F2F7] border border-[#E5E5EA] space-y-3">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      onSendFeedback();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#E5E5EA] hover:border-[#FF4D6D] text-xs font-bold text-[#FF4D6D] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4 text-[#FF4D6D]" />
                    <span>{t.sendFeedbackBtn}</span>
                  </button>

                  <div className="text-center pt-1 border-t border-[#E5E5EA] space-y-1">
                    <span className="text-[11px] text-[#68686D] font-medium block">
                      Kado AI v1.0.0 (Build Stable)
                    </span>
                    <span className="text-[10px] text-[#68686D] font-medium tracking-wide block">
                      {t.dgmAppsCredit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amazon Affiliate Legal Disclaimer Banner inside Drawer */}
              <div className="p-3.5 rounded-[22px] bg-[#F2F2F7] border border-[#E5E5EA]">
                <p className="text-[11px] text-[#68686D] font-normal leading-relaxed text-center">
                  {t.affiliateDisclaimerShort}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
