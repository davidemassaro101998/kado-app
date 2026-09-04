import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Share, PlusSquare, MoreVertical } from "lucide-react";
import { Language } from "../data/translations";

interface OnboardingHelpModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  language?: Language;
}

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export const OnboardingHelpModal: React.FC<OnboardingHelpModalProps> = ({
  isOpen,
  onDismiss,
  language = "it",
}) => {
  const platform = useMemo(detectPlatform, []);
  const showInstallTip = useMemo(() => !isStandalone() && platform !== "other", [platform]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9995] flex items-end justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-lg mx-auto bg-[#17111A] rounded-t-[32px] p-6 pb-[max(24px,env(safe-area-inset-bottom,0px))] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col items-center gap-4 select-none font-sans"
          >
            <div className="w-12 h-1.5 rounded-full bg-[#2B2130] shrink-0 -mt-1" />

            <div className="w-16 h-16 rounded-full bg-[#FF2E7E]/10 flex items-center justify-center shrink-0">
              <Mic className="w-7 h-7 text-[#FF2E7E] stroke-[2.2]" />
            </div>

            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-[#F7F0F2]">
                {language === "it" ? "Benvenuto su Kado AI" : "Welcome to Kado AI"}
              </h2>
              <p className="text-sm text-[#F7F0F2] leading-relaxed font-medium">
                {language === "it"
                  ? "L'AI ti trova il regalo perfetto su Amazon in 3 tap: dì o scegli per chi è, che stile ha e il budget."
                  : "AI finds the perfect gift on Amazon in 3 taps: say or pick who it's for, their style, and your budget."}
              </p>
              <p className="text-sm text-[#9B8A93] leading-relaxed">
                {language === "it"
                  ? "Tocca il microfono e descrivi a voce chi è il destinatario: se al primo utilizzo il telefono chiede il permesso al microfono, tocca \"Consenti\" per usare la ricerca vocale."
                  : "Tap the mic and describe the recipient out loud: if your phone asks for microphone permission the first time, tap \"Allow\" to use voice search."}
              </p>
            </div>

            {showInstallTip && (
              <div className="w-full rounded-[18px] bg-[#1C1520] p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#17111A] shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  {platform === "ios" ? (
                    <Share className="w-4 h-4 text-[#FF2E7E]" />
                  ) : (
                    <MoreVertical className="w-4 h-4 text-[#FF2E7E]" />
                  )}
                </div>
                <p className="text-xs text-[#F7F0F2] leading-relaxed pt-1">
                  {platform === "ios" ? (
                    language === "it" ? (
                      <>Consiglio: tocca <b>Condividi</b> <Share className="w-3 h-3 inline-block align-[-1px]" /> in basso, poi <b>"Aggiungi a Home"</b> <PlusSquare className="w-3 h-3 inline-block align-[-1px]" /> per usarla come un'app vera.</>
                    ) : (
                      <>Tip: tap <b>Share</b> <Share className="w-3 h-3 inline-block align-[-1px]" /> below, then <b>"Add to Home Screen"</b> <PlusSquare className="w-3 h-3 inline-block align-[-1px]" /> to use it like a real app.</>
                    )
                  ) : language === "it" ? (
                    <>Consiglio: tocca i <b>tre puntini</b> <MoreVertical className="w-3 h-3 inline-block align-[-1px]" /> in alto, poi <b>"Aggiungi a schermata Home"</b> per usarla come un'app vera.</>
                  ) : (
                    <>Tip: tap the <b>three dots</b> <MoreVertical className="w-3 h-3 inline-block align-[-1px]" /> at the top, then <b>"Add to Home screen"</b> to use it like a real app.</>
                  )}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onDismiss}
              className="w-full py-3.5 px-6 rounded-[20px] bg-[#FF2E7E] hover:bg-[#E01E68] text-[#0E0910] font-black text-sm uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer mt-1"
            >
              {language === "it" ? "Capito" : "Got it"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
