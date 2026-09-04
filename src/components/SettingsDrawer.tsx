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

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  theme: "light";
  onSelectTheme: (theme: "light") => void;
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
  const isIt = language === "it";
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
            className="w-full max-w-sm h-full bg-[#17111A] backdrop-blur-2xl border-l border-[#2B2130] pt-[max(16px,env(safe-area-inset-top,0px))] pb-[max(20px,env(safe-area-inset-bottom,0px))] px-5 shadow-2xl flex flex-col justify-between text-[#F7F0F2] font-sans overflow-hidden gpu-layer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2B2130] mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FF2E7E] text-white shadow-xs">
                  <Settings className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#F7F0F2]">
                  {isIt ? "Impostazioni & App" : "Settings & App"}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label={isIt ? "Chiudi" : "Close"}
                className="p-1.5 rounded-full hover:bg-[#1C1520] text-[#9B8A93] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* 1. SEZIONE INTERAZIONE */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#9B8A93] uppercase tracking-wider block px-1">
                  {isIt ? "INTERAZIONE" : "INTERACTION"}
                </span>

                {/* Haptic Switch */}
                <div className="p-3.5 rounded-[22px] bg-[#1C1520] border border-[#2B2130] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Vibrate className="w-4 h-4 text-[#FF2E7E]" />
                    <span className="text-xs font-semibold">
                      {isIt ? "Feedback Tattile (Vibrazione)" : "Haptic Feedback"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onToggleHaptic(!hapticEnabled);
                      if (!hapticEnabled && typeof window !== "undefined" && window.navigator.vibrate) {
                        window.navigator.vibrate(20);
                      }
                    }}
                    role="switch"
                    aria-checked={hapticEnabled}
                    aria-label={isIt ? "Feedback Tattile (Vibrazione)" : "Haptic Feedback"}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      hapticEnabled ? "bg-[#FF2E7E]" : "bg-[#2B2130]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-[#17111A] shadow-md transform transition-transform ${
                        hapticEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 2. SEZIONE PERMESSI & PRIVACY */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#9B8A93] uppercase tracking-wider block px-1">
                  {isIt ? "PERMESSI & PRIVACY" : "PERMISSIONS & PRIVACY"}
                </span>

                {/* Microfono */}
                <div className="p-3.5 rounded-[22px] bg-[#1C1520] border border-[#2B2130] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-[#FF2E7E]" />
                      <div>
                        <span className="text-xs font-semibold block">
                          {isIt ? "Microfono (Ricerca Vocale)" : "Microphone (Voice Search)"}
                        </span>
                        <span className="text-[10px] text-[#9B8A93] font-normal">
                          {micPermission === "granted"
                            ? isIt ? "Permesso concesso" : "Permission granted"
                            : micPermission === "denied"
                            ? isIt ? "Permesso negato dal browser" : "Denied by browser"
                            : micPermission === "prompt"
                            ? isIt ? "Non ancora richiesto" : "Not requested yet"
                            : isIt ? "Da verificare" : "Not checked yet"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full bg-[#17111A] border ${
                        micPermission === "granted"
                          ? "border-[#34C759] text-[#34C759]"
                          : micPermission === "denied"
                          ? "border-[#FF2E7E] text-[#FF2E7E]"
                          : "border-[#2B2130] text-[#9B8A93]"
                      }`}
                    >
                      {micPermission === "granted"
                        ? isIt ? "Attivo" : "On"
                        : micPermission === "denied"
                        ? isIt ? "Bloccato" : "Blocked"
                        : "—"}
                    </span>
                  </div>

                  {micPermission !== "granted" && (
                    <button
                      onClick={() => {
                        triggerHaptic();
                        requestMicAccess();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#17111A] border border-[#2B2130] hover:border-[#FF2E7E] text-xs font-bold text-[#FF2E7E] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#FF2E7E]" />
                      <span>{isIt ? "Attiva Permesso Microfono" : "Enable Microphone Permission"}</span>
                    </button>
                  )}

                  {micPermission === "denied" && (
                    <p className="text-[10px] text-[#9B8A93] text-center px-1 leading-relaxed">
                      {isIt
                        ? "Hai bloccato il microfono per questo sito. Riattivalo dalle impostazioni del browser (icona lucchetto nella barra indirizzo)."
                        : "You've blocked the microphone for this site. Re-enable it from your browser's site settings (padlock icon in the address bar)."}
                    </p>
                  )}
                </div>

              </div>

              {/* 3. SEZIONE LEGALE & COMPLIANCE */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#9B8A93] uppercase tracking-wider block px-1">
                  {isIt ? "LEGALE & COMPLIANCE" : "LEGAL & COMPLIANCE"}
                </span>

                <div className="p-1 rounded-[22px] bg-[#1C1520] border border-[#2B2130] space-y-1">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("privacy");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-[#241A28] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#FF2E7E]" />
                      <span>Privacy Policy (GDPR EU)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9B8A93]" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("terms");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-[#241A28] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#FF2E7E]" />
                      <span>{isIt ? "Termini e Condizioni" : "Terms & Conditions"}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9B8A93]" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenLegalModal("affiliate");
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-[#241A28] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-[#FF2E7E]" />
                      <span>{isIt ? "Affiliazione Amazon & Disclaimers" : "Amazon Affiliate & Disclaimers"}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9B8A93]" />
                  </button>
                </div>
              </div>

              {/* 4. SEZIONE SUPPORTO */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#9B8A93] uppercase tracking-wider block px-1">
                  {isIt ? "SUPPORTO & INFO" : "SUPPORT & INFO"}
                </span>

                <div className="p-3.5 rounded-[22px] bg-[#1C1520] border border-[#2B2130] space-y-3">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      onSendFeedback();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#17111A] border border-[#2B2130] hover:border-[#FF2E7E] text-xs font-bold text-[#FF2E7E] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4 text-[#FF2E7E]" />
                    <span>{isIt ? "Invia un Feedback" : "Send Feedback"}</span>
                  </button>

                  <div className="text-center pt-1 border-t border-[#2B2130]">
                    <span className="text-[11px] text-[#9B8A93] font-medium block">
                      Kado AI v1.0.0 (Build Stable)
                    </span>
                  </div>
                </div>
              </div>

              {/* Amazon Affiliate Legal Disclaimer Banner inside Drawer */}
              <div className="p-3.5 rounded-[22px] bg-[#1C1520] border border-[#2B2130]">
                <p className="text-[11px] text-[#9B8A93] font-normal leading-relaxed text-center">
                  {isIt
                    ? "In qualità di Affiliato Amazon, Kado AI riceve un guadagno dagli acquisti idonei."
                    : "As an Amazon Associate, Kado AI earns from qualifying purchases."}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
