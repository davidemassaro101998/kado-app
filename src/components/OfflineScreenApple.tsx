import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

interface OfflineScreenAppleProps {
  language?: Language;
}

export const OfflineScreenApple: React.FC<OfflineScreenAppleProps> = ({
  language = "it",
}) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean") {
      return !navigator.onLine;
    }
    return false;
  });

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOffline(false);
      } else {
        setIsOffline(true);
      }
      setIsChecking(false);
    }, 600);
  };

  if (!isOffline) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-[#F2F2F7] flex flex-col items-center justify-center p-6 text-center select-none font-sans"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-sm bg-white border border-[#E5E5EA] rounded-[28px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.1)] flex flex-col items-center gap-4"
        >
          {/* Slashed Wi-Fi Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center text-[#68686D]">
            <WifiOff className="w-8 h-8 text-[#68686D] stroke-[2]" />
          </div>

          <div className="space-y-1.5 text-center">
            <h2 className="text-lg font-extrabold tracking-tight text-[#000000]">
              {t.offlineTitle}
            </h2>
            <p className="text-xs text-[#68686D] leading-relaxed font-normal">
              {t.offlineText}
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full mt-2 py-3.5 px-4 rounded-[18px] bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.97] transition-all border border-[#FF4D6D] disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? t.offlineChecking : t.offlineRetryBtn}</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
