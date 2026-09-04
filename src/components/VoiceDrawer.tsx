import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, X, Sparkles, Send } from "lucide-react";
import { Language } from "../data/translations";

interface VoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIdea: (idea: string) => void;
  initialTranscript?: string;
  language?: Language;
}

export interface VoiceDrawerHandle {
  startListening: () => void;
}

/* Il tag BCP-47 per il riconoscimento. Passare "en-US" a chi parla
   italiano non degrada la trascrizione: la rende inservibile, perche il
   motore prova a mappare i suoni su un altro inventario fonetico. */
const RECOGNITION_LANG: Record<Language, string> = {
  it: "it-IT",
  en: "en-US",
};

const COPY = {
  it: {
    title: "Assistente vocale",
    close: "Chiudi",
    start: "Inizia ad ascoltare",
    stop: "Ferma l'ascolto",
    listening: "Ti ascolto — parla pure",
    idle: "Tocca il microfono e parla",
    label: "Quello che hai detto",
    placeholder: "Es. Regalo tech per papà appassionato di caffè, sui 50 euro",
    submit: "TROVA REGALO ORA",
    clear: "Cancella",
    errNoSupport: "Il tuo browser non gestisce il riconoscimento vocale. Scrivi qui sotto: funziona identico.",
    errBlocked:
      "Microfono bloccato per questo sito. Riattivalo dalle impostazioni del browser (tocca il lucchetto o la 'ⓘ' vicino all'indirizzo → Microfono → Consenti), oppure scrivi qui sotto.",
    errNoSpeech: "Non ho sentito nulla. Riprova avvicinando il telefono, o scrivi qui sotto.",
    errNoMic: "Nessun microfono disponibile. Scrivi la tua idea qui sotto.",
    errNetwork: "Il riconoscimento vocale ha perso la connessione. Riprova, o scrivi qui sotto.",
    errGeneric: "Il riconoscimento vocale si è interrotto. Riprova, o scrivi qui sotto.",
  },
  en: {
    title: "Voice assistant",
    close: "Close",
    start: "Start listening",
    stop: "Stop listening",
    listening: "Listening — go ahead",
    idle: "Tap the mic and speak",
    label: "What you said",
    placeholder: "E.g. Tech gift for dad who loves coffee, around 50",
    submit: "FIND GIFT NOW",
    clear: "Clear",
    errNoSupport: "Your browser doesn't do speech recognition. Type below instead — it works the same.",
    errBlocked:
      "Microphone blocked for this site. Re-enable it in your browser settings (tap the padlock or 'ⓘ' next to the address → Microphone → Allow), or type below.",
    errNoSpeech: "I didn't hear anything. Try holding the phone closer, or type below.",
    errNoMic: "No microphone available. Type your idea below.",
    errNetwork: "Speech recognition lost its connection. Try again, or type below.",
    errGeneric: "Speech recognition stopped. Try again, or type below.",
  },
} as const;

const BAR_COUNT = 7;

