import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, X, Sparkles, Send } from "lucide-react";
import { Language } from "../data/translations";

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
      setErrorMsg(
        language === "it"
          ? "Riconoscimento vocale non supportato nel browser. Puoi digitare la tua idea!"
          : "Voice recognition not supported in browser. You can type your idea!"
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language === "it" ? "it-IT" : "en-US";
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
        if (event.error === "not-allowed") {
          setErrorMsg(
            language === "it"
              ? "Permesso microfono negato. Puoi digitare la tua idea qui sotto."
              : "Microphone permission denied. You can type below."
          );
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
                  {language === "it" ? "Assistente Vocale AI" : "AI Voice Assistant"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-[#F2F2F7] text-[#8E8E93] hover:text-[#000000] transition-colors cursor-pointer"
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
                  <MicOff className="w-8 h-8 text-[#8E8E93] stroke-[2]" />
                )}
              </button>

              {/* Dynamic Waveform Bars in Apple Blue #007AFF */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[0.4, 0.9, 0.6, 1.0, 0.7, 0.8, 0.5].map((heightScale, idx) => (
                  <motion.div
                    key={idx}
                    animate={
                      isListening
                        ? {
                            height: [
                              `${12 * heightScale}px`,
                              `${30 * heightScale}px`,
                              `${12 * heightScale}px`,
                            ],
                          }
                        : { height: "6px" }
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
                    className={`w-1.5 rounded-full ${
                      isListening ? "bg-[#007AFF]" : "bg-[#E5E5EA]"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-[#8E8E93]">
                {isListening
                  ? language === "it"
                    ? "In ascolto... Parla liberamente"
                    : "Listening... Speak freely"
                  : language === "it"
                  ? "Tocca il microfono per parlare"
                  : "Tap microphone to speak"}
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] block text-left">
                {language === "it" ? "Trascrizione Live / Idea:" : "Live Transcript / Idea:"}
              </label>

              <div className="relative w-full">
                <textarea
                  rows={3}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={
                    language === "it"
                      ? "Es. Regalo tecnologico per papà appassionato di caffè sotto i 50€..."
                      : "E.g. Tech gift for dad who loves coffee under 50€..."
                  }
                  className="w-full p-3.5 rounded-[18px] bg-[#F2F2F7] text-[#000000] placeholder-[#8E8E93] text-base sm:text-lg font-bold leading-snug border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF] transition-colors resize-none"
                />
                {transcript && (
                  <button
                    type="button"
                    onClick={() => setTranscript("")}
                    className="absolute right-3 top-3 p-1 rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:text-[#000000] transition-colors cursor-pointer"
                    title="Cancella"
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
                {language === "it" ? "TROVA REGALO ORA" : "FIND GIFT NOW"}
              </span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
