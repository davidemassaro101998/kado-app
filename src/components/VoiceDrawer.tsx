import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, X, Sparkles, Send } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

// Locale used for the browser SpeechRecognition API, one per supported language.
const SPEECH_LOCALES: Record<Language, string> = {
  en: "en-US",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
};

interface VoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIdea: (idea: string) => void;
  initialTranscript?: string;
  language?: Language;
}

export const VoiceDrawer: React.FC<VoiceDrawerProps> = React.memo(({
  isOpen,
  onClose,
  onSubmitIdea,
  initialTranscript = "",
  language = "it",
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [transcript, setTranscript] = useState<string>(initialTranscript);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync initialTranscript when opened. The mic itself is NOT auto-started here:
  // starting SpeechRecognition outside a direct user-gesture click handler makes
  // several browsers (notably Safari/iOS and embedded PWA/webview contexts) silently
  // refuse to ever show the mic permission prompt. Recognition only starts from the
  // toggleMic() click handler below, which preserves the user-gesture chain.
  useEffect(() => {
    if (isOpen) {
      setTranscript(initialTranscript);
      setErrorMsg(null);
    } else {
      stopSpeechRecognition();
    }
    return () => {
      stopSpeechRecognition();
    };
  }, [isOpen, initialTranscript]);

  const startSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(t.voiceNotSupported);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LOCALES[language] || "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        // "no-speech" (user just went quiet) and "aborted" (user tapped
        // stop) are expected, not failures — nothing to tell the user.
        // Everything else (denied permission, no mic hardware, or the
        // browser's speech backend needing network and not getting it —
        // Chrome's Web Speech API is server-based, so this fires for a
        // flaky connection too) previously failed completely silently:
        // the mic icon just stopped listening with zero explanation.
        // Surfacing the same actionable fallback for all of them beats
        // a user left wondering why voice input "just stopped working".
        if (event.error !== "no-speech" && event.error !== "aborted") {
          setErrorMsg(t.voiceMicDenied);
        }
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText.trim()) {
          setTranscript(currentText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const handleSubmit = () => {
    stopSpeechRecognition();
    const finalIdea = transcript.trim();
    if (!finalIdea) return;
    onClose();
    onSubmitIdea(finalIdea);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-[#000000]/40 backdrop-blur-md"
          />

          {/* Voice Drawer Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-[9991] max-w-lg mx-auto bg-white/95 backdrop-blur-[25px] border-t border-[#E5E5EA] rounded-t-[32px] p-6 pb-[max(24px,env(safe-area-inset-bottom,0px))] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col items-center gap-5 select-none font-sans gpu-layer"
          >
            {/* Grab Handle Header */}
            <div className="w-12 h-1.5 rounded-full bg-[#E5E5EA] shrink-0 -mt-1" />

            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#007AFF]">
                <Sparkles className="w-4 h-4 fill-[#007AFF]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t.voiceDrawerTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-[#F2F2F7] text-[#68686D] hover:text-[#000000] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Central Vector Mic & Waveform Animation */}
            <div className="flex flex-col items-center gap-4 py-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isListening
                    ? "bg-[#007AFF] text-white shadow-[0_0_28px_rgba(0,122,255,0.5)]"
                    : "bg-[#F2F2F7] text-[#007AFF] border border-[#E5E5EA]"
                }`}
              >
                {/* Ripple Effect ring when listening */}
                {isListening && (
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-[#007AFF]"
                  />
                )}
                {isListening ? (
                  <Mic className="w-9 h-9 text-white stroke-[2.5]" />
                ) : (
                  <MicOff className="w-8 h-8 text-[#68686D] stroke-[2]" />
                )}
              </button>

              {/* Dynamic Waveform Bars in Apple Blue #007AFF.
                  Fixed-height bars animated via scaleY (compositor-only
                  transform) instead of animating `height` directly — the
                  latter forces a layout+paint on every frame across all 7
                  bars simultaneously, which is what was dropping frames
                  below 60fps while listening. */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[0.4, 0.9, 0.6, 1.0, 0.7, 0.8, 0.5].map((heightScale, idx) => (
                  <motion.div
                    key={idx}
                    animate={
                      isListening
                        ? { scaleY: [0.4 * heightScale, heightScale, 0.4 * heightScale] }
                        : { scaleY: 0.2 }
                    }
                    transition={
                      isListening
                        ? {
                            duration: 0.6 + idx * 0.1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        : { duration: 0.2 }
                    }
                    className={`w-1.5 h-[30px] rounded-full gpu-layer ${
                      isListening ? "bg-[#007AFF]" : "bg-[#E5E5EA]"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-[#68686D]">
                {isListening ? t.voiceListeningHint : t.voiceTapToSpeakHint}
              </span>
            </div>

            {/* Error banner if any */}
            {errorMsg && (
              <p className="text-[11px] font-medium text-red-500 text-center px-2">
                {errorMsg}
              </p>
            )}

            {/* Live Transcription Area & Quick-Edit Textbox */}
            <div className="w-full space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#68686D] block text-left">
                {t.voiceTranscriptLabel}
              </label>

              <div className="relative w-full">
                <textarea
                  rows={3}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={t.voiceTranscriptPlaceholder}
                  className="w-full p-3.5 rounded-[18px] bg-[#F2F2F7] text-[#000000] placeholder-[#68686D] text-base sm:text-lg font-bold leading-snug border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF] transition-colors resize-none"
                />
                {transcript && (
                  <button
                    type="button"
                    onClick={() => setTranscript("")}
                    className="absolute right-3 top-3 p-1 rounded-full bg-[#E5E5EA] text-[#68686D] hover:text-[#000000] transition-colors cursor-pointer"
                    title={t.clear}
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!transcript.trim()}
              onClick={handleSubmit}
              className="w-full py-4 px-6 rounded-[20px] bg-[#007AFF] hover:bg-[#0062CC] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(0,122,255,0.3)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-[#007AFF] shrink-0 mt-1"
            >
              <Send className="w-4 h-4 fill-current stroke-[2]" />
              <span>
                {t.voiceFindGiftBtn}
              </span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