export const VoiceDrawer = React.memo(forwardRef<VoiceDrawerHandle, VoiceDrawerProps>(({
  isOpen,
  onClose,
  onSubmitIdea,
  initialTranscript = "",
  language = "it",
}, ref) => {
  const t = COPY[language] ?? COPY.it;

  /* Il testo confermato dal motore e quello ancora provvisorio stanno
     separati. Tenerli insieme e' esattamente il bug che faceva comparire
     parole doppie: a ogni evento il vecchio codice riconcatenava TUTTI i
     risultati, compresi quelli non finali, che poi tornavano una seconda
     volta una volta confermati. */
  const [finalText, setFinalText] = useState(initialTranscript);
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /* Livello audio vero (0..1), non un'animazione finta: se le barre si
     muovono solo a tempo, l'utente non ha modo di sapere se il microfono
     lo sta davvero sentendo -- ed e' la prima cosa che vuole sapere. */
  const [level, setLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  /* L'intenzione dell'utente, separata dallo stato del motore: i browser
     mobili chiudono la sessione da soli dopo una pausa anche con
     continuous=true. Senza questo flag il microfono moriva a meta frase
     e nessuno lo riavviava. */
  const wantsListeningRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopMeter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevel(0);
  }, []);

  // Misura il volume dal microfono per animare le barre sul parlato vero.
  const startMeter = useCallback(async () => {
    if (audioCtxRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // Il parlato normale sta su RMS bassi: senza guadagno le barre
        // resterebbero quasi ferme anche mentre uno parla.
        setLevel(Math.min(1, rms * 4.5));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Il misuratore e' un di piu: se il browser lo nega, il
      // riconoscimento deve comunque poter funzionare.
    }
  }, []);

  const stopSpeechRecognition = useCallback((keepIntent = false) => {
    if (!keepIntent) wantsListeningRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try {
        recognition.stop();
      } catch {
        // gia' fermo
      }
    }
    setIsListening(false);
    setInterimText("");
    stopMeter();
  }, [stopMeter]);

  const startSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(t.errNoSupport);
      return;
    }

    if (recognitionRef.current) stopSpeechRecognition(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = RECOGNITION_LANG[language] ?? RECOGNITION_LANG.it;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        /* Si parte da resultIndex, non da zero: gli eventi successivi
           ripresentano solo il nuovo materiale. I risultati definitivi
           si accodano al testo confermato una volta sola; quelli
           provvisori restano a parte e vengono sostituiti a ogni evento
           invece di sommarsi. */
        let freshFinal = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) freshFinal += result[0].transcript;
          else interim += result[0].transcript;
        }
        if (freshFinal) {
          setFinalText((prev) => (prev ? `${prev.trimEnd()} ${freshFinal.trim()}` : freshFinal.trim()));
        }
        setInterimText(interim);
      };

      recognition.onerror = (event: any) => {
        const code = event?.error;
        // "aborted" e "no-speech" arrivano anche nel funzionamento
        // normale (l'utente ferma, o fa una pausa): non sono guasti da
        // sbandierare, e no-speech va gestito riavviando.
        if (code === "aborted") return;
        if (code === "no-speech") {
          if (wantsListeningRef.current) return;
          setErrorMsg(t.errNoSpeech);
          return;
        }
        wantsListeningRef.current = false;
        setIsListening(false);
        if (code === "not-allowed" || code === "service-not-allowed") setErrorMsg(t.errBlocked);
        else if (code === "audio-capture") setErrorMsg(t.errNoMic);
        else if (code === "network") setErrorMsg(t.errNetwork);
        else setErrorMsg(t.errGeneric);
      };

      recognition.onend = () => {
        /* Riavvio se l'utente non ha chiesto di fermarsi: Chrome su
           Android e Safari chiudono la sessione dopo qualche secondo di
           silenzio anche con continuous=true, ed e' il motivo per cui il
           microfono sembrava "spegnersi da solo". */
        if (wantsListeningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            return;
          } catch {
            // Se il riavvio non riesce si prosegue e si chiude pulito.
          }
        }
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      wantsListeningRef.current = true;
      recognition.start();
      void startMeter();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      wantsListeningRef.current = false;
      setIsListening(false);
      setErrorMsg(t.errGeneric);
    }
  }, [language, startMeter, stopSpeechRecognition, t]);

  /* Il testo iniziale si applica SOLO all'apertura. Prima questo effetto
     dipendeva anche da initialTranscript, e ogni volta che il genitore
     lo cambiava il cleanup spegneva il microfono a meta frase. */
  useEffect(() => {
    if (isOpen) {
      setFinalText(initialTranscript);
      setInterimText("");
      setErrorMsg(null);
    } else {
      stopSpeechRecognition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => () => stopSpeechRecognition(), [stopSpeechRecognition]);

  // Esc chiude: su desktop e' il gesto atteso da un pannello modale, e
  // senza di esso l'unica via d'uscita era centrare la X.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useImperativeHandle(ref, () => ({ startListening: startSpeechRecognition }));

  const toggleMic = () => {
    if (isListening) stopSpeechRecognition();
    else startSpeechRecognition();
  };

  const displayText = interimText ? `${finalText} ${interimText}`.trim() : finalText;

  const handleSubmit = () => {
    stopSpeechRecognition();
    const finalIdea = displayText.trim();
    if (!finalIdea) return;
    onClose();
    onSubmitIdea(finalIdea);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-[9991] mx-auto flex max-w-lg select-none flex-col items-center gap-5 rounded-t-[32px] border-t border-[#2B2130] bg-[#17111A]/95 p-6 pb-[max(24px,env(safe-area-inset-bottom,0px))] font-sans shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-lg gpu-layer"
          >
            <div className="-mt-1 h-1.5 w-12 shrink-0 rounded-full bg-[#2B2130]" />

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-[#FF2E7E]">
                <Sparkles className="h-4 w-4 fill-[#FF2E7E]" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.title}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="cursor-pointer rounded-full bg-[#1C1520] p-1.5 text-[#9B8A93] transition-colors hover:text-[#F7F0F2]"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={isListening}
                aria-label={isListening ? t.stop : t.start}
                className={`relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                  isListening
                    ? "bg-[#FF2E7E] text-[#0E0910] shadow-[0_0_28px_rgba(255,46,126,0.5)]"
                    : "border border-[#2B2130] bg-[#1C1520] text-[#FF2E7E]"
                }`}
              >
                {isListening && (
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-[#FF2E7E]"
                  />
                )}
                {/* Sempre l'icona del microfono acceso: il vecchio MicOff
                    da spento leggeva come "microfono disattivato", cioe'
                    esattamente il contrario dell'invito a premere. */}
                <Mic className={`h-9 w-9 stroke-[2.5] ${isListening ? "text-white" : "text-[#FF2E7E]"}`} />
              </button>

              {/* Le barre seguono il volume vero: al centro rispondono di
                  piu, ai lati di meno, come un indicatore da studio. */}
              <div className="flex h-8 items-center justify-center gap-1.5">
                {Array.from({ length: BAR_COUNT }).map((_, idx) => {
                  const distance = Math.abs(idx - (BAR_COUNT - 1) / 2) / ((BAR_COUNT - 1) / 2);
                  const weight = 1 - distance * 0.55;
                  const scaleY = isListening ? Math.max(0.18, level * weight * 1.6) : 0.18;
                  return (
                    <div
                      key={idx}
                      className={`h-[30px] w-1.5 rounded-full gpu-layer ${isListening ? "bg-[#FF2E7E]" : "bg-[#2B2130]"}`}
                      style={{
                        transform: `scaleY(${scaleY})`,
                        transition: "transform 70ms linear",
                      }}
                    />
                  );
                })}
              </div>

              <span className="text-xs font-semibold text-[#9B8A93]">
                {isListening ? t.listening : t.idle}
              </span>
            </div>

            {errorMsg && (
              <p className="px-2 text-center text-[11px] font-medium text-[#FF8FB0]">{errorMsg}</p>
            )}

            <div className="w-full space-y-2">
              <label className="block text-left text-[11px] font-bold uppercase tracking-wider text-[#9B8A93]">
                {t.label}
              </label>

              <div className="relative w-full">
                <textarea
                  rows={3}
                  value={displayText}
                  onChange={(e) => {
                    // Scrivere a mano sostituisce il testo confermato e
                    // azzera il provvisorio, altrimenti la trascrizione
                    // in arrivo tornerebbe a sovrascrivere la correzione.
                    setFinalText(e.target.value);
                    setInterimText("");
                  }}
                  placeholder={t.placeholder}
                  className="w-full resize-none rounded-[18px] border border-[#2B2130] bg-[#1C1520] p-3.5 text-base font-bold leading-snug text-[#F7F0F2] placeholder-[#9B8A93] transition-colors focus:border-[#FF2E7E] focus:outline-none sm:text-lg"
                />
                {displayText && (
                  <button
                    type="button"
                    onClick={() => {
                      setFinalText("");
                      setInterimText("");
                    }}
                    className="absolute right-3 top-3 cursor-pointer rounded-full bg-[#2B2130] p-1 text-[#9B8A93] transition-colors hover:text-[#F7F0F2]"
                    title={t.clear}
                    aria-label={t.clear}
                  >
                    <X className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={!displayText.trim()}
              onClick={handleSubmit}
              className="mt-1 flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[20px] border border-[#FF2E7E] bg-[#FF2E7E] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#0E0910] shadow-[0_8px_20px_rgba(255,46,126,0.3)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4 fill-current stroke-[2]" />
              <span>{t.submit}</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}));
